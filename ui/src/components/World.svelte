<script lang="ts">
  import { onMount } from "svelte";

  import type { Aircraft } from "../model";
  import type { World } from "../world";
  import { createWorld } from "../world";

  export let aircraft: Aircraft;

  let element: HTMLCanvasElement | undefined;
  let world: World | undefined;

  $: ({ state } = aircraft);

  onMount(() => {
    if (!element) return;

    world = createWorld(element, {
      state: () => state,
      onTarget: aircraft.flyTo,
    });

    return () => world?.dispose();
  });
</script>

<canvas bind:this={element} />

<style>
  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
</style>
