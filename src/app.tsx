import { createRoot } from "react-dom/client";
import IndexPage from "./pages/IndexPage";
import QuickMenu from "./pages/QuickMenu";
import Notification from "./components/Notification";

const routes: { [key: string]: any } = {
  "#/quick-menu": <QuickMenu />,
};

const root = createRoot(document.getElementById("app"));
root.render(
  <Notification>{routes[location.hash] || <IndexPage />}</Notification>
);

window.addEventListener("error", (e) => alert(`Error: ${e.message}`));
