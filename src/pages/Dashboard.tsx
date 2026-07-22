import { A } from "@solidjs/router";
import { For } from "solid-js";
import { playlistsStore } from "../stores/playlists";

export default function Dashboard() {
  return (
    <div class="flex flex-col gap-4">
      <h2 class="text-lg font-bold">Playlists</h2>

      {playlistsStore.playlists.length === 0 ? (
        <div class="flex flex-col items-center gap-4">
          <p>No playlist created, add one here</p>
          <A href="/add" class="btn btn-primary">
            + Add Playlist
          </A>
        </div>
      ) : (
        <For each={playlistsStore.playlists}>
          {(p) => (
            <div class="card bg-base-300 w-full shadow-sm rounded-md">
              <div class="rounded-lg py-4" style={`background: ${p.color};`} />

              <div class="card-body">
                <h3 class="card-title">{p.name}</h3>
                <p>{p.description}</p>
              </div>
            </div>
          )}
        </For>
      )}
    </div>
  );
}
