#!/usr/bin/perl
# Add accommodationIds + galleryImages to each tour object based on destination
use strict;
use warnings;

my $file = $ARGV[0] or die "Usage: $0 <file>\n";
open(my $fh, '<', $file) or die "Cannot open $file: $!\n";
my @lines = <$fh>;
close($fh);

my %map = (
  "Tanzania"  => ["singita","mombo"],
  "Uganda"    => ["bisate","mwamba"],
  "Rwanda"    => ["bisate","singita"],
  "Kenya"     => ["singita","mombo"],
  "Botswana"  => ["mombo","lapalala"],
  "Namibia"   => ["sossus","mwamba"],
);

# First pass: walk through tourPackages array, tracking current tour object's destination
my $in_tours = 0;
my $in_tour = 0;
my $brace_depth = 0;
my $current_dest = "";
my @output;

# We want to insert `accommodationIds: [...]` and `galleryImages: [...]` right BEFORE the closing of the tour object.
# A tour object ends with `  },` at indent depth 2 (within the array).
# We'll detect this by tracking when we see `    ],\n  },` where the `],` closes the days array.

for (my $i = 0; $i < scalar(@lines); $i++) {
    my $line = $lines[$i];
    push @output, $line;

    # Detect entering the tourPackages array
    if ($line =~ /^export const tourPackages:/) {
        $in_tours = 1;
        next;
    }
    if (!$in_tours) { next; }

    # Track current destination for the tour we're inside
    if ($line =~ /^\s+destination:\s*"([^"]+)"/) {
        $current_dest = $1;
    }

    # Detect end of a tour: the days array close is `    ],\n` and the next line is `  },\n`
    if ($line =~ /^    \],\s*$/ && $i+1 < scalar(@lines) && $lines[$i+1] =~ /^  \},/) {
        my $ids = $map{$current_dest} || [];
        my $ids_str = join(", ", map { "\"$_\"" } @$ids);
        my $gallery = get_gallery($current_dest);
        # Insert BEFORE the `],`? No, the days array already closed. We want to add after the days array closes,
        # but before the tour object closes (the next line `  },`).
        # So we insert AFTER the `],` line and BEFORE the `  },` line.
        push @output, "    accommodationIds: [$ids_str],\n";
        push @output, "    galleryImages: $gallery,\n";
    }
}

open(my $out, '>', $file) or die "Cannot write $file: $!\n";
print $out @output;
close($out);
print "Done.\n";

sub get_gallery {
    my $dest = shift;
    # Return 3 gallery image URLs per destination (verified sfile.chatglm.cn URLs from prior work)
    my %g = (
      "Tanzania" => [
        "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
        "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
        "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
      ],
      "Uganda" => [
        "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
        "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
        "https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg",
      ],
      "Rwanda" => [
        "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
        "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
        "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
      ],
      "Kenya" => [
        "https://sfile.chatglm.cn/images-ppt/1b293846f02b.jpg",
        "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
        "https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg",
      ],
      "Botswana" => [
        "https://sfile.chatglm.cn/images-ppt/1b293846f02b.jpg",
        "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
        "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
      ],
      "Namibia" => [
        "https://sfile.chatglm.cn/images-ppt/97c40e4746f3.jpg",
        "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
        "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
      ],
    );
    my $arr = $g{$dest} || [];
    my $str = join(", ", map { "\"$_\"" } @$arr);
    return "[$str]";
}
