/// <reference types="vite/client" />

import App from "./components/App.svelte";

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
