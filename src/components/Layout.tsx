import { A, type RouteSectionProps, useLocation } from "@solidjs/router";

export default function Layout(props: RouteSectionProps) {
  const location = useLocation();
  const isDashboard = () => location.pathname === "/";
  const isAddPage = () => location.pathname === "/add";

  return (
    <div>
      <div class="navbar bg-base-100 shadow-sm">
        <div class="navbar-start">
          {!isDashboard() && (
            <A href="/" class="btn btn-sm btn-dash">
              Back
            </A>
          )}
        </div>

        <div class="navbar-center flex-1">
          <A href="/" class="btn btn-ghost text-xl">
            DeeJay
          </A>
        </div>

        <div class="navbar-end">
          {!isAddPage() && (
            <A href="/add" class="btn btn-sm btn-dash">
              + Add
            </A>
          )}
        </div>
      </div>

      <main class="p-2">{props.children}</main>
    </div>
  );
}
