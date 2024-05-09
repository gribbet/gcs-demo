import { createAircraft } from "./aircraft";
import { endpoint } from "./configuration";
import { createMavlink } from "./mavlink";
import type { Aircraft } from "./model";
import { createWebSocketChannel } from "./websocket";

export type App = {
  aircraft: Aircraft;
  destroy: () => void;
};

export const createApp = () => {
  const aircraft = createAircraft(
    createMavlink(createWebSocketChannel(endpoint)),
  );

  const { destroy } = aircraft;

  return {
    get aircraft() {
      return aircraft;
    },
    destroy,
  };
};
