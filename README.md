# Jags Radio Sync

Listen to WHOG 95.7 with an adjustable audio delay to match the Jaguars radio broadcast to YouTube Sunday Ticket or another TV feed.

## Run locally

Requires Python 3 and a modern browser that supports AudioWorklet (Chrome, Edge, Firefox, or Safari). No npm dependencies or build step are required.

```sh
git clone https://github.com/miller-ian/jags-radio-sync.git
cd jags-radio-sync
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Open **http://localhost:8080** in your browser. Keep the terminal running while listening. Press **Ctrl+C** in the terminal to stop the server. If port 8080 is in use, substitute 8081 in the command and browser URL.

Serve the app over localhost or HTTPS: opening `index.html` directly or serving over ordinary HTTP on a LAN address will not reliably support AudioWorklet.

## Sync with your TV

1. Mute the TV and any other radio player to avoid duplicate audio.
2. Select an initial delay (30 seconds is a starting point) and click **Start listening**. The app stays silent while the delay buffer fills.
3. If radio is ahead of TV, increase the delay. If radio is behind, reduce it. Use **±5s** for larger changes and **±0.25s** to fine-tune.
4. Alternatively, when you hear a distinctive snap or whistle, press and hold **Hold to sync**. Release when that moment appears on TV. Holding silences the audio and increases delay.
5. Leave the tab open and your device awake. Your delay is remembered in this browser; stopping or reloading discards buffered audio.

The maximum added delay is 180 seconds. Changes can briefly skip or repeat audio. TV buffering, network stalls, or switching channels may require re-syncing. There is no automatic access to or synchronization with your TV.

## How it works

The app loads the AAC stream configured by the [official WHOG player](https://player.streamguys.com/ssc/whog/sgplayer/player.php): `https://ssc.streamguys1.com/whog-icy`. An AudioWorklet uses a stereo ring buffer to delay playback on your device. Audio is not uploaded or saved on a server; each listener connects directly to WHOG. Added delay is on top of the station's existing stream latency.

- `dist/index.html`: player interface
- `dist/style.css`: responsive styling
- `dist/app.js`: stream connection and controls
- `dist/delay-worklet.js`: audio buffer and playback processing
- `.openai/hosting.json`: existing private Sites deployment configuration; not required for local use

## Troubleshooting

- **No audio immediately after starting:** wait for the delay countdown to finish, then check the volume and mute controls.
- **Connection fails:** check the [original WHOG player](https://player.streamguys.com/ssc/whog/sgplayer/player.php), your connection, and whether your browser supports AAC playback. Retry Start listening.
- **Audio stops after sleep or a connection drop:** start again to reconnect and rebuild the buffer, then check sync.
- **App loads but audio processing fails:** use localhost or HTTPS and a current browser.
- **Different programming or no game:** stream availability, geographic restrictions, and game coverage are controlled by the station. This app does not bypass those restrictions.

Independent listening tool. Not affiliated with WHOG, the Jacksonville Jaguars, or YouTube.
