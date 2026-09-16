import "./index.css";
import { AppShell } from "./components/layout/AppShell";
import { getAppPath } from "./lib/routing";
import { matchRoute, navigationRoutes } from "./routes";

export function App() {
  const route = matchRoute(getAppPath(window.location.pathname));

  return <AppShell routes={navigationRoutes}>{route.element}</AppShell>;
}

export default App;
