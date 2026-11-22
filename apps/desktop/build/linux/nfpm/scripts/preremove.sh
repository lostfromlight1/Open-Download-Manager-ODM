#!/bin/sh
if [ -x /usr/bin/odm-nmhost ]; then
  /usr/bin/odm-nmhost --uninstall-system || true
fi
