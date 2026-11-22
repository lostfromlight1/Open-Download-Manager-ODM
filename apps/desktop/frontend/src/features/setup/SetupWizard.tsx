import { useState } from "react";
import { getDesktopApi } from "../../services/desktopApi";
import type { SettingsDTO } from "../downloads/downloadTypes";

type Props = {
  initial: SettingsDTO;
  onComplete: (settings: SettingsDTO) => void;
};

/**
 * Shown once on a new install. The installer and first launch already choose
 * the download folder and register the native host. The user only loads the
 * browser extension.
 */
export function SetupWizard({ initial, onComplete }: Props) {
  const [form, setForm] = useState<SettingsDTO>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chromeDir =
    form.extensionChromeDir?.trim() ||
    "the browser-extension folder next to the app";
  const firefoxDir = form.extensionFirefoxDir?.trim();

  async function finish() {
    const dir = form.downloadDirectory.trim();
    if (!dir) {
      setError("Choose a download folder to continue.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const api = await getDesktopApi();
      const saved = await api.updateSettings({
        ...form,
        downloadDirectory: dir,
        browserIntegrationEnabled: true,
        setupNotice: "done",
      });
      onComplete(saved);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      try {
        const api = await getDesktopApi();
        const latest = await api.getSettings();
        if (latest.downloadDirectory?.trim()) {
          onComplete({
            ...latest,
            setupNotice: "done",
            browserHostMessage: message,
          });
          return;
        }
      } catch {
        // Keep the original error on screen.
      }
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-5 px-6 py-10">
      <header>
        <p className="text-sm font-medium text-[var(--color-text-muted)]">
          Welcome
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
          Load the browser extension
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          ODM already set the download folder and registered the native
          messaging host for this account. The extension is the only step left.
        </p>
      </header>

      <section className="space-y-4 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <label className="block text-sm">
          Download folder
          <input
            className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 font-mono text-sm"
            value={form.downloadDirectory}
            onChange={(e) =>
              setForm({ ...form, downloadDirectory: e.target.value })
            }
            aria-required
          />
        </label>

        <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
          <p>
            Chrome or Edge: open{" "}
            <span className="font-mono">chrome://extensions</span>, turn on
            Developer mode, choose Load unpacked, and select
          </p>
          <p className="break-all rounded-md bg-[var(--color-surface-muted)] px-2 py-1 font-mono text-xs text-[var(--color-text)]">
            {chromeDir}
          </p>
          <p>
            Firefox: open <span className="font-mono">about:debugging</span>,
            choose This Firefox, then Load Temporary Add-on and pick
          </p>
          <p className="break-all rounded-md bg-[var(--color-surface-muted)] px-2 py-1 font-mono text-xs text-[var(--color-text)]">
            {firefoxDir
              ? `${firefoxDir}/manifest.json`
              : `${chromeDir}/manifest.firefox.json`}
          </p>
          <p>YouTube downloads stay off until you enable them in Settings.</p>
        </div>

        {form.browserHostMessage?.trim() ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            {form.browserHostMessage}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          className="rounded-md bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={busy}
          onClick={() => void finish()}
        >
          {busy ? "Saving…" : "Continue"}
        </button>
      </section>
    </main>
  );
}
