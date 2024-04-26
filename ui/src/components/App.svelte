<script lang="ts">
  import { onMount } from "svelte";

  import { createApp } from "../app";
  import type { Aircraft } from "../model";
  import World from "./World.svelte";

  let aircraft: Aircraft | undefined;

  onMount(() => {
    const app = createApp();

    const interval = setInterval(() => {
      ({ aircraft } = app);
    }, 200);

    return () => {
      clearInterval(interval);
      app.destroy();
    };
  });
</script>

<div class="app">
  {#if aircraft}
    <World {aircraft} />
  {/if}
</div>

<style>
  :global(:root) {
    --background: hsl(213deg 10% 10%);
  }

  :global(html) {
    background: var(--background);
    color: white;
    font-size: 16px;
    overscroll-behavior: none;
  }

  :global(body) {
    margin: 0;
    overscroll-behavior: none;
  }

  .app {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
