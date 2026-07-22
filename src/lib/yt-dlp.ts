import type { Playlist } from "../stores/playlists";

export function generateYtDlpCommand(playlist: Playlist): string {
  const folderName =
    playlist.name.replace(/[<>:"/\\|?*']/g, "_").trim() || "playlist";
  const urls = playlist.songs
    .map((song) => song.link.trim())
    .filter(Boolean)
    .map((url) => `'${url}'`)
    .join(" ");

  if (!urls) {
    return "# No valid song URLs in this playlist.";
  }

  return `yt-dlp --cookies-from-browser brave -x --audio-format mp3 --ignore-errors --no-playlist -o "${folderName}/%(title)s.%(ext)s" ${urls}`;
}

export async function copyYtDlpCommand(playlist: Playlist): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(generateYtDlpCommand(playlist));
    return true;
  } catch (error) {
    console.error("Failed to copy yt-dlp command:", error);
    return false;
  }
}
