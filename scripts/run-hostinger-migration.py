#!/usr/bin/env python3
"""SSH to Hostinger and run the migrate-add-columns.sql migration.

This is a focused script that ONLY:
  1. Pulls the latest source (so the SQL file is up to date)
  2. Runs scripts/run-migration.mjs (idempotent — IF NOT EXISTS guarded)

It does NOT build or restart — the Hostinger auto-rebuild handles that.
Run this right after pushing a migration-affecting commit so the DB column
exists before the new build swaps in.

Usage:
  python3 scripts/run-hostinger-migration.py [path/relative/to/source-root.sql]

Defaults to scripts/migrate-add-columns.sql.
"""

import paramiko
import sys
import time

HOST = "147.93.73.181"
PORT = 65002
USER = "u593513870"
PASSWORD = "Unzipafrica12345@"
APP_PATH = "/home/u593513870/domains/unzipafrica.com/hbuilds/last-source"
NODE_PATH = "/opt/alt/alt-nodejs22/root/usr/bin"
DATABASE_URL = "mysql://u593513870_unzipafrica:Unzipafrica12345%40@localhost:3306/u593513870_unzipafrica"
SQL_FILE = sys.argv[1] if len(sys.argv) > 1 else "scripts/migrate-add-columns.sql"


def run_cmd(client, cmd, timeout=300):
    full_cmd = f'export PATH="{NODE_PATH}:$PATH" && cd {APP_PATH} && {cmd}'
    print(f"\n=== RUN: {cmd}")
    sys.stdout.flush()
    stdin, stdout, stderr = client.exec_command(full_cmd, timeout=timeout, get_pty=True)
    while not stdout.channel.exit_status_ready():
        if stdout.channel.recv_ready():
            chunk = stdout.channel.recv(4096).decode("utf-8", errors="replace")
            print(chunk, end="")
            sys.stdout.flush()
        if stderr.channel.recv_stderr_ready():
            chunk = stderr.channel.recv_stderr(4096).decode("utf-8", errors="replace")
            print(chunk, end="", file=sys.stderr)
            sys.stderr.flush()
        time.sleep(0.05)
    remaining_out = stdout.read().decode("utf-8", errors="replace")
    if remaining_out:
        print(remaining_out, end="")
    remaining_err = stderr.read_stderr().decode("utf-8", errors="replace")
    if remaining_err:
        print(remaining_err, end="", file=sys.stderr)
    exit_status = stdout.channel.exit_status
    print(f"\n=== EXIT STATUS: {exit_status}")
    sys.stdout.flush()
    return exit_status


def main():
    print(f"Connecting to {USER}@{HOST}:{PORT} ...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(
            hostname=HOST, port=PORT, username=USER, password=PASSWORD,
            timeout=30, allow_agent=False, look_for_keys=False,
        )
    except Exception as e:
        print(f"SSH connection failed: {e}")
        sys.exit(1)
    print("SSH connected.")

    # Step 1: Pull latest source so the SQL file is up to date.
    run_cmd(client, "git pull origin main 2>&1", timeout=120)

    # Step 2: Confirm the SQL file exists and show the accommodationIds line.
    run_cmd(client, f"grep -n accommodationIds {SQL_FILE} 2>&1 | head -3", timeout=30)

    # Step 3: Run the migration (idempotent).
    rc = run_cmd(
        client,
        f'DATABASE_URL="{DATABASE_URL}" node scripts/run-migration.mjs {SQL_FILE} 2>&1',
        timeout=120,
    )
    if rc != 0:
        print("Migration failed.")
        client.close()
        sys.exit(1)

    # Step 4: Verify the column now exists on ScheduledTrip.
    run_cmd(
        client,
        f'DATABASE_URL="{DATABASE_URL}" node -e "'
        "const mysql=require('mysql2/promise');"
        "(async()=>{"
        "const u=process.env.DATABASE_URL.match(/mysql:\\/\\/([^:]+):([^@]*)@([^:/?#]+)(?::(\\d+))?\\/([^?#]+)/);"
        "const c=await mysql.createConnection({host:u[3],port:u[4]?+u[4]:3306,user:decodeURIComponent(u[1]),password:decodeURIComponent(u[2]),database:u[5]});"
        "const [r]=await c.query(\\\"SHOW COLUMNS FROM ScheduledTrip LIKE 'accommodationIds'\\\");"
        "console.log('ScheduledTrip.accommodationIds column:', r.length?JSON.stringify(r[0]):'NOT FOUND');"
        "await c.end();"
        "})()" '" 2>&1',
        timeout=60,
    )

    print("\nMigration script complete.")
    client.close()


if __name__ == "__main__":
    main()
