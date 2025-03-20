import Map, {
  MapRef,
  Source,
  Layer,
  LineLayer,
  FillLayer,
  Marker,
} from "react-map-gl/dist/esm/exports-maplibre";
import { mapTilesConfig } from "../../config/map";
import {
  GeoJsonFeature,
  GeoJsonFeatureCollection,
  GeoJsonLineString,
  GeoJsonPoint,
  GeoJsonPolygon,
  LatLngAlt,
  ParsedFindRouteHint,
  ParsedTrip,
} from "../../types/api/trips";
import { useEffect, useMemo, useRef } from "react";
import { LngLatBounds } from "maplibre-gl";
import circle from "@turf/circle";
import {
  getBoundsFromRoute,
  getBoundsFromRoutesOrPolygon,
} from "../../utils/mapFunctions";
import Pin from "../../map/Pin";

type SearchMapProps = {
  selectedHint: ParsedFindRouteHint | null;
  radius?: number;
  trips: ParsedTrip[];
  focusedTripId?: string | number;
  onTripBlur: () => void;
  onTripClick: (tripId: string | number | undefined) => void;
};

function getTripsBoundBox(trips: ParsedTrip[]): LngLatBounds {
  const initialCoordinates = trips[0].route.coordinates[0];
  const bounds = new LngLatBounds(
    [initialCoordinates[0], initialCoordinates[1]],
    [initialCoordinates[0], initialCoordinates[1]]
  );
  trips.forEach((trip) => {
    trip.route.coordinates.forEach((coordinate) => {
      bounds.extend([coordinate[0], coordinate[1]]);
    });
  });
  return bounds;
}

const SearchMap = (props: SearchMapProps) => {
  const {
    selectedHint,
    radius,
    trips,
    onTripBlur,
    onTripClick,
    focusedTripId,
  } = props;

  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (trips.length == 0) return;
    const bounds = getTripsBoundBox(trips);
    mapRef.current?.fitBounds(bounds, {
      speed: 1,
    });
  }, [trips]);

  const tripsSource: GeoJsonFeatureCollection = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: trips.map((trip) => {
        return {
          type: "Feature",
          id: trip.id,
          properties: {
            id: trip.id,
            color: `${trip.color.includes("#") ? "" : "#"}${trip.color}`,
          },
          geometry: trip.route,
        };
      }),
    };
  }, [trips]);

  const focusedTrip: ParsedTrip | null = useMemo(() => {
    return trips.find((trip) => trip.id === focusedTripId) || null;
  }, [focusedTripId, trips]);

  const focusedTripSource: GeoJsonFeature | null = useMemo(() => {
    if (!focusedTrip) return null;
    return {
      type: "Feature",
      id: focusedTrip.id,
      properties: {
        id: focusedTrip.id,
        color: `${focusedTrip.color.includes("#") ? "" : "#"}${
          focusedTrip.color
        }`,
      },
      geometry: focusedTrip.route,
    };
  }, [focusedTrip]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!focusedTripSource) return;
    const bounds = getBoundsFromRoute(
      (focusedTripSource.geometry as GeoJsonLineString).coordinates
    );
    mapRef.current.fitBounds(bounds, {
      speed: 0.8,
      padding: 50,
    });
  }, [focusedTripSource]);

  const tripsLayer: LineLayer = {
    id: "trips-layer",
    type: "line",
    source: "routes",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": ["get", "color"],
      "line-width": 4,
    },
  };

  const hintLayer: FillLayer = {
    id: "hint-layer",
    type: "fill",
    source: "hint",
    paint: {
      "fill-color": "#0065aa",
      "fill-opacity": 0.15,
    },
  };

  const hintBorderLayer: LineLayer = {
    id: "hint-border-layer",
    type: "line",
    source: "hint",
    paint: {
      "line-color": "#0065aa",
      "line-width": 3,
      "line-opacity": 0.3,
    },
  };

  const focusedTripLayer: LineLayer = {
    id: "focused-trip-layer",
    type: "line",
    source: "focused-trip",
    paint: {
      "line-color": ["get", "color"],
      "line-width": 7,
    },
  };

  const hintPolygonSource = useMemo(() => {
    if (!selectedHint || !mapRef.current) return null;
    if (selectedHint.type === "place" && radius) {
      const way = selectedHint.way as GeoJsonPoint;
      const circleSource = circle(
        [way.coordinates[0], way.coordinates[1]],
        radius,
        {
          units: "meters",
        }
      );
      const bounds = getBoundsFromRoutesOrPolygon(
        circleSource.geometry.coordinates as LatLngAlt[][]
      );
      mapRef.current.fitBounds(bounds, {
        speed: 0.8,
        padding: 50,
      });
      return circleSource;
    } else if (selectedHint.type === "polygon") {
      const polygonSource = selectedHint.way as GeoJsonPolygon;
      const bounds = getBoundsFromRoutesOrPolygon(polygonSource.coordinates);
      mapRef.current.fitBounds(bounds, {
        speed: 0.8,
        padding: 50,
      });
      return polygonSource;
    }
  }, [selectedHint, radius]);

  return (
    <div className="search-map col-12 offset-md-1 col-md-10">
      <Map
        ref={mapRef}
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
        interactiveLayerIds={["trips-layer"]}
        onClick={(event) => {
          if (!mapRef.current) return;
          const focusedLineData = event.features?.[0];
          if (!focusedLineData) {
            onTripBlur();
            return;
          }
          const tripId = focusedLineData.id;
          onTripClick(tripId);
        }}
        onMouseEnter={(event) => {
          if (!mapRef.current) return;
          const focusedLine = event.features?.[0];
          if (!focusedLine) return;
          if (
            focusedLine.layer.id === "trips-layer" ||
            focusedLine.layer.id === "focused-trip-layer"
          ) {
            mapRef.current.getCanvas().style.cursor = "pointer";
          }
        }}
        onMouseLeave={() => {
          if (!mapRef.current) return;
          mapRef.current.getCanvas().style.cursor = "";
        }}
      >
        {focusedTrip &&
          focusedTrip.points.map((point) => {
            return (
              <Marker
                key={point.id}
                longitude={point.coordinates.coordinates[0]}
                latitude={point.coordinates.coordinates[1]}
              >
                <Pin width={26} text={String.fromCharCode(65 + point.order)} />
              </Marker>
            );
          })}
        {focusedTripSource && (
          <Source id="focused-trip" type="geojson" data={focusedTripSource}>
            <Layer {...focusedTripLayer} />
          </Source>
        )}
        <Source id="routes" data={tripsSource} type="geojson">
          <Layer {...tripsLayer} />
        </Source>
        {selectedHint && (
          <Source id="hint" type="geojson" data={hintPolygonSource}>
            <Layer {...hintLayer} />
            <Layer {...hintBorderLayer} />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default SearchMap;
