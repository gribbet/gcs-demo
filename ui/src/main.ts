/// <reference types="vite/client" />

import App from "./components/App.svelte";
import { endpoint } from "./configuration";

console.log("Endpoint", endpoint);

window.addEventListener("load", () =>
  navigator.serviceWorker.register(
    import.meta.env.PROD
      ? "./service-worker.js"
      : new URL("./service-worker", import.meta.url),
    { type: "module" },
  ),
);

new App({
  target: document.body,
});
