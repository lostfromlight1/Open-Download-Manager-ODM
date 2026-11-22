//go:build linux

package browserhost

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestInstallSystemUnderWritesAllUsersManifests(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	host := filepath.Join(root, "usr", "bin", "odm-nmhost")
	result, err := installSystemUnder(root, host)
	if err != nil {
		t.Fatal(err)
	}
	if len(result.ManifestPaths) != len(linuxSystemManifestPaths(root)) {
		t.Fatalf("paths=%v", result.ManifestPaths)
	}
	raw, err := os.ReadFile(filepath.Join(root, "etc", "opt", "chrome", "native-messaging-hosts", HostName+".json"))
	if err != nil {
		t.Fatal(err)
	}
	var m Manifest
	if err := json.Unmarshal(raw, &m); err != nil {
		t.Fatal(err)
	}
	if m.Path != host {
		t.Fatalf("path %s", m.Path)
	}
	if len(m.AllowedOrigins) != 1 || !strings.Contains(m.AllowedOrigins[0], ChromeExtensionID) {
		t.Fatalf("origins %v", m.AllowedOrigins)
	}
	if len(m.AllowedExtensions) != 1 || m.AllowedExtensions[0] != FirefoxExtensionID {
		t.Fatalf("extensions %v", m.AllowedExtensions)
	}
	ff := filepath.Join(root, "usr", "lib64", "mozilla", "native-messaging-hosts", HostName+".json")
	if _, err := os.Stat(ff); err != nil {
		t.Fatal(err)
	}
	if err := uninstallSystemUnder(root); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(ff); !os.IsNotExist(err) {
		t.Fatalf("manifest still present: %v", err)
	}
}

func TestLinuxUserTargetsIncludeCommonBrowsers(t *testing.T) {
	t.Parallel()
	got := strings.Join(hostManifestTargets("/home/user"), "\n")
	for _, part := range []string{"google-chrome", "chromium", "microsoft-edge", "Brave-Browser", "native-messaging-hosts"} {
		if !strings.Contains(got, part) {
			t.Fatalf("missing %s in %s", part, got)
		}
	}
}
