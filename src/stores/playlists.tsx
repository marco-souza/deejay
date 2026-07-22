import { createStore } from "solid-js/store";
import * as storage from "../lib/storage";

export type Song = {
  title: string;
  link: string;
  cover: string;
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  color: string;
  songs: Song[];
};

type PlaylistsState = {
  playlists: Playlist[];
};

const initialPlaylists: Playlist[] = [];

const mockSongs: Song[] = [
  {
    title: "Midnight City",
    link: "https://example.com/midnight-city",
    cover: "https://placehold.co/150x150/6366f1/ffffff?text=Midnight",
  },
  {
    title: "Dreams",
    link: "https://example.com/dreams",
    cover: "https://placehold.co/150x150/10b981/ffffff?text=Dreams",
  },
  {
    title: "Golden Hour",
    link: "https://example.com/golden-hour",
    cover: "https://placehold.co/150x150/f59e0b/ffffff?text=Golden",
  },
];

export const [playlistsStore, setPlaylistsStore] = createStore<PlaylistsState>({
  playlists: initialPlaylists,
});

export async function loadPlaylists() {
  const playlists = await storage.loadPlaylists();
  setPlaylistsStore("playlists", playlists);
}

export async function addPlaylist(playlist: Omit<Playlist, "id" | "songs">) {
  const newPlaylist: Playlist = {
    ...playlist,
    id: crypto.randomUUID(),
    songs: mockSongs,
  };
  const next = [...playlistsStore.playlists, newPlaylist];
  setPlaylistsStore("playlists", next);
  await storage.savePlaylists(next);
}

export async function updatePlaylist(
  id: string,
  updates: Omit<Playlist, "id" | "songs">,
) {
  const next = playlistsStore.playlists.map((playlist) =>
    playlist.id === id ? { ...playlist, ...updates } : playlist,
  );
  setPlaylistsStore("playlists", next);
  await storage.savePlaylists(next);
}

export async function removePlaylist(id: string) {
  const next = playlistsStore.playlists.filter(
    (playlist) => playlist.id !== id,
  );
  setPlaylistsStore("playlists", next);
  await storage.savePlaylists(next);
}

export function getPlaylistById(id: string): Playlist | undefined {
  return playlistsStore.playlists.find((playlist) => playlist.id === id);
}
