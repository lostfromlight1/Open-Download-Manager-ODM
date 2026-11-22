import { describe, expect, it } from "vitest";
import { detectDevice } from "./detectDevice";

describe("detectDevice", () => {
  it("recognizes Windows, macOS, and Linux user agents", () => {
    expect(detectDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe(
      "windows",
    );
    expect(detectDevice("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)")).toBe(
      "macos",
    );
    expect(detectDevice("Mozilla/5.0 (X11; Linux x86_64)")).toBe("linux");
  });
});
