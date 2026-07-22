import { HashRouter, Route } from "@solidjs/router";
import { render } from "solid-js/web";
import Layout from "./components/Layout";
import AddPlaylist from "./pages/AddPlaylist";
import Dashboard from "./pages/Dashboard";

render(
  () => (
    <HashRouter root={Layout}>
      <Route path="/" component={Dashboard} />
      <Route path="/add" component={AddPlaylist} />
    </HashRouter>
  ),
  document.body,
);
