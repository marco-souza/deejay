import { createStore } from "solid-js/store";

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

export function addPlaylist(playlist: Omit<Playlist, "id" | "songs">) {
  const newPlaylist: Playlist = {
    ...playlist,
    id: crypto.randomUUID(),
    songs: mockSongs,
  };
  setPlaylistsStore("playlists", (prev) => [...prev, newPlaylist]);
}

export function updatePlaylist(
  id: string,
  updates: Omit<Playlist, "id" | "songs">,
) {
  setPlaylistsStore("playlists", (prev) =>
    prev.map((playlist) =>
      playlist.id === id ? { ...playlist, ...updates } : playlist,
    ),
  );
}

export function removePlaylist(id: string) {
  setPlaylistsStore("playlists", (prev) =>
    prev.filter((playlist) => playlist.id !== id),
  );
}

export function getPlaylistById(id: string): Playlist | undefined {
  return playlistsStore.playlists.find((playlist) => playlist.id === id);
}
