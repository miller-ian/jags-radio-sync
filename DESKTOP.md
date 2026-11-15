# Jags Radio Sync — desktop downloads

Download the app for your computer from this release. No Git, Python, Node, browser installation, or ChatGPT account is required. Internet access is needed to listen to WHOG.

## Windows

Download **Jags-Radio-Sync-Windows-x64.exe** and double-click it. This is a portable app: no installer is needed. Keep the EXE wherever you like and use it again next game. Intended for Windows 10/11 on Intel or AMD PCs.

## Mac

Download **Jags-Radio-Sync-Mac-arm64.dmg** for an Apple Silicon Mac (M1 or later), or **Jags-Radio-Sync-Mac-x64.dmg** for an Intel Mac. Open the DMG, drag Jags Radio Sync into Applications, then open it from Applications.

These apps are unsigned and the Mac apps are not notarized. Windows SmartScreen or macOS Gatekeeper may show a warning or block opening them. Only open a copy you trust. There is no paid code-signing identity bundled with this project.

## Listen with the TV

1. Mute your TV and any other radio player.
2. Click **Start listening**. Wait for the delay buffer to fill (30 seconds initially).
3. If radio is ahead of the TV, add delay with **+5s** or **+0.25s**. If radio is behind, subtract delay.
4. Or hold **Hold to sync** when you hear a snap or whistle, then release when that moment appears on TV.
5. Leave the app open and your computer awake. Close the window to stop the app.

Your delay is remembered on this computer. Closing the app clears the audio buffer. The maximum added delay is three minutes. TV buffering may require adjusting it again. Stream availability and game coverage are controlled by WHOG.

## Sending it to family

You can download the matching EXE or DMG and send that file directly. Your family does not need access to this private GitHub repository. Email services may block large executables, so a trusted file-sharing service or USB drive may be easier. Send the appropriate app file together with these instructions.

## Build from source (developers only)

Install Node.js 22 or later, then run `npm ci`. Use `npm start` for development, `npm run build:win` on Windows, or `npm run build:mac` on a Mac. Outputs are in `release/`. The Build desktop apps GitHub Actions workflow builds both platforms and publishes the downloads as a GitHub release.
