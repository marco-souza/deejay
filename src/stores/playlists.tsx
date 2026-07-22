import { createStore } from "solid-js/store";
import * as storage from "../lib/storage";

export type Song = {
  id: string;
  title: string;
  description: string;
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

export const [playlistsStore, setPlaylistsStore] = createStore<PlaylistsState>({
  playlists: initialPlaylists,
});

export async function loadPlaylists() {
  const playlists = await storage.loadPlaylists();
  setPlaylistsStore("playlists", playlists);
}

export async function addPlaylist(
  playlist: Omit<Playlist, "id" | "songs">,
): Promise<Playlist> {
  const newPlaylist: Playlist = {
    ...playlist,
    id: crypto.randomUUID(),
    songs: [],
  };
  const next = [...playlistsStore.playlists, newPlaylist];
  setPlaylistsStore("playlists", next);
  await storage.savePlaylists(next);
  return newPlaylist;
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

export async function addSongToPlaylist(
  playlistId: string,
  song: Omit<Song, "id">,
) {
  const next = playlistsStore.playlists.map((playlist) =>
    playlist.id === playlistId
      ? {
          ...playlist,
          songs: [...playlist.songs, { ...song, id: crypto.randomUUID() }],
        }
      : playlist,
  );
  setPlaylistsStore("playlists", next);
  await storage.savePlaylists(next);
}

export function getPlaylistById(id: string): Playlist | undefined {
  return playlistsStore.playlists.find((playlist) => playlist.id === id);
}
