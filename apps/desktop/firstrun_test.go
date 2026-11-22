package main

import (
	"testing"

	"github.com/lostfromlight1/Open-Download-Manager/internal/browserhost"
	"github.com/lostfromlight1/Open-Download-Manager/internal/storage"
)

func TestApplyFirstRunSetsFolderHostAndNotice(t *testing.T) {
	t.Parallel()
	next, ok := applyFirstRun(storage.DefaultSettings(), "/home/user/Downloads")
	if !ok {
		t.Fatal("expected first run")
	}
	if next.DownloadDirectory != "/home/user/Downloads" {
		t.Fatalf("dir %s", next.DownloadDirectory)
	}
	if !next.BrowserIntegrationEnabled {
		t.Fatal("browser integration should be enabled")
	}
	if next.ChromeExtensionID != browserhost.ChromeExtensionID {
		t.Fatalf("chrome id %s", next.ChromeExtensionID)
	}
	if next.SetupNotice != storage.SetupNoticePending {
		t.Fatalf("notice %s", next.SetupNotice)
	}
	if next.MediaEnabled {
		t.Fatal("YouTube stays off until the user opts in")
	}
}

func TestApplyFirstRunLeavesExistingInstall(t *testing.T) {
	t.Parallel()
	cfg := storage.DefaultSettings()
	cfg.DownloadDirectory = "/data/in"
	cfg.BrowserIntegrationEnabled = false
	next, ok := applyFirstRun(cfg, "/home/user/Downloads")
	if ok {
		t.Fatal("existing folder must not be treated as first run")
	}
	if next.BrowserIntegrationEnabled {
		t.Fatal("must not re-enable integration")
	}
	if next.DownloadDirectory != "/data/in" {
		t.Fatalf("dir %s", next.DownloadDirectory)
	}
}
