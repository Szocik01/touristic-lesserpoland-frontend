import { LatLngAlt } from "../types/api/trips";
import maplibregl, { LngLatBounds } from "maplibre-gl";

export function getBoundsFromRoute(route: LatLngAlt[]): LngLatBounds {
  const firstCoordinate = route[0];
  return route.reduce((bounds, coord) => {
    return bounds.extend([coord[0], coord[1]]);
  }, new maplibregl.LngLatBounds([firstCoordinate[0], firstCoordinate[1]], [firstCoordinate[0], firstCoordinate[1]]));
}

export function getBoundsFromRoutesOrPolygon(routes: LatLngAlt[][]): LngLatBounds {
  return routes.reduce((bounds, route) => {
    return getBoundsFromRoute(route).extend(bounds);
  }, new maplibregl.LngLatBounds());
}