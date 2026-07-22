import { A, useParams } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { copyYtDlpCommand } from "../lib/yt-dlp";
import { getPlaylistById } from "../stores/playlists";

export default function PlaylistDetail() {
  const params = useParams();
  const playlist = () => getPlaylistById(params.id ?? "");
  const [copyStatus, setCopyStatus] = createSignal("");

  const handleCopyCommand = async () => {
    const p = playlist();
    if (!p) return;
    const ok = await copyYtDlpCommand(p);
    setCopyStatus(ok ? "Command copied!" : "Failed to copy.");
    setTimeout(() => setCopyStatus(""), 2000);
  };

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

            <div class="flex gap-2">
              <button
                type="button"
                onClick={handleCopyCommand}
                disabled={p().songs.length === 0}
                class="btn btn-secondary btn-xs"
                title="Copy yt-dlp command to download all songs as MP3"
              >
                yt-dlp
              </button>
              <A
                href={`/playlists/${p().id}/edit`}
                class="btn btn-primary btn-xs"
              >
                Edit
              </A>
            </div>
          </div>

          <Show when={copyStatus()}>
            <div class="alert alert-success py-2 text-sm">{copyStatus()}</div>
          </Show>

          <div class="rounded-sm py-2" style={`background: ${p().color};`} />

          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Songs</h3>
              <button
                type="button"
                onClick={() => alert("Adding songs is not implemented yet.")}
                class="btn btn-sm btn-primary"
              >
                + Add
              </button>
            </div>
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
                  <div class="flex flex-col min-w-0">
                    <span class="font-medium truncate">{song.title}</span>
                    <Show when={song.description}>
                      <span class="text-sm opacity-70 truncate">
                        {song.description}
                      </span>
                    </Show>
                  </div>
                </a>
              )}
            </For>
          </div>
        </div>
      )}
    </Show>
  );
}
