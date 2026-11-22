import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { setDesktopApi, type DesktopApi } from "../../services/desktopApi";
import type { SettingsDTO } from "../downloads/downloadTypes";
import { needsSetupWizard } from "./needsSetupWizard";
import { SetupWizard } from "./SetupWizard";

const emptySettings: SettingsDTO = {
  downloadDirectory: "",
  maxActiveDownloads: 2,
  maxConnectionsPerDownload: 4,
  proxyMode: "system",
  proxyURL: "",
  theme: "system",
  notifyOnComplete: false,
  browserIntegrationEnabled: false,
  chromeExtensionId: "",
  browserHostRegistered: false,
  browserHostMessage: "",
  closeToTray: true,
  launchAtLogin: false,
  mediaEnabled: false,
  mediaYtdlpPath: "",
  mediaFfmpegPath: "",
  mediaToolsReady: false,
  mediaToolsMessage: "",
  setupNotice: "",
  extensionChromeDir: "",
  extensionFirefoxDir: "",
};

function mockApi(partial: Partial<DesktopApi> = {}): DesktopApi {
  return {
    listDownloads: async () => [],
    addDownload: async () => {
      throw new Error("not used");
    },
    pauseDownload: async () => undefined,
    resumeDownload: async () => undefined,
    cancelDownload: async () => undefined,
    removeDownload: async () => undefined,
    getSettings: async () => emptySettings,
    getDownload: async () => {
      throw new Error("not used");
    },
    openDownload: async () => undefined,
    revealDownload: async () => undefined,
    updateSettings: async (s) => s,
    resolveDecision: async () => undefined,
    downloadsAvailable: async () => true,
    statusMessage: async () => "ok",
    isYouTubeURL: async () => false,
    probeMediaURL: async () => {
      throw new Error("not used");
    },
    addMediaDownload: async () => {
      throw new Error("not used");
    },
    ensureMediaTools: async () => ({
      ...emptySettings,
      downloadDirectory: "D:\\Download",
      mediaEnabled: true,
      mediaToolsReady: true,
      mediaToolsMessage: "Helpers ready.",
    }),
    ...partial,
  };
}

describe("needsSetupWizard", () => {
  it("is true until the folder exists and the extension notice is dismissed", () => {
    expect(needsSetupWizard(emptySettings)).toBe(true);
    expect(
      needsSetupWizard({ ...emptySettings, downloadDirectory: "  " }),
    ).toBe(true);
    expect(
      needsSetupWizard({
        ...emptySettings,
        downloadDirectory: "D:/Download",
        setupNotice: "pending",
      }),
    ).toBe(true);
    expect(
      needsSetupWizard({
        ...emptySettings,
        downloadDirectory: "D:/Download",
        setupNotice: "done",
      }),
    ).toBe(false);
  });
});

describe("SetupWizard", () => {
  beforeEach(() => {
    setDesktopApi(null);
  });
  afterEach(() => {
    cleanup();
    setDesktopApi(null);
  });

  it("requires a folder before continuing", async () => {
    setDesktopApi(mockApi());
    render(
      <SetupWizard initial={emptySettings} onComplete={() => undefined} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Choose a download folder",
    );
  });

  it("enables the host and dismisses the notice", async () => {
    let finished: SettingsDTO | null = null;
    setDesktopApi(
      mockApi({
        updateSettings: async (s) => s,
      }),
    );
    render(
      <SetupWizard
        initial={{
          ...emptySettings,
          downloadDirectory: "D:\\Download",
          extensionChromeDir: "C:\\Program Files\\ODM\\browser-extension",
          setupNotice: "pending",
        }}
        onComplete={(s) => {
          finished = s;
        }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Load the browser extension" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("C:\\Program Files\\ODM\\browser-extension", {
        exact: true,
      }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(finished?.browserIntegrationEnabled).toBe(true);
      expect(finished?.setupNotice).toBe("done");
      expect(finished?.downloadDirectory).toBe("D:\\Download");
    });
  });
});
