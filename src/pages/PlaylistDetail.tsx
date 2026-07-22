import { A, useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import { getPlaylistById } from "../stores/playlists";

export default function PlaylistDetail() {
  const params = useParams();
  const playlist = () => getPlaylistById(params.id ?? "");

  return (
    <Show
      when={playlist()}
      fallback={<p class="text-error">Playlist not found.</p>}
    >
      {(p) => (
        <div class="flex flex-col gap-4">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 class="text-xl font-bold">{p().name}</h2>
              <p class="text-sm opacity-70">{p().description}</p>
            </div>
            <A
              href={`/playlists/${p().id}/edit`}
              class="badge badge-primary badge-lg"
            >
              Edit
            </A>
          </div>

          <div class="rounded-lg py-6" style={`background: ${p().color};`} />

          <div class="flex flex-col gap-3">
            <h3 class="text-lg font-semibold">Songs</h3>
            <For each={p().songs}>
              {(song) => (
                <a
                  href={song.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <img
                    src={song.cover}
                    alt={song.title}
                    class="w-12 h-12 rounded-md object-cover"
                  />
                  <span class="font-medium">{song.title}</span>
                </a>
              )}
            </For>
          </div>
        </div>
      )}
    </Show>
  );
}
