import type { Mavlink } from "./mavlink";
import type { Aircraft, Position, State } from "./model";

export const createAircraft = (mavlink: Mavlink) => {
  const destroy = mavlink.read(data => {
    console.log(data);
  });

  const state: State = {
    time: Date.now(),
    position: [-121, 37, 1000],
    orientation: [0, 0, 0],
  };

  return {
    get state() {
      return state;
    },
    flyTo: (_: Position) => console.log("Fly to", _),
    destroy,
  } satisfies Aircraft;
};
