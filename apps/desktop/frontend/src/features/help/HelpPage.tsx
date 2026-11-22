import { useState } from "react";
import { detectDevice, type DeviceKind } from "./detectDevice";

type Props = {
  onBack: () => void;
  userAgent?: string;
};

const devices: { id: DeviceKind; label: string }[] = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
];

export function HelpPage({ onBack, userAgent }: Props) {
  const current = detectDevice(
    userAgent ?? (typeof navigator === "undefined" ? "" : navigator.userAgent),
  );
  const [device, setDevice] = useState<DeviceKind>(current);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">
            Help
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Install ODM, load the browser extension, and download files. You are
            on {labelFor(current)}.
          </p>
        </div>
        <button
          type="button"
          className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
          onClick={onBack}
        >
          Back
        </button>
      </header>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Device manuals"
      >
        {devices.map((item) => {
          const selected = device === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`help-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`help-panel-${item.id}`}
              className={`rounded-md px-3 py-2 text-sm ${
                selected
                  ? "bg-[var(--color-accent)] font-medium text-white"
                  : "border border-[var(--color-border)] bg-[var(--color-surface)]"
              }`}
              onClick={() => setDevice(item.id)}
            >
              {item.label}
              {item.id === current ? " (this device)" : ""}
            </button>
          );
        })}
      </div>

      <section
        role="tabpanel"
        id={`help-panel-${device}`}
        aria-labelledby={`help-tab-${device}`}
        className="space-y-4 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
      >
        {device === "windows" ? <WindowsManual /> : null}
        {device === "macos" ? <MacManual /> : null}
        {device === "linux" ? <LinuxManual /> : null}
      </section>

      <EverydayUse />
    </div>
  );
}

function labelFor(device: DeviceKind): string {
  if (device === "windows") return "Windows";
  if (device === "macos") return "macOS";
  return "Linux";
}

function WindowsManual() {
  return (
    <>
      <h2 className="text-lg font-semibold text-[var(--color-text)]">
        Windows
      </h2>
      <p className="text-sm text-[var(--color-text-muted)]">
        Windows 10 or 11. The installer is for every account on the PC and asks
        for administrator approval. It also installs the WebView2 runtime when
        Windows does not already have it.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--color-text)]">
        <li>
          Download{" "}
          <span className="font-mono">odm-windows-amd64-installer.exe</span>{" "}
          from the project releases page. The build is unsigned, so SmartScreen
          may say “Windows protected your PC”. Choose More info, then Run
          anyway, only for a file you downloaded yourself.
        </li>
        <li>
          Run the installer and leave Launch Open Download Manager checked. The
          app is installed under{" "}
          <Path>
            C:\Program Files\Open Download Manager contributors\Open Download
            Manager
          </Path>
          .
        </li>
        <li>
          First launch uses your Downloads folder and turns browser integration
          on. Change the folder later in Settings.
        </li>
        <li>
          Chrome or Edge: open{" "}
          <span className="font-mono">chrome://extensions</span>, turn on
          Developer mode, choose Load unpacked, and select{" "}
          <Path>
            C:\Program Files\Open Download Manager contributors\Open Download
            Manager\browser-extension
          </Path>
          .
        </li>
        <li>
          Firefox: open <span className="font-mono">about:debugging</span>,
          choose This Firefox, then Load Temporary Add-on and pick{" "}
          <Path>…\browser-extension-firefox\manifest.json</Path>. Firefox drops
          temporary add-ons when it quits, so load it again next time.
        </li>
      </ol>
      <Note>
        Closing the window hides ODM in the system tray and keeps downloads
        running. Use the tray menu and Quit to exit. You do not paste an
        extension ID for the folder installed with the app.
      </Note>
    </>
  );
}

function MacManual() {
  return (
    <>
      <h2 className="text-lg font-semibold text-[var(--color-text)]">macOS</h2>
      <p className="text-sm text-[var(--color-text-muted)]">
        macOS 12 or newer on Apple Silicon. Download{" "}
        <span className="font-mono">odm-macos-arm64.dmg</span> (or the zip if
        that is what the release published) and open{" "}
        <span className="font-mono">odm.app</span>. The build is ad-hoc signed
        and not notarized, so Gatekeeper may block the first open.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--color-text)]">
        <li>
          If macOS says the app cannot be opened, right-click{" "}
          <span className="font-mono">odm.app</span> and choose Open, then Open
          again.
        </li>
        <li>
          First launch uses your Downloads folder and turns browser integration
          on.
        </li>
        <li>
          The extension folders are inside the app. Right-click{" "}
          <span className="font-mono">odm.app</span>, choose Show Package
          Contents, then open <Path>Contents/MacOS/browser-extension</Path>.
        </li>
        <li>
          Chrome or Edge: <span className="font-mono">chrome://extensions</span>{" "}
          → Developer mode → Load unpacked → that{" "}
          <span className="font-mono">browser-extension</span> folder.
        </li>
        <li>
          Firefox: <span className="font-mono">about:debugging</span> → This
          Firefox → Load Temporary Add-on →{" "}
          <Path>Contents/MacOS/browser-extension-firefox/manifest.json</Path>.
          Load it again after Firefox quits.
        </li>
        <li>
          YouTube downloads need ffmpeg on this Mac (for example{" "}
          <span className="font-mono">brew install ffmpeg</span>
          ), or a path set in Settings. ODM does not download a managed ffmpeg
          build for macOS. yt-dlp can still be installed by ODM when you enable
          YouTube.
        </li>
      </ol>
      <Note>
        Closing the window hides ODM in the menu-bar tray. Quit from that menu
        to stop downloads.
      </Note>
    </>
  );
}

function LinuxManual() {
  return (
    <>
      <h2 className="text-lg font-semibold text-[var(--color-text)]">Linux</h2>
      <p className="text-sm text-[var(--color-text-muted)]">
        Use the distro package, not an AppImage. Fedora and other rpm systems
        install <span className="font-mono">odm-linux-amd64.rpm</span>. Debian
        and Ubuntu install{" "}
        <span className="font-mono">odm-linux-amd64.deb</span>. The package
        installs GTK 4 and WebKitGTK, puts{" "}
        <span className="font-mono">odm</span> and{" "}
        <span className="font-mono">odm-nmhost</span> on{" "}
        <span className="font-mono">PATH</span>, and registers the browser host
        for every account.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--color-text)]">
        <li>
          Fedora:{" "}
          <span className="font-mono">
            sudo dnf install ./odm-linux-amd64.rpm
          </span>
          . Debian or Ubuntu:{" "}
          <span className="font-mono">
            sudo apt install ./odm-linux-amd64.deb
          </span>
          .
        </li>
        <li>
          Start Open Download Manager from the application menu, or run{" "}
          <span className="font-mono">odm</span>. First launch uses your
          Downloads folder and turns browser integration on.
        </li>
        <li>
          Chrome or Edge: <span className="font-mono">chrome://extensions</span>{" "}
          → Developer mode → Load unpacked →{" "}
          <Path>/usr/share/odm/browser-extension</Path>.
        </li>
        <li>
          Firefox: <span className="font-mono">about:debugging</span> → This
          Firefox → Load Temporary Add-on →{" "}
          <Path>/usr/share/odm/browser-extension-firefox/manifest.json</Path>.
          Load it again after Firefox quits.
        </li>
        <li>
          Use the distro browser package. A Flatpak browser cannot start{" "}
          <span className="font-mono">/usr/bin/odm-nmhost</span>, so the
          extension will not connect.
        </li>
      </ol>
      <Note>
        On Hyprland and other desktops without a status tray, closing the window
        does not leave an icon. Keep the window open, or use a tray such as
        Waybar. KDE and GNOME with a tray still hide ODM on close and keep
        downloads running until Quit.
      </Note>
    </>
  );
}

function EverydayUse() {
  return (
    <section className="space-y-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-lg font-semibold text-[var(--color-text)]">
        On every device
      </h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--color-text)]">
        <li>
          <span className="font-medium">+ Add</span> accepts http and https
          links. Pause, resume, cancel, and remove work from the row or from a
          multi-selection.
        </li>
        <li>
          Cancel and remove ask whether to keep or delete the file. If a resumed
          download no longer matches the server, ODM asks before discarding
          progress.
        </li>
        <li>
          YouTube is off until Settings → YouTube downloads. Keep ODM open while
          yt-dlp and ffmpeg download the first time. Only download videos you
          have rights to use.
        </li>
        <li>
          The extension popup can send browser downloads to ODM. That option is
          off until you turn it on. Session cookies are optional, kept in
          memory, and dropped when ODM quits.
        </li>
        <li>
          Settings also covers the download folder, how many downloads run at
          once, proxy, theme, launch at login, and close-to-tray.
        </li>
      </ul>
    </section>
  );
}

function Path({ children }: { children: string }) {
  return (
    <span className="break-all font-mono text-xs text-[var(--color-text)]">
      {children}
    </span>
  );
}

function Note({ children }: { children: string }) {
  return <p className="text-sm text-[var(--color-text-muted)]">{children}</p>;
}
