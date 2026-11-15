# Jags Radio Sync
A browser-local WHOG audio delay player. Serve `dist` over HTTPS or localhost. No audio is uploaded, stored on a server, or shared between listeners.

Uses the AAC stream configured by the official WHOG player, CORS-enabled HTML audio, and an AudioWorklet stereo ring buffer (maximum 180 seconds). Start fills a new buffer; stop discards it. Adjustments move the read position and can briefly skip or repeat audio. Hold adds delay while silencing playback. Delay means added delay, not total broadcast latency. Keep the tab open and device awake. Network stalls and TV buffering can require re-syncing. Station restrictions still apply.

Local preview: `python3 -m http.server 8080 --directory dist`
