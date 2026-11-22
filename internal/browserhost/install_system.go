package browserhost

import "strings"

// InstallSystem registers the native messaging host for every account on
// this machine. Package installers run this as root or as an elevated
// Windows install. Per-user registration still happens when someone enables
// integration inside the app.
func InstallSystem(hostPath string) (InstallResult, error) {
	hostPath = strings.TrimSpace(hostPath)
	if hostPath == "" {
		var err error
		hostPath, err = ResolveHostBinary()
		if err != nil {
			return InstallResult{}, err
		}
	}
	return installSystem(hostPath)
}

// UninstallSystem removes the machine-wide host manifests written by InstallSystem.
func UninstallSystem() error {
	return uninstallSystem()
}
