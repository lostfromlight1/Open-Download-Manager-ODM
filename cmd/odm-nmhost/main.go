// Command odm-nmhost is the Chrome/Firefox native messaging host for ODM.
//
// The browser launches this process and speaks length-prefixed JSON on stdin/stdout.
// It enqueues into the shared SQLite store; the desktop app's RunQueue performs transfers.
package main

import (
	"context"
	"log"
	"os"

	"github.com/lostfromlight1/Open-Download-Manager/internal/appdir"
	"github.com/lostfromlight1/Open-Download-Manager/internal/browserhost"
	"github.com/lostfromlight1/Open-Download-Manager/internal/manager"
	"github.com/lostfromlight1/Open-Download-Manager/internal/storage"
)

func main() {
	// Native messaging hosts must not write noise to stdout (reserved for NM frames).
	log.SetOutput(os.Stderr)

	if len(os.Args) > 1 {
		switch os.Args[1] {
		case "--install-system":
			if _, err := browserhost.InstallSystem(""); err != nil {
				log.Printf("install system host: %v", err)
				os.Exit(1)
			}
			return
		case "--uninstall-system":
			if err := browserhost.UninstallSystem(); err != nil {
				log.Printf("uninstall system host: %v", err)
				os.Exit(1)
			}
			return
		case "--install-user":
			if _, err := browserhost.Install(browserhost.InstallOptions{}); err != nil {
				log.Printf("install user host: %v", err)
				os.Exit(1)
			}
			return
		case "--uninstall-user":
			if _, err := browserhost.Uninstall(); err != nil {
				log.Printf("uninstall user host: %v", err)
				os.Exit(1)
			}
			return
		}
	}

	dataDir, err := appdir.Resolve("")
	if err != nil {
		log.Printf("data dir: %v", err)
		os.Exit(1)
	}
	store, err := storage.Open(appdir.DBPath(dataDir))
	if err != nil {
		log.Printf("open db: %v", err)
		os.Exit(1)
	}
	defer func() { _ = store.Close() }()

	mgr := manager.New(store, manager.StaticDecisions{
		Cancel:   manager.FileKeep,
		Remove:   manager.FileKeep,
		Mismatch: manager.MismatchAbort,
	})
	h := &browserhost.Handler{Store: store, Mgr: mgr}
	if err := h.ServeIO(context.Background(), os.Stdin, os.Stdout); err != nil {
		log.Printf("session: %v", err)
		os.Exit(1)
	}
}
