import browser from "webextension-polyfill";
import { z } from "zod";
import type { Playlist } from "../stores/playlists";

const PLAYLISTS_SYNC_KEY = "playlists";
const SONGS_LOCAL_KEY = "playlistSongs";

let saveQueue: Promise<void> = Promise.resolve();

const songSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  link: z.string(),
  cover: z.string(),
});

const playlistMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
});

const playlistSongsSchema = z.record(z.string(), z.array(songSchema));

export type PlaylistMetadata = z.infer<typeof playlistMetadataSchema>;
export type PlaylistSongs = z.infer<typeof playlistSongsSchema>;

function isExtensionContext(): boolean {
  try {
    return typeof browser !== "undefined" && !!browser.storage?.sync;
  } catch {
    return false;
  }
}

function fallbackGet<T>(key: string): T | undefined {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : undefined;
  } catch {
    return undefined;
  }
}

function fallbackSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write failures in fallback mode.
  }
}

export async function loadPlaylists(): Promise<Playlist[]> {
  let metadata: PlaylistMetadata[] = [];
  let songs: PlaylistSongs = {};

  try {
    let rawMetadata: unknown = [];
    let rawSongs: unknown = {};

    if (isExtensionContext()) {
      const [syncResult, localResult] = await Promise.all([
        browser.storage.sync.get(PLAYLISTS_SYNC_KEY),
        browser.storage.local.get(SONGS_LOCAL_KEY),
      ]);
      rawMetadata = syncResult[PLAYLISTS_SYNC_KEY];
      rawSongs = localResult[SONGS_LOCAL_KEY];
    } else {
      rawMetadata = fallbackGet(PLAYLISTS_SYNC_KEY);
      rawSongs = fallbackGet(SONGS_LOCAL_KEY);
    }

    const metadataResult = playlistMetadataSchema
      .array()
      .safeParse(rawMetadata);
    const songsResult = playlistSongsSchema.safeParse(rawSongs);

    if (!metadataResult.success || !songsResult.success) {
      console.error("Stored playlist data is invalid", {
        metadata: metadataResult.error,
        songs: songsResult.error,
      });
      return [];
    }

    metadata = metadataResult.data;
    songs = songsResult.data;
  } catch (error) {
    console.error("Failed to load playlists:", error);
  }

  return metadata.map((playlist) => ({
    ...playlist,
    songs: songs[playlist.id] ?? [],
  }));
}

export async function savePlaylists(playlists: Playlist[]) {
  saveQueue = saveQueue.then(async () => {
    const metadata: PlaylistMetadata[] = playlists.map(
      ({ songs: _songs, ...rest }) => rest,
    );
    const songs: PlaylistSongs = {};

    for (const playlist of playlists) {
      songs[playlist.id] = playlist.songs;
    }

    try {
      if (isExtensionContext()) {
        await Promise.all([
          browser.storage.sync.set({ [PLAYLISTS_SYNC_KEY]: metadata }),
          browser.storage.local.set({ [SONGS_LOCAL_KEY]: songs }),
        ]);
      } else {
        fallbackSet(PLAYLISTS_SYNC_KEY, metadata);
        fallbackSet(SONGS_LOCAL_KEY, songs);
      }
    } catch (error) {
      console.error("Failed to save playlists:", error);
    }
  });
  await saveQueue;
}
