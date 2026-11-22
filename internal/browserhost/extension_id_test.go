package browserhost

import (
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"testing"
)

func TestChromeExtensionIDMatchesManifestKey(t *testing.T) {
	t.Parallel()
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("caller")
	}
	manifestPath := filepath.Join(filepath.Dir(file), "..", "..", "apps", "browser-extension", "manifest.json")
	raw, err := os.ReadFile(manifestPath)
	if err != nil {
		t.Fatal(err)
	}
	var doc struct {
		Key string `json:"key"`
	}
	if err := json.Unmarshal(raw, &doc); err != nil {
		t.Fatal(err)
	}
	der, err := base64.StdEncoding.DecodeString(doc.Key)
	if err != nil {
		t.Fatal(err)
	}
	sum := sha256.Sum256(der)
	encoded := hex.EncodeToString(sum[:16])
	id := make([]byte, len(encoded))
	for i := 0; i < len(encoded); i++ {
		n := encoded[i]
		var v byte
		switch {
		case n >= '0' && n <= '9':
			v = n - '0'
		case n >= 'a' && n <= 'f':
			v = n - 'a' + 10
		default:
			t.Fatalf("bad hex %q", encoded)
		}
		id[i] = 'a' + v
	}
	if string(id) != ChromeExtensionID {
		t.Fatalf("manifest key maps to %s, constant is %s", id, ChromeExtensionID)
	}
}
