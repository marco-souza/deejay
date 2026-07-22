import { createStore } from "solid-js/store";

export type Playlist = {
  name: string;
  description: string;
  color: string;
};

type PlaylistsState = {
  playlists: Playlist[];
};

const initialPlaylists: Playlist[] = [];

export const [playlistsStore, setPlaylistsStore] = createStore<PlaylistsState>({
  playlists: initialPlaylists,
});

export function addPlaylist(playlist: Playlist) {
  setPlaylistsStore("playlists", (prev) => [...prev, playlist]);
}

export function removePlaylist(name: string) {
  setPlaylistsStore("playlists", (prev) =>
    prev.filter((playlist) => playlist.name !== name),
  );
}
