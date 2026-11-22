package browserhost

import (
	"os"
	"path/filepath"
)

// ExtensionFolders reports where the user should load the unpacked extension.
// chrome is the Chrome/Edge folder. firefox is the Firefox folder when the
// package shipped one; otherwise it is empty and the Chrome folder contains
// manifest.firefox.json.
func ExtensionFolders() (chrome, firefox string) {
	return extensionFoldersFrom(extensionRoots())
}

func extensionRoots() []string {
	roots := []string{
		"/usr/share/odm",
		"/usr/local/share/odm",
	}
	if exe, err := os.Executable(); err == nil {
		dir := filepath.Dir(exe)
		roots = append([]string{dir}, roots...)
		// Dev builds run from apps/desktop/bin. The extension sources live in
		// apps/browser-extension, two directories up from that bin folder.
		roots = append(roots, filepath.Clean(filepath.Join(dir, "..", "..", "browser-extension")))
	}
	return roots
}

func extensionFoldersFrom(roots []string) (chrome, firefox string) {
	for _, root := range roots {
		chromeDir := root
		firefoxDir := ""
		if filepath.Base(root) != "browser-extension" {
			chromeDir = filepath.Join(root, "browser-extension")
			firefoxDir = filepath.Join(root, "browser-extension-firefox")
		}
		if !manifestExists(chromeDir) {
			continue
		}
		if firefoxDir != "" && manifestExists(firefoxDir) {
			return chromeDir, firefoxDir
		}
		return chromeDir, ""
	}
	return "", ""
}

func manifestExists(dir string) bool {
	st, err := os.Stat(filepath.Join(dir, "manifest.json"))
	return err == nil && !st.IsDir()
}
