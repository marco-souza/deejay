import { createStore } from "solid-js/store";

export type Playlist = {
  name: string;
  description: string;
  color: string;
};

type PlaylistsState = {
  playlists: Playlist[];
};

const initialPlaylists: Playlist[] = [
  {
    name: "Focus Flow",
    description: "Deep work concentration music",
    color: "#6366f1",
  },
  {
    name: "Gym Hype",
    description: "High energy workout tracks",
    color: "#ef4444",
  },
  {
    name: "Late Night Jazz",
    description: "Smooth jazz for relaxing evenings",
    color: "#f59e0b",
  },
  {
    name: "Coding Lo-Fi",
    description: "Chill beats to code to",
    color: "#10b981",
  },
  {
    name: "Road Trip",
    description: "Sunny windows-down anthems",
    color: "#3b82f6",
  },
  {
    name: "Rainy Day",
    description: "Ambient warmth for grey skies",
    color: "#64748b",
  },
];

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
