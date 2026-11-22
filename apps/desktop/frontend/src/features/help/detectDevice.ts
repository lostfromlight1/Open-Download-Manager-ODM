export type DeviceKind = "windows" | "macos" | "linux";

/** Best-effort OS from the webview user agent. Unknown agents stay on Linux. */
export function detectDevice(userAgent: string): DeviceKind {
  if (/Windows/i.test(userAgent)) return "windows";
  if (/Mac OS X|Macintosh/i.test(userAgent)) return "macos";
  return "linux";
}
