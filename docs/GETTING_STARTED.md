# Getting started

Install ODM without cloning the repository or installing Go or Node.

**Current release:** `1.0.0` on [GitHub Releases](https://github.com/lostfromlight1/Open-Download-Manager-ODM/releases). Installers are unsigned. Compare a download with `SHA256SUMS.txt` on that page.

| System | File |
|---|---|
| Windows 10/11, 64-bit | `odm-windows-amd64-installer.exe` |
| Fedora and other rpm systems, 64-bit | `odm-linux-amd64.rpm` |
| Debian and Ubuntu, 64-bit | `odm-linux-amd64.deb` |
| macOS 12 or newer, Apple Silicon | `odm-macos-arm64.dmg` |

Direct links use `/releases/latest/download/` plus the file name. Intel Macs, 32-bit Windows, and an AppImage are not in this release.

## Windows

1. Download `odm-windows-amd64-installer.exe`.
2. If SmartScreen says **Windows protected your PC**, choose **More info**, then **Run anyway**. Do that only for the file from the releases page.
3. Approve the administrator prompt. The app is installed for every account under `C:\Program Files\Open Download Manager contributors\Open Download Manager`.
4. Leave **Launch Open Download Manager** checked.

## Linux

Use the distro package. It installs `odm` and `odm-nmhost` on `PATH`, copies the extension folders to `/usr/share/odm/`, and registers the host for every account. It depends on GTK 4 and WebKitGTK 6.0.

Fedora:

```bash
sudo dnf install ./odm-linux-amd64.rpm
```

Debian or Ubuntu:

```bash
sudo apt install ./odm-linux-amd64.deb
```

Start ODM from the application menu, or run `odm`. A Flatpak browser cannot start `/usr/bin/odm-nmhost`. Use the distro package of Chrome, Chromium, Edge, or Firefox.

## macOS

1. Download `odm-macos-arm64.dmg`. If the release published `odm-macos-arm64.zip` instead, unzip it.
2. Open `odm.app`. If Gatekeeper blocks it, right-click the app, choose **Open**, then **Open** again.
3. YouTube downloads need ffmpeg on the Mac, for example `brew install ffmpeg`. ODM does not ship a managed ffmpeg build for macOS.

The extension folders are inside the app: right-click `odm.app`, choose **Show Package Contents**, then `Contents/MacOS/browser-extension`.

## First launch

ODM uses your Downloads folder and turns browser integration on. You can change the folder in Settings. YouTube downloads stay off until you enable them there.

## Browser extension

This is the only manual step. The package does not install the extension into the browser.

1. Chrome or Edge: `chrome://extensions` → Developer mode → **Load unpacked**.
   - Windows: `C:\Program Files\Open Download Manager contributors\Open Download Manager\browser-extension`
   - Linux: `/usr/share/odm/browser-extension`
   - macOS: `odm.app/Contents/MacOS/browser-extension`
2. Firefox: `about:debugging` → This Firefox → **Load Temporary Add-on** → `browser-extension-firefox/manifest.json` in the same place. Firefox drops that add-on when it quits, so load it again next time.
3. Open the extension popup and confirm it is connected. Optionally enable **Send browser downloads to ODM**.

You do not paste an extension ID for the folder that shipped with the app. Paste an ID in Settings only if you loaded a different unpacked copy.

## YouTube

1. Enable **YouTube downloads** in Settings.
2. On macOS, install ffmpeg first.
3. Keep ODM open while helpers download the first time.
4. Add a YouTube URL and choose the format. Only one active or queued download per video is allowed.

Only download content you have rights to use.

The same instructions are in the app under **Help**. The tab for this computer is selected first.

## Everyday use

- **+ Add** for http(s) URLs, and for YouTube when that setting is on.
- Pause, resume, cancel, and remove. Multi-select works for bulk actions.
- Active downloads show a short speed graph.
- Closing the window keeps downloads running. Quit from the tray or menu bar to exit. On a desktop with no tray, such as Hyprland without a StatusNotifier host, quit from the app.

## Build from source

See [`SETUP.md`](../SETUP.md).
