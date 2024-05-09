import type { Properties, View } from "world.ts";
import {
  createContext,
  createMouseControl,
  createTerrainLayer,
  createViewTransition,
  createWorld as createBaseWorld,
  defaultView,
} from "world.ts";

import { mapboxToken } from "./configuration";
import type { Position, State } from "./model";
import { createAircraftLayer } from "./world/aircraft";
import { createFollowView } from "./world/view";

export type WorldProperties = {
  state: State;
  onTarget: (_: Position) => void;
};

export type World = {
  dispose: () => void;
};

export const createWorld = (
  canvas: HTMLCanvasElement,
  properties: Properties<WorldProperties>,
) => {
  const { state, onTarget } = properties;

  let following = true;

  const onFollow = () => {
    following = true;
  };

  const context = createContext(canvas);

  let _view: View = {
    ...defaultView,
    distance: 10000,
    orientation: [0, 0, 0],
    target: [0, 0, 0],
  };

  const followView = createFollowView({
    enabled: () => following,
    position: () => state().position,
    distance: () => _view.distance,
  });

  const onChangeView = (_: Partial<View>) => {
    _view = { ..._view, ..._ };
    resetView();
  };

  let viewTransition = () => defaultView;

  const resetView = () => {
    viewTransition = createViewTransition(() => {
      _view = { ..._view, ...followView() };
      return _view;
    });
  };

  resetView();

  const view = () => viewTransition();

  const world = createBaseWorld(context, {
    view,
    layers: () => layers,
  });

  const control = createMouseControl(canvas, world, {
    view,
    draggable: () => !following,
    onChangeView,
  });

  const terrain = createTerrainLayer(context, {
    terrainUrl: () =>
      `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=${mapboxToken}`,
    imageryUrl: () =>
      "https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
    onRightClick: ({ position: [lng = 0, lat = 0, alt = 0] }) =>
      onTarget([lng, lat, alt]),
  });

  const aircraft = createAircraftLayer(context, { state, onClick: onFollow });

  const layers = [terrain, aircraft];

  const onMouseDown = () => {
    following = false;
  };

  canvas.addEventListener("mousedown", onMouseDown);

  const dispose = () => {
    window.removeEventListener("mousedown", onMouseDown);
    layers.forEach(_ => _.dispose());
    control.dispose();
    world.dispose();
  };

  return {
    dispose,
  } satisfies World;
};
