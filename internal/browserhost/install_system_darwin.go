//go:build darwin

package browserhost

import (
	"fmt"
	"os"
	"path/filepath"
)

func darwinSystemManifestPaths() []string {
	name := HostName + ".json"
	return []string{
		filepath.Join("/Library/Google/Chrome/NativeMessagingHosts", name),
		filepath.Join("/Library/Application Support/Chromium/NativeMessagingHosts", name),
		filepath.Join("/Library/Microsoft Edge/NativeMessagingHosts", name),
		filepath.Join("/Library/Application Support/Mozilla/NativeMessagingHosts", name),
	}
}

func installSystem(hostPath string) (InstallResult, error) {
	m, err := BuildManifest(hostPath, "")
	if err != nil {
		return InstallResult{}, err
	}
	var written []string
	for _, path := range darwinSystemManifestPaths() {
		if err := WriteManifestFile(path, m); err != nil {
			return InstallResult{}, fmt.Errorf("write %s: %w", path, err)
		}
		written = append(written, path)
	}
	return InstallResult{ManifestPaths: written, HostPath: m.Path}, nil
}

func uninstallSystem() error {
	for _, path := range darwinSystemManifestPaths() {
		if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
			return err
		}
	}
	return nil
}
