import type { SettingsDTO } from "../downloads/downloadTypes";

/** True when the first-run screen should still tell the user to load the extension. */
export function needsSetupWizard(settings: SettingsDTO): boolean {
  if (!settings.downloadDirectory?.trim()) {
    return true;
  }
  return settings.setupNotice === "pending";
}
