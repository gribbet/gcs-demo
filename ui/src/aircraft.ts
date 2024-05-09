import { common } from "node-mavlink";

import type { Mavlink } from "./mavlink";
import type { Aircraft, Position, State } from "./model";

export const createAircraft = (mavlink: Mavlink) => {
  const state: State = {
    time: Date.now(),
    position: [-121, 37, 1000],
    orientation: [0, 0, 0],
  };

  const destroy = mavlink.read(message => {
    state.time = Date.now();
    if (message instanceof common.GlobalPositionInt) {
      const latitude = message.lat / 1e7;
      const longitude = message.lon / 1e7;
      const altitude = message.alt / 1e3;
      state.position = [longitude, latitude, altitude];
    } else if (message instanceof common.Attitude) {
      const { pitch, yaw, roll } = message;
      state.orientation = [pitch, yaw, roll];
    }
  });

  return {
    get state() {
      return state;
    },
    flyTo: (_: Position) => console.log("Fly to", _),
    destroy,
  } satisfies Aircraft;
};
