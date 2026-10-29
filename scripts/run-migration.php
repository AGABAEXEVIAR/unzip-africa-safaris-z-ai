<?php
/**
 * Migration runner (PHP) — runs a .sql file against the Hostinger MySQL DB.
 *
 * Hostinger's SSH doesn't put `node` in PATH by default, so this PHP version
 * is provided as an alternative to scripts/run-migration.mjs.
 *
 * Usage (from the project root):
 *   DATABASE_URL='mysql://user:pass@host:port/db' php scripts/run-migration.php [path/to/file.sql]
 *
 * Or pass credentials as separate env vars if you prefer:
 *   DB_HOST=... DB_PORT=3306 DB_USER=... DB_PASS=... DB_NAME=... \
 *     php scripts/run-migration.php scripts/normalize-accommodation-levels.sql
 *
 * Defaults to scripts/normalize-accommodation-levels.sql when no argument
 * is supplied.
 *
 * Idempotent — safe to re-run.
 */

declare(strict_types=1);

// -------------------------------------------------------------------
// Resolve which SQL file to run
// -------------------------------------------------------------------
$sqlArg = $argv[1] ?? null;
if ($sqlArg) {
    $sqlPath = realpath($sqlArg);
} else {
    // Default — run the accommodation-level normalization.
    $sqlPath = __DIR__ . '/normalize-accommodation-levels.sql';
}

if (!$sqlPath || !file_exists($sqlPath)) {
    fwrite(STDERR, "SQL file not found: " . ($sqlArg ?? '(default)') . "\n");
    fwrite(STDERR, "Usage: php scripts/run-migration.php [path/to/file.sql]\n");
    exit(1);
}

$sqlRaw = file_get_contents($sqlPath);
if ($sqlRaw === false) {
    fwrite(STDERR, "Failed to read SQL file: $sqlPath\n");
    exit(1);
}

// -------------------------------------------------------------------
// Parse DATABASE_URL  (preferred) — or fall back to individual env vars.
// Format: mysql://user:pass@host:port/dbname
// -------------------------------------------------------------------
$dsn = getenv('DATABASE_URL');
$host = 'localhost';
$port = 3306;
$user = '';
$pass = '';
$db   = '';

if ($dsn) {
    if (!preg_match('#^mysql://([^:]+):([^@]*)@([^:/?#]+)(?::(\d+))?/([^?#]+)#', $dsn, $m)) {
        fwrite(STDERR, "DATABASE_URL is not a valid mysql:// URL.\n");
        fwrite(STDERR, "Expected: mysql://user:pass@host:port/dbname\n");
        exit(1);
    }
    $user = urldecode($m[1]);
    $pass = urldecode($m[2]);
    $host = $m[3];
    $port = $m[4] ? (int)$m[4] : 3306;
    $db   = $m[5];
} else {
    // Fall back to individual env vars.
    $host = getenv('DB_HOST') ?: $host;
    $port = (int)(getenv('DB_PORT') ?: 3306);
    $user = getenv('DB_USER') ?: '';
    $pass = getenv('DB_PASS') ?: getenv('DB_PASSWORD') ?: '';
    $db   = getenv('DB_NAME') ?: '';
}

if ($user === '' || $db === '') {
    fwrite(STDERR, "No DB credentials found.\n");
    fwrite(STDERR, "Either set DATABASE_URL='mysql://user:pass@host:port/db' or set DB_USER + DB_PASS + DB_NAME individually.\n");
    exit(1);
}

echo "Connecting to {$user}@{$host}:{$port}/{$db} ...\n";
echo "Running SQL file: {$sqlPath}\n";

// -------------------------------------------------------------------
// Connect — use mysqli if available, otherwise PDO.
// -------------------------------------------------------------------
$hasMysqli = function_exists('mysqli_init');
$hasPdo    = class_exists('PDO');

if (!$hasMysqli && !$hasPdo) {
    fwrite(STDERR, "Neither mysqli nor PDO is available in this PHP build.\n");
    fwrite(STDERR, "Use phpMyAdmin's SQL tab to run the file manually instead.\n");
    exit(1);
}

if ($hasMysqli) {
    $conn = mysqli_init();
    $ok = @$conn->real_connect($host, $user, $pass, $db, $port);
    if (!$ok) {
        fwrite(STDERR, "Connect failed: " . mysqli_connect_error() . "\n");
        exit(1);
    }
    $conn->set_charset('utf8mb4');
} else {
    try {
        $conn = new PDO(
            "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4",
            $user,
            $pass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    } catch (PDOException $e) {
        fwrite(STDERR, "Connect failed: " . $e->getMessage() . "\n");
        exit(1);
    }
}

// -------------------------------------------------------------------
// Strip line comments (lines starting with --) and split on ';'
// -------------------------------------------------------------------
$lines = explode("\n", $sqlRaw);
$noComments = array_filter($lines, function ($line) {
    return !preg_match('/^\s*--/', $line);
});
$noCommentsStr = implode("\n", $noComments);

// Split on ';' — naive but works for the simple UPDATE statements in our
// migration files. Don't use this for arbitrary SQL with semicolons inside
// string literals.
$statements = array_map('trim', explode(';', $noCommentsStr));
$statements = array_filter($statements, function ($s) {
    return strlen($s) > 0;
});

echo "Running " . count($statements) . " migration statements...\n";

$ok = 0;
$failed = 0;
foreach ($statements as $stmt) {
    $preview = preg_replace('/\s+/', ' ', substr($stmt, 0, 100));
    try {
        if ($hasMysqli) {
            $r = @$conn->query($stmt);
            if ($r === false) {
                throw new RuntimeException($conn->error);
            }
            $affected = $conn->affected_rows;
        } else {
            $affected = $conn->exec($stmt);
        }
        echo "  OK   ({$affected} rows)  {$preview}\n";
        $ok++;
    } catch (Throwable $e) {
        $msg = $e->getMessage();
        // "Duplicate column" / "already exists" → expected, skip
        if (stripos($msg, 'Duplicate column') !== false
            || stripos($msg, 'already exists') !== false) {
            echo "  skip (already exists): {$preview}\n";
            $ok++;
        } else {
            fwrite(STDERR, "  FAIL {$msg}\n");
            fwrite(STDERR, "        SQL: " . preg_replace('/\s+/', ' ', substr($stmt, 0, 200)) . "\n");
            $failed++;
        }
    }
}

if ($hasMysqli) {
    $conn->close();
} else {
    $conn = null; // close PDO
}

echo "\nDone. {$ok} ok, {$failed} failed.\n";

if ($failed > 0) {
    exit(1);
}
