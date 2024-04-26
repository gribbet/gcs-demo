import type { Aircraft, Position, State } from "./model";

export type App = {
  aircraft: Aircraft;
  destroy: () => void;
};

export const createApp = () => {
  const aircraft: Aircraft = {
    get state() {
      return {
        time: Date.now(),
        position: [-121, 37, 1000],
        orientation: [0, 0, 0],
      } satisfies State;
    },
    flyTo: (_: Position) => console.log("Fly to", _),
  };

  const destroy = () => {};

  return {
    get aircraft() {
      return aircraft;
    },
    destroy,
  };
};
