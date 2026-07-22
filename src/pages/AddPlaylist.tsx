import { useNavigate } from "@solidjs/router";
import { addPlaylist } from "../stores/playlists";

export default function AddPlaylist() {
  const navigate = useNavigate();

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    addPlaylist({
      name: String(data.get("name")),
      description: String(data.get("description")),
      color: String(data.get("color")),
    });

    form.reset();
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-4">
      <h2 class="text-lg font-bold">Add Playlist</h2>

      <label class="flex flex-col gap-1">
        Name
        <input
          type="text"
          name="name"
          class="input input-bordered"
          autofocus
          required
        />
      </label>

      <label class="flex flex-col gap-1">
        Description
        <textarea name="description" class="textarea textarea-bordered" />
      </label>

      <label class="flex flex-col gap-1">
        Color
        <input
          type="color"
          name="color"
          value="#6366f1"
          class="input input-bordered h-12"
        />
      </label>

      <button type="submit" class="btn btn-primary">
        Create
      </button>
    </form>
  );
}
