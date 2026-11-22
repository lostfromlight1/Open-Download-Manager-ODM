package main

import (
	"strings"

	"github.com/lostfromlight1/Open-Download-Manager/internal/browserhost"
	"github.com/lostfromlight1/Open-Download-Manager/internal/storage"
)

// applyFirstRun fills the defaults a packaged install is supposed to have
// ready before the user does anything except load the browser extension.
// changed is false when a download folder is already saved, so later launches
// do not turn integration back on after the user disabled it.
func applyFirstRun(cfg storage.Settings, downloadDir string) (storage.Settings, bool) {
	if strings.TrimSpace(cfg.DownloadDirectory) != "" {
		return cfg, false
	}
	downloadDir = strings.TrimSpace(downloadDir)
	if downloadDir == "" {
		return cfg, false
	}
	cfg.DownloadDirectory = downloadDir
	cfg.BrowserIntegrationEnabled = true
	if strings.TrimSpace(cfg.ChromeExtensionID) == "" {
		cfg.ChromeExtensionID = browserhost.ChromeExtensionID
	}
	cfg.SetupNotice = storage.SetupNoticePending
	return cfg, true
}
