export type Position = [longitude: number, latitude: number, altitude: number];

export type Orientation = [pitch: number, yaw: number, roll: number];

export type State = {
  time: number;
  position: Position;
  orientation: Orientation;
  target?: Position;
};

export type Aircraft = {
  state: State;
  flyTo: (position: Position) => void;
};
