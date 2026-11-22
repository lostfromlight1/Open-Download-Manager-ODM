# Open Download Manager (ODM)

ODM is an open-source download manager for Windows, macOS, and Linux. It queues HTTP and HTTPS downloads, pauses and resumes them, and can take files from the browser. YouTube downloads are optional.

The installers are unsigned. The package installs the app and registers the browser host. Loading the browser extension is the step you do yourself.

## Download 1.0.0

| System | File |
|---|---|
| Windows 10/11, 64-bit | [odm-windows-amd64-installer.exe](https://github.com/lostfromlight1/Open-Download-Manager-ODM/releases/latest/download/odm-windows-amd64-installer.exe) |
| Fedora and other rpm systems, 64-bit | [odm-linux-amd64.rpm](https://github.com/lostfromlight1/Open-Download-Manager-ODM/releases/latest/download/odm-linux-amd64.rpm) |
| Debian and Ubuntu, 64-bit | [odm-linux-amd64.deb](https://github.com/lostfromlight1/Open-Download-Manager-ODM/releases/latest/download/odm-linux-amd64.deb) |
| macOS 12 or newer, Apple Silicon | [odm-macos-arm64.dmg](https://github.com/lostfromlight1/Open-Download-Manager-ODM/releases/latest/download/odm-macos-arm64.dmg) |

Checksums are in [SHA256SUMS.txt](https://github.com/lostfromlight1/Open-Download-Manager-ODM/releases/latest/download/SHA256SUMS.txt) on the [releases page](https://github.com/lostfromlight1/Open-Download-Manager-ODM/releases).

Windows may show SmartScreen. Choose More info, then Run anyway, only for that installer. macOS may block the first open. Right-click the app and choose Open. Intel Macs are not in this release.

Install steps for each system are in [`docs/GETTING_STARTED.md`](docs/GETTING_STARTED.md). The same steps are in the app under Help.

This release does not include an AppImage. Flatpak browsers cannot start the host. A Firefox add-on loaded from the package is temporary and must be loaded again after Firefox quits. On macOS, YouTube downloads need `brew install ffmpeg`.

License: MIT.

## Developers

- Product scope: [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md), [`docs/FEATURES.md`](docs/FEATURES.md), [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)
- Design: [`docs/TECH_STACK.md`](docs/TECH_STACK.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/SECURITY.md`](docs/SECURITY.md), [`docs/TESTING.md`](docs/TESTING.md)
- New machine: [`SETUP.md`](SETUP.md)
- Agent instructions: [`AGENTS.md`](AGENTS.md)

`main` is the stable release. `development` tracks the same commit until the next change.

```bash
git clone https://github.com/lostfromlight1/Open-Download-Manager-ODM.git
cd Open-Download-Manager-ODM
pnpm install
pnpm build
go test ./...
cd apps/desktop && wails3 dev
```

The Go module path is `github.com/lostfromlight1/Open-Download-Manager`. The GitHub repository name is `Open-Download-Manager-ODM`.
