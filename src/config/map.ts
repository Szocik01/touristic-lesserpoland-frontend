import { LngLatBoundsLike, PaddingOptions, StyleSpecification } from "maplibre-gl";

export const mapTilesConfig: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
      maxzoom: 20,
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

export const initialMapState={
  zoom: 11,
  longitude: 19.937135,
  latitude: 50.058445,
}

export const mapBounds: LngLatBoundsLike = [
  [18.264047, 48.700377],
  [21.815273, 50.916964],
];

export const boundsPadding = 50;
export const boundsPaddingWithSidePanel: PaddingOptions = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 270,
};
