# DeeJay

A browser extension for building music playlists from YouTube and YouTube Music.

## Features

- Create, edit, and delete playlists.
- Add songs directly from the current YouTube or YouTube Music tab.
- Auto-opens the add-song flow when the extension is opened on a YouTube page.
- Playlist metadata syncs across devices via your Google account (Chrome Storage `sync`).
- Songs are stored locally (Chrome Storage `local`).

## Tech Stack

- [SolidJS](https://www.solidjs.com/) with `@solidjs/router`
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- [Vite](https://vitejs.dev/) + `vite-plugin-web-extension`
- [webextension-polyfill](https://github.com/mozilla/webextension-polyfill)
- [Zod](https://zod.dev/) for runtime validation

## Getting Started

Requires [Bun](https://bun.sh/).

```bash
bun install
bun run dev
```

Then load the extension:

- **Chrome**: Go to `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the `dist/` folder.
- **Firefox**: Go to `about:debugging`, click **This Firefox**, then **Load Temporary Add-on**, and select `dist/manifest.json`.

## Scripts

| Script | Description |
| --- | --- |
| `bun run dev` | Start the Vite dev server. |
| `bun run build` | Type-check and build the extension. |
| `bun run check` | Run Biome lint and format with auto-fix. |
| `bun run format` | Run Biome formatter. |
| `bun run lint` | Run Biome linter. |

## Permissions

- `storage` — persist playlists and songs.
- `tabs` / `activeTab` — read the active tab URL.
- `scripting` — extract metadata from YouTube/YT Music pages.

## Project Structure

```
src/
├── background.ts          # Service worker / background script
├── components/Layout.tsx  # App shell and navigation
├── lib/
│   ├── storage.ts         # Hybrid sync/local storage with Zod validation
│   └── tabs.ts            # Active tab detection and YouTube metadata extraction
├── pages/
│   ├── AddPlaylist.tsx    # Create a new playlist
│   ├── AddSong.tsx        # Add a song from the current YouTube tab
│   ├── Dashboard.tsx      # List of playlists
│   ├── EditPlaylist.tsx   # Edit / delete a playlist
│   └── PlaylistDetail.tsx # View a playlist and its songs
├── popup.html / popup.tsx # Extension popup entry
├── stores/playlists.tsx   # Playlist store and mutations
└── manifest.json          # Extension manifest
```

## License

MIT
