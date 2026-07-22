import { A, useLocation, useNavigate } from "@solidjs/router";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js";
import { getActiveTabSongData } from "../lib/tabs";
import { addSongToPlaylist, playlistsStore } from "../stores/playlists";

export default function AddSong() {
  const navigate = useNavigate();
  const location = useLocation();
  const [playlistId, setPlaylistId] = createSignal(
    (location.state as { selectedPlaylistId?: string } | undefined)
      ?.selectedPlaylistId ?? "",
  );

  const [songData] = createResource(
    () => playlistsStore.playlists.length > 0,
    getActiveTabSongData,
  );

  onMount(() => {
    if (playlistsStore.playlists.length === 0) {
      navigate("/add", { state: { returnTo: "/add-song" } });
    }
  });

  createEffect(() => {
    if (!playlistId() && playlistsStore.playlists.length > 0) {
      setPlaylistId(playlistsStore.playlists[0].id);
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const data = songData();
    const selectedId = playlistId();
    if (!data || !selectedId) return;

    await addSongToPlaylist(selectedId, {
      title: data.title,
      description: data.description,
      link: data.url,
      cover: data.cover,
    });
    navigate(`/playlists/${selectedId}`);
  };

  return (
    <div class="flex flex-col gap-4">
      <h2 class="text-lg font-bold">Add Song</h2>

      <Show when={songData.loading}>
        <p class="text-center">Loading song info...</p>
      </Show>

      <Show when={!songData.loading && songData() === null}>
        <div class="alert alert-warning">
          Open a YouTube or YouTube Music video to add a song.
        </div>
      </Show>

      <Show when={songData()}>
        {(data) => (
          <form onSubmit={handleSubmit} class="flex flex-col gap-4">
            <label class="flex flex-col gap-1">
              Title
              <input
                type="text"
                class="input input-bordered"
                value={data().title}
                disabled
              />
            </label>

            <label class="flex flex-col gap-1">
              Description
              <textarea
                class="textarea textarea-bordered"
                value={data().description}
                disabled
              />
            </label>

            <label class="flex flex-col gap-1">
              URL
              <input
                type="text"
                class="input input-bordered"
                value={data().url}
                disabled
              />
            </label>

            <Show when={data().cover}>
              <img
                src={data().cover}
                alt="Cover"
                class="w-32 h-32 rounded-lg object-cover"
              />
            </Show>

            <label class="flex flex-col gap-1">
              Playlist
              <select
                class="select select-bordered w-full"
                value={playlistId()}
                onChange={(e) => setPlaylistId(e.currentTarget.value)}
                required
              >
                <option value="" disabled>
                  Select a playlist
                </option>
                <For each={playlistsStore.playlists}>
                  {(playlist) => (
                    <option value={playlist.id}>{playlist.name}</option>
                  )}
                </For>
              </select>
            </label>

            <div class="flex gap-2">
              <A href="/" class="btn btn-ghost flex-1">
                Cancel
              </A>
              <button type="submit" class="btn btn-primary flex-1">
                Add Song
              </button>
            </div>
          </form>
        )}
      </Show>
    </div>
  );
}
