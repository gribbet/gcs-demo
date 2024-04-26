import type { vec4 } from "gl-matrix";
import { quat } from "gl-matrix";
import type { Context, Mesh, Properties } from "world.ts";
import {
  createContainer,
  createObjectLayer,
  createOrientationTransition,
  createPositionVelocityTransition,
  degrees,
} from "world.ts";

import type { State } from "../model";
import { loadObj } from "./obj";

const aircraftObj = new URL("./aircraft.obj", import.meta.url).toString();
const aircraftOutlineObj = new URL(
  "./aircraft-outline.obj",
  import.meta.url,
).toString();

export type AircraftLayerProperties = {
  state: State | undefined;
  onClick: () => void;
};

export const createAircraftLayer = (
  context: Context,
  properties: Properties<AircraftLayerProperties>,
) => {
  const { state, onClick } = properties;

  const size = 1;
  const minSizePixels = 24;

  let aircraftMesh: Mesh | undefined;
  let aircraftOutlineMesh: Mesh | undefined;

  const position = createPositionVelocityTransition(
    () => state()?.position ?? [0, 0, 0],
  );
  const _orientation = createOrientationTransition(
    () => state()?.orientation ?? [0, 0, 0],
  );
  const orientation = () => {
    const [pitch = 0, yaw = 0, roll = 0] = _orientation();
    return quat.fromEuler(
      quat.create(),
      -degrees(pitch) + 90,
      degrees(roll),
      degrees(yaw) - 90,
    );
  };
  const color = () => [0.5, 0.5, 0.5, 1] satisfies vec4;

  const aircraft = createObjectLayer(context, {
    mesh: () => aircraftMesh,
    position,
    orientation,
    size: () => size,
    minSizePixels: () => minSizePixels,
    color,
    diffuse: color,
    polygonOffset: () => -1000,
    onClick,
  });
  const aircraftOutline = createObjectLayer(context, {
    mesh: () => aircraftOutlineMesh,
    position,
    orientation,
    size: () => size,
    minSizePixels: () => minSizePixels,
    color: () => [0, 0, 0, 1],
    pickable: () => false,
  });

  const load = async () => {
    aircraftMesh = await loadObj(aircraftObj);
    aircraftOutlineMesh = await loadObj(aircraftOutlineObj);
  };

  void load();

  return createContainer([aircraft, aircraftOutline]);
};
