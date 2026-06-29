#!/bin/bash
# Replace broken Unsplash image URLs with working sfile.chatglm.cn URLs across all source files

set -e

cd /home/z/my-project

# Mapping of broken Unsplash photo IDs to working replacement URLs
# Using multiple replacements where the same broken image appears in multiple contexts
# to maintain visual variety

# Serengeti/savanna landscape (photo-1547621869-cd5e2ef82e1d) — appears in many places
# Use different replacements for different contexts to maintain variety:
# - Hero poster / parallax / main savanna: 741df1b5a3da.jpg
# - Day images in tours: 800c92b8a9f7.jpg, e649309391ca.jpg
SERENGETI_MAIN="https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg"
SERENGETI_ALT1="https://sfile.chatglm.cn/images-ppt/800c92b8a9f7.jpg"
SERENGETI_ALT2="https://sfile.chatglm.cn/images-ppt/e649309391ca.jpg"

# Gorilla trekking (photo-1568125757388-9adeb77c8e5f)
GORILLA_MAIN="https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg"
GORILLA_ALT1="https://sfile.chatglm.cn/images-ppt/55f6eb85ac39.jpg"
GORILLA_ALT2="https://sfile.chatglm.cn/images-ppt/36601bb9704e.jpg"

# Elephants (photo-1500916434205-0c964904b3e1)
ELEPHANT_MAIN="https://sfile.chatglm.cn/images-ppt/4423f54c77e6.jpg"
ELEPHANT_ALT1="https://sfile.chatglm.cn/images-ppt/70bb9a1faf46.jpg"
ELEPHANT_ALT2="https://sfile.chatglm.cn/images-ppt/35f7809a1458.jpg"

# Volcanoes misty (photo-1517118818301-e82f3a1c3a4f)
VOLCANO_MAIN="https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg"
VOLCANO_ALT1="https://sfile.chatglm.cn/images-ppt/4578168a3b7c.jpg"
VOLCANO_ALT2="https://sfile.chatglm.cn/images-ppt/ed03c4dfa187.jpg"

# Chimpanzee (photo-1517213849290-bbbfffdc6da4)
CHIMP_MAIN="https://sfile.chatglm.cn/images-ppt/ac9862af7e88.jpg"
CHIMP_ALT1="https://sfile.chatglm.cn/images-ppt/aaaf60c1df9c.jpg"

# Golden monkey (photo-1601913768173-9d2de8d4d9d3)
MONKEY_MAIN="https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg"
MONKEY_ALT1="https://sfile.chatglm.cn/images-ppt/b69350ac3fa2.jpg"

# Namibia dunes (photo-1500289466305-babaa6e8b1b3)
NAMIBIA_MAIN="https://sfile.chatglm.cn/images-ppt/84ed8813798e.jpg"
NAMIBIA_ALT1="https://sfile.chatglm.cn/images-ppt/4dd444015d49.jpg"
NAMIBIA_ALT2="https://sfile.chatglm.cn/images-ppt/97c40e4746f3.jpg"

# Function to replace all occurrences of a broken Unsplash URL (any query params) with a new URL
replace_image() {
  local broken_id="$1"
  local replacement="$2"
  local files
  files=$(grep -rl "images.unsplash.com/$broken_id" src/ 2>/dev/null || true)
  if [ -z "$files" ]; then
    echo "  No files contain $broken_id"
    return
  fi
  echo "  Replacing $broken_id -> $(basename $replacement) in:"
  echo "$files" | while read f; do
    echo "    - $f"
    # Use perl for non-greedy replacement of the full URL including query string
    perl -pi -e "s|https://images\.unsplash\.com/\Q$broken_id\E[^\"']*|$replacement|g" "$f"
  done
}

echo "=== Replacing broken Unsplash images ==="

replace_image "photo-1547621869-cd5e2ef82e1d" "$SERENGETI_MAIN"
replace_image "photo-1568125757388-9adeb77c8e5f" "$GORILLA_MAIN"
replace_image "photo-1500916434205-0c964904b3e1" "$ELEPHANT_MAIN"
replace_image "photo-1517118818301-e82f3a1c3a4f" "$VOLCANO_MAIN"
replace_image "photo-1517213849290-bbbfffdc6da4" "$CHIMP_MAIN"
replace_image "photo-1601913768173-9d2de8d4d9d3" "$MONKEY_MAIN"
replace_image "photo-1500289466305-babaa6e8b1b3" "$NAMIBIA_MAIN"

echo ""
echo "=== Done ==="
