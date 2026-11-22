//go:build windows

package browserhost

import (
	"fmt"
	"os"
	"path/filepath"

	"golang.org/x/sys/windows/registry"
)

func windowsMachineHostKeys() []string {
	return windowsUserHostKeys()
}

func installSystem(hostPath string) (InstallResult, error) {
	m, err := BuildManifest(hostPath, "")
	if err != nil {
		return InstallResult{}, err
	}
	manifestPath := filepath.Join(filepath.Dir(hostPath), "native-messaging", HostName+".json")
	if err := WriteManifestFile(manifestPath, m); err != nil {
		return InstallResult{}, err
	}
	absManifest, err := filepath.Abs(manifestPath)
	if err != nil {
		return InstallResult{}, err
	}
	for _, keyPath := range windowsMachineHostKeys() {
		key, _, err := registry.CreateKey(registry.LOCAL_MACHINE, keyPath, registry.SET_VALUE)
		if err != nil {
			return InstallResult{}, fmt.Errorf("registry HKLM %s: %w", keyPath, err)
		}
		if err := key.SetStringValue("", absManifest); err != nil {
			_ = key.Close()
			return InstallResult{}, err
		}
		_ = key.Close()
	}
	return InstallResult{ManifestPaths: []string{absManifest}, HostPath: hostPath}, nil
}

func uninstallSystem() error {
	for _, keyPath := range windowsMachineHostKeys() {
		_ = registry.DeleteKey(registry.LOCAL_MACHINE, keyPath)
	}
	if hostPath, err := ResolveHostBinary(); err == nil {
		_ = os.Remove(filepath.Join(filepath.Dir(hostPath), "native-messaging", HostName+".json"))
	}
	return nil
}
