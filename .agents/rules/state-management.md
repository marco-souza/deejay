# State Management Rules

Use the right SolidJS primitive for the right scope.

## Global / shared state

- Put global or shared state in `src/stores/` using `createStore`.
- Export the store, setter helpers, and related types from the store file.

## Local component state

- Use `createStore` for grouped/complex local state (e.g. forms with multiple fields).
- Use `createSignal` only for simple, independent local values (one value per signal).

## Form state

- Prefer uncontrolled forms using `FormData` from the submit event; add `name` attributes to inputs and read values on submit.
- Use controlled state (`createStore` or `createSignal`) only when you need reactive validation, derived fields, or live preview.
- Reset the form after a successful submit.
