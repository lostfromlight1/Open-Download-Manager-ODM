#!/bin/sh
# Stage the unpacked extension folders that installers copy onto the system.
set -eu
here=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
src=$(CDPATH= cd -- "$here/../../browser-extension" && pwd)
dest="$here/staged"
rm -rf "$dest"
mkdir -p "$dest/browser-extension" "$dest/browser-extension-firefox"
for name in background.js intercept.js content-click.js popup.html popup.css popup.js youtube-button.js; do
  cp "$src/$name" "$dest/browser-extension/$name"
  cp "$src/$name" "$dest/browser-extension-firefox/$name"
done
cp "$src/manifest.json" "$dest/browser-extension/manifest.json"
cp "$src/manifest.firefox.json" "$dest/browser-extension-firefox/manifest.json"
