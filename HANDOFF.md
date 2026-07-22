# Handoff: Deno Desktop Companion Research & Planning

## Project Context

**DeeJay** is a browser extension for managing music playlists from YouTube and YouTube Music. It is built as a SolidJS + TypeScript + Tailwind CSS + DaisyUI browser extension using Vite and `vite-plugin-web-extension`.

- Repository: `https://github.com/marco-souza/deejay`
- README: `README.md` (covers setup, features, scripts, permissions, structure)
- Live code: `main` branch pushed to GitHub

## Current Features (as of this handoff)

- Create, edit, and delete playlists.
- Playlist detail view with songs, descriptions, and cover images.
- Add songs directly from YouTube/YouTube Music tabs via `/add-song`.
  - Auto-opens `/add-song` when the extension popup is opened on a YouTube/YouTube Music page.
  - If no playlist exists, redirects to `/add` (create playlist) first, then returns to `/add-song` with the new playlist pre-selected.
- Hybrid storage:
  - Playlist metadata syncs via `chrome.storage.sync` (Google account sync).
  - Songs stored in `chrome.storage.local`.
  - Zod validation on load.
  - Saves serialized to avoid race conditions.
- `yt-dlp` command generation:
  - On a playlist detail page, there is a `yt-dlp` button that copies a command to download all songs as MP3 into a folder named after the playlist.

## Tech Stack

- **Frontend**: SolidJS, `@solidjs/router`, Tailwind CSS v4, DaisyUI
- **Build**: Vite, `vite-plugin-web-extension`, `vite-plugin-solid`, `@tailwindcss/vite`
- **Validation**: Zod
- **Extension API**: `webextension-polyfill`
- **Package Manager**: Bun
- **Repo**: GitHub (`marco-souza/deejay`)

## Goal for Next Agent

Research and plan a **Deno desktop companion app** that:

1. Displays all playlists and their songs.
2. Runs `yt-dlp` to download songs as MP3 (or other chosen format).
3. Organizes downloads into folders named after playlists.
4. Syncs or receives playlist data from the browser extension.

## Key Research Questions

### 1. Sync Strategy

How does the desktop app get playlist data from the extension?

| Option | Pros | Cons |
| --- | --- | --- |
| **Local file export** from extension (JSON) | Simple, no hosting, no auth | Manual, not real-time, no cross-device sync |
| **Shared backend** (Deno Deploy, Supabase, Firebase) | Real-time sync, cross-device | Hosting cost, auth, privacy, maintenance |
| **Read Chrome storage directly** | No extra network | Chrome encrypts storage; hard/fragile to read from outside browser |
| **Native messaging** between extension and desktop app | Direct, real-time on same machine | OS-specific setup, complex to install, not cross-device |

**Recommendation to research**: Start with the **local file export** for personal/single-machine use, then evaluate a small backend for multi-device sync.

### 2. Desktop App Architecture

What form should the Deno desktop app take?

| Option | Pros | Cons |
| --- | --- | --- |
| **Deno local server + browser UI** | Simplest, no native UI framework | Feels like a web app, not a desktop app |
| **Deno + webview** (`deno-webview`) | Native-like window | Less mature, may need FFI, cross-platform concerns |
| **Tauri desktop app** | Mature, small binaries | Uses Rust, not Deno; steeper curve if Deno is required |
| **Deno CLI tool** | Minimal | Not a desktop app, less user-friendly |

**Recommendation to research**: Compare `deno-webview` maturity vs. a local server + default browser. Determine if the user wants a true native window or a local web UI is acceptable.

### 3. yt-dlp Integration

How does the Deno app run yt-dlp?

- **Subprocess**: `new Deno.Command("yt-dlp", { args: [...] })`
  - Requires user to have Python and yt-dlp installed.
  - Simplest to implement.
- **Bundle Python + yt-dlp**: Larger downloads, complex packaging.
- **Deno-native port**: Investigate if any Deno/JS yt-dlp ports exist; likely none reliable.

**Research tasks**:
- Document how to spawn and stream output from yt-dlp in Deno.
- Check progress reporting (e.g., `--print`, `--progress`, or parsing stdout).
- Determine download directory convention (`~/Music/DeeJay/<playlist-name>/`).
- Handle filename sanitization and duplicates.

### 4. Auth & Permissions

- If using a backend, how does the extension authenticate?
- Does the user want public distribution or personal use? This affects sync and legal choices.

## Proposed Minimum Viable Companion (MVC)

1. **Extension**: Add an “Export playlists” button that downloads a JSON file with all playlists and songs.
2. **Deno app**: A small local server/UI that:
   - Imports the exported JSON.
   - Lists playlists and songs.
   - For each playlist, generates and runs a `yt-dlp` command to download all songs as MP3 into a folder named after the playlist.
   - Shows download progress (basic stdout parsing).

This keeps the extension legally clean (no direct downloading) and gives the desktop app a clear, offline-first scope.

## Files to Review

- `src/stores/playlists.tsx` — playlist/song data model and mutations.
- `src/lib/storage.ts` — hybrid storage strategy.
- `src/lib/tabs.ts` — active tab reading and YouTube detection.
- `src/lib/yt-dlp.ts` — existing command generator.
- `src/pages/PlaylistDetail.tsx` — where the yt-dlp button lives.
- `src/manifest.json` — permissions and extension config.
- `README.md` — current project overview.

## Deliverables for Next Agent

1. A researched recommendation for sync strategy.
2. A researched recommendation for desktop app form (server + browser vs. webview vs. Tauri).
3. A researched plan for yt-dlp integration in Deno.
4. A proposed file structure and API surface for the Deno companion.
5. (Optional) A small proof-of-concept Deno script that runs `yt-dlp` for a single URL.

## Open Questions

- Is this companion for personal use or public distribution?
- Does the user require a true native window, or is a local web UI acceptable?
- Should downloads be cross-device synced, or single-machine only?
- Should the companion support formats other than MP3?
- Should the companion download video or audio only?

## Notes

- The extension intentionally does not download anything itself to avoid YouTube ToS and Chrome Web Store policy issues.
- The desktop companion should preserve this separation: the extension manages playlists; the companion performs downloads locally.
