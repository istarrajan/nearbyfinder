import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { PlaceDetail } from "./components/PlaceDetail";
import { Terms } from "./components/Terms";
import { Privacy } from "./components/Privacy";
import { Contact } from "./components/Contact";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "place/:id", Component: PlaceDetail },
      { path: "terms", Component: Terms },
      { path: "privacy", Component: Privacy },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
]);
