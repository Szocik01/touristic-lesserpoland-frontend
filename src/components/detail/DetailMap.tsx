import { useEffect, useMemo, useRef } from "react";
import { mapTilesConfig } from "../../config/map";
import Pin from "../../map/Pin";
import {
  GeoJsonLineString,
  GeoJsonPoint,
  LatLng,
  ParsedTripPoints,
} from "../../types/api/trips";
import {
  Layer,
  LineLayer,
  Map,
  Marker,
  Source,
  MapRef,
  CircleLayer,
} from "react-map-gl/maplibre";
import { getBoundsFromRoute } from "../../utils/mapFunctions";

type DetailMapProps = {
  route: GeoJsonLineString;
  color: string;
  points: ParsedTripPoints;
  elevationMarkerCoordinates: LatLng | null;
};

const DetailMap = (props: DetailMapProps) => {
  const { route, color, points, elevationMarkerCoordinates } = props;

  const mapRef = useRef<MapRef | null>(null);

  const routeLayer: LineLayer = {
    id: "route-layer",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": `${color.includes("#") ? "" : "#"}${color}`,
      "line-width": 6,
    },
  };

  const circleLayer: CircleLayer = {
    id: "elevantion-marker",
    type: "circle",
    source: "elevation-marker",
    paint: {
      "circle-radius": 8,
      "circle-color": `${color.includes("#") ? "" : "#"}${color}`,
      "circle-stroke-width": 4,
      "circle-stroke-color": "#ffffff",
    },
  };

  const circleSource: GeoJsonPoint | null = elevationMarkerCoordinates && {
    type: "Point",
    coordinates: elevationMarkerCoordinates,
  };

  return (
    <div className="map">
      <Map
        onLoad={(map) => {
          if (!route) return;
          const bounds = getBoundsFromRoute(route.coordinates);

          map.target.fitBounds(bounds, {
            padding: 70,
            duration: 1200,
          });
        }}
        ref={mapRef}
        id="detail-map"
        scrollZoom
        initialViewState={{
          zoom: 11,
          longitude: 19.937135,
          latitude: 50.058445,
        }}
        mapStyle={mapTilesConfig}
        maxBounds={[
          [18.764047, 49.100377],
          [21.415273, 50.516964],
        ]}
      >
        <Source id="route" type="geojson" data={route}>
          <Layer {...routeLayer} />
          {points.map((point, index) => {
            return (
              <Marker
                key={index}
                longitude={point.coordinates.coordinates[0]}
                latitude={point.coordinates.coordinates[1]}
              >
                <Pin width={26} text={String.fromCharCode(65 + index)} />
              </Marker>
            );
          })}
        </Source>
        {circleSource && (
          <Source id="elevation-marker" type="geojson" data={circleSource}>
            <Layer {...circleLayer} />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default DetailMap;
