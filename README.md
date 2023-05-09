# Weather Picture

## Raspberry PI
To run electron on Raspberry Pi 64bit `sudo usermod -a -G render pi` needed to be run.

Also only electron 17 works for whatever reason which also requires `const fetch = require("node-fetch")` in main.js since fetch is not build-in
