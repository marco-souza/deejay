import { useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { z } from "zod";
import { addPlaylist } from "../stores/playlists";

const playlistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color"),
});

type FormErrors = {
  name?: string;
  color?: string;
};

export default function AddPlaylist() {
  const navigate = useNavigate();
  const [errors, setErrors] = createStore<FormErrors>({});

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const result = playlistSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        name: fieldErrors.name?.at(0),
        color: fieldErrors.color?.at(0),
      });
      return;
    }

    setErrors({});
    addPlaylist(result.data);

    form.reset();
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-4">
      <h2 class="text-lg font-bold">Add Playlist</h2>

      <label class="flex flex-col gap-1">
        Name
        <div class="join w-full">
          <input
            type="text"
            name="name"
            class="input input-bordered join-item flex-1"
            placeholder="Playlist name"
            autofocus
            required
          />
          <input
            type="color"
            name="color"
            value="#6366f1"
            class="input input-bordered join-item w-14 shrink-0 p-1"
            aria-label="Color"
          />
        </div>
        {errors.name && <span class="text-error text-sm">{errors.name}</span>}
        {errors.color && <span class="text-error text-sm">{errors.color}</span>}
      </label>

      <label class="flex flex-col gap-1">
        Description
        <textarea name="description" class="textarea textarea-bordered" />
      </label>

      <button type="submit" class="btn btn-primary">
        Create
      </button>
    </form>
  );
}
