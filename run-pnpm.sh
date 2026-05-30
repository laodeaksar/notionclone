#!/bin/bash
NODE_BIN="/nix/store/bl6iwirn83qj9r8wng43kfdqd5mfahj8-nodejs-22.22.0/bin"
export PATH="$NODE_BIN:/home/runner/workspace/.npm-global/bin:$PATH"
exec pnpm "$@"
