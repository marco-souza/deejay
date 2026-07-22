import { onMount, For } from "solid-js";
import { playlistsStore, type Playlist } from "../stores/playlists";

export default function Popup() {
  onMount(() => {
    console.log("Hello from the popup!");
  });

  return (
    <div>
      <div class="navbar bg-base-100 shadow-sm">
        <div class="navbar-start">
          <button class="btn btn-sm btn-dash">Back</button>
        </div>

        <div class="navbar-center flex-1">
          <a class="btn btn-ghost text-xl">DeeJay</a>
        </div>

        <div class="navbar-end">
          <button class="btn btn-sm btn-dash">+ Add</button>
        </div>
      </div>

      <PlaylistShow playlists={playlistsStore.playlists} />
    </div>
  );
}

type PlaylistShowProps = {
  readonly playlists: Playlist[];
};

function PlaylistShow(props: PlaylistShowProps) {
  return (
    <div class="p-2">
      <h2>Playlists</h2>

      <div class="flex flex-col gap-4">
        {props.playlists.length === 0 ? (
          <p>No playlist created, add one here</p>
        ) : (
          <For each={props.playlists}>
            {(p) => (
              <div class="card bg-base-300 w-full shadow-sm rounded-md ">
                <div
                  class={`cover py-4`}
                  style={`background: ${p.color};`}
                ></div>
                <div class="card-body">
                  <h2 class="card-title">{p.name}</h2>
                  <p>{p.description}</p>
                </div>
              </div>
            )}
          </For>
        )}
      </div>
    </div>
  );
}
