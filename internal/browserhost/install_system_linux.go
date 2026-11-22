//go:build linux

package browserhost

import (
	"fmt"
	"os"
	"path/filepath"
)

func installSystem(hostPath string) (InstallResult, error) {
	return installSystemUnder("/", hostPath)
}

func uninstallSystem() error {
	return uninstallSystemUnder("/")
}

func linuxSystemManifestPaths(root string) []string {
	name := HostName + ".json"
	rels := []string{
		filepath.Join("etc", "opt", "chrome", "native-messaging-hosts", name),
		filepath.Join("etc", "chromium", "native-messaging-hosts", name),
		filepath.Join("etc", "opt", "edge", "native-messaging-hosts", name),
		filepath.Join("usr", "lib", "mozilla", "native-messaging-hosts", name),
		filepath.Join("usr", "lib64", "mozilla", "native-messaging-hosts", name),
	}
	out := make([]string, 0, len(rels))
	for _, rel := range rels {
		out = append(out, filepath.Join(root, rel))
	}
	return out
}

func installSystemUnder(root, hostPath string) (InstallResult, error) {
	m, err := BuildManifest(hostPath, "")
	if err != nil {
		return InstallResult{}, err
	}
	var written []string
	for _, path := range linuxSystemManifestPaths(root) {
		if err := WriteManifestFile(path, m); err != nil {
			return InstallResult{}, fmt.Errorf("write %s: %w", path, err)
		}
		written = append(written, path)
	}
	return InstallResult{ManifestPaths: written, HostPath: m.Path}, nil
}

func uninstallSystemUnder(root string) error {
	for _, path := range linuxSystemManifestPaths(root) {
		if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
			return err
		}
	}
	return nil
}
