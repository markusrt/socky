import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { requestPersistentStorage } from "./storage";

const root = document.getElementById("root");
if (!root) {
  throw new Error("root element missing");
}

requestPersistentStorage();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
