package browserhost

import (
	"os"
	"path/filepath"
	"testing"
)

func TestExtensionFoldersFromPrefersPackagedDirs(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	chrome := filepath.Join(root, "browser-extension")
	firefox := filepath.Join(root, "browser-extension-firefox")
	if err := os.MkdirAll(chrome, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(firefox, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(chrome, "manifest.json"), []byte("{}"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(firefox, "manifest.json"), []byte("{}"), 0o644); err != nil {
		t.Fatal(err)
	}
	gotChrome, gotFirefox := extensionFoldersFrom([]string{root})
	if gotChrome != chrome || gotFirefox != firefox {
		t.Fatalf("chrome=%s firefox=%s", gotChrome, gotFirefox)
	}
}
