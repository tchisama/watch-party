# Nexus Sync: Watch Party

A lightweight browser extension to synchronize video playback across multiple browsers using Firebase Realtime Database.

## Installation (Developer Mode)

### Firefox
1. Open `about:debugging` in Firefox.
2. Click **This Firefox**.
3. Click **Load Temporary Add-on...**.
4. Select the `manifest.json` file in this directory.

### Chrome
1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this directory.

## Features
- **Recursive Lock Pattern**: Prevents infinite playback loops.
- **Firebase Realtime Sync**: Sub-second latency for play/pause/seek events.
- **Dark Mode UI**: Clean, minimal interface.

## Tech Stack
- Manifest V3
- Firebase Realtime Database (Compat SDK)
- Vanilla JavaScript
