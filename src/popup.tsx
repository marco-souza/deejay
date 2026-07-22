import { HashRouter, Route } from "@solidjs/router";
import { render } from "solid-js/web";
import Layout from "./components/Layout";
import { isActiveTabYouTube } from "./lib/tabs";
import AddPlaylist from "./pages/AddPlaylist";
import AddSong from "./pages/AddSong";
import Dashboard from "./pages/Dashboard";
import EditPlaylist from "./pages/EditPlaylist";
import PlaylistDetail from "./pages/PlaylistDetail";
import { loadPlaylists } from "./stores/playlists";

render(
  () => (
    <HashRouter root={Layout}>
      <Route path="/" component={Dashboard} />
      <Route path="/add" component={AddPlaylist} />
      <Route path="/add-song" component={AddSong} />
      <Route path="/playlists/:id" component={PlaylistDetail} />
      <Route path="/playlists/:id/edit" component={EditPlaylist} />
    </HashRouter>
  ),
  document.body,
);

async function init() {
  await loadPlaylists();
  const isYouTube = await isActiveTabYouTube();
  if (isYouTube) {
    window.location.hash = "#/add-song";
  }
}

init();
