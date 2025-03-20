import { planerSliceActions } from "../../redux/planerSlice";
import Pin from "../../map/Pin";
import { mapSliceActions } from "../../redux/mapSlice";
import {
  FillLayer,
  Layer,
  LineLayer,
  Map,
  MapRef,
  Marker,
  Source,
} from "react-map-gl/maplibre";
import {
  boundsPaddingWithSidePanel,
  initialMapState,
  mapBounds,
  mapTilesConfig,
} from "../../config/map";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Popup } from "maplibre-gl";
import {
  GeoJsonFeature,
  GeoJsonFeatureCollection,
  GeoJsonLineString,
  ParsedTrip,
} from "../../types/api/trips";
import { useEffect, useMemo, useRef } from "react";
import circle from "@turf/circle";
import { getBoundsFromRoute } from "../../utils/mapFunctions";

const PlanerMap = () => {
  const mapState = useAppSelector((state) => state.mapState);
  const planerState = useAppSelector((state) => state.planerState);
  const dispatch = useAppDispatch();

  const mapRef = useRef<MapRef>(null);

  const foundRouteLayer: LineLayer = {
    id: "found-route-layer",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#ff0000",
      "line-width": 4,
    },
  };

  const tripsLayer: LineLayer = {
    id: "trips-layer",
    type: "line",
    source: "trips",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": ["get", "color"],
      "line-width": 4,
    },
  };

  const circleFillLayer: FillLayer = {
    id: "circle-fill-layer",
    type: "fill",
    source: "circle",
    paint: {
      "fill-color": "#0065aa",
      "fill-opacity": 0.3,
    },
  };

  const circleOutlineLayer: LineLayer = {
    id: "circle-outline-layer",
    type: "line",
    source: "circle",
    paint: {
      "line-color": "#0065aa",
      "line-width": 3,
    },
  };

  const focusedTripLayer: LineLayer = {
    id: "focused-trip-layer",
    type: "line",
    source: "focused-trip",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": ["get", "color"],
      "line-width": 7,
    },
  };

  const tripsSource: GeoJsonFeatureCollection | null = useMemo(() => {
    if (planerState.search.trips.length === 0) return null;
    return {
      type: "FeatureCollection",
      features: planerState.search.trips.map((trip) => {
        return {
          type: "Feature",
          properties: {
            color: trip.color.includes("#") ? trip.color : `#${trip.color}`,
            id: trip.id,
          },
          geometry: trip.route,
        };
      }),
    };
  }, [planerState.search.trips]);

  const circleSource = useMemo(() => {
    if (!planerState.search.point) return null;
    return circle(planerState.search.point, planerState.search.radius, {
      units: "meters",
    });
  }, [planerState.search.radius, planerState.search.point]);

  const focusedTrip: ParsedTrip | undefined = useMemo(() => {
    return planerState.search.trips.find((trip) => {
      return trip.id === planerState.search.focusedTripId;
    });
  }, [planerState.search.focusedTripId, planerState.search.trips]);

  const focusedTripSource: GeoJsonFeature | undefined = useMemo(() => {
    if (!focusedTrip) return undefined;
    return {
      type: "Feature",
      properties: {
        color: focusedTrip.color.includes("#")
          ? focusedTrip.color
          : `#${focusedTrip.color}`,
      },
      geometry: focusedTrip.route,
    };
  }, [focusedTrip]);

  useEffect(() => {
    if (!focusedTrip || !mapRef.current) return;
    mapRef.current.fitBounds(
      getBoundsFromRoute(focusedTrip.route.coordinates),
      {
        padding: boundsPaddingWithSidePanel,
      }
    );
  }, [focusedTrip]);

  return (
    <Map
      id="planer-map"
      mapStyle={mapTilesConfig}
      scrollZoom
      ref={mapRef}
      interactiveLayerIds={
        mapState.state !== "pointer" ? ["found-route-layer", "trips-layer"] : []
      }
      onClick={(event) => {
        if (mapState.state === "pointer") {
          dispatch(
            planerSliceActions.setPointFromMapClick([
              event.lngLat.lng,
              event.lngLat.lat,
            ])
          );
          dispatch(mapSliceActions.changeMapState("idle"));
          return;
        }
        if (event.features?.[0]?.layer.id === "trips-layer") {
          const tripId = event.features[0].properties.id;
          dispatch(planerSliceActions.setFocusedTripId(tripId));
        }
      }}
      initialViewState={initialMapState}
      maxBounds={mapBounds}
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
        focusedTrip.points.map((point, index) => {
          return (
            <Marker
              key={index}
              latitude={point.coordinates.coordinates[1]}
              longitude={point.coordinates.coordinates[0]}
            >
              <Pin width={26} text={String.fromCharCode(65 + index)} />
            </Marker>
          );
        })}
      {focusedTripSource && (
        <Source id="focused-trip" type="geojson" data={focusedTripSource}>
          <Layer {...focusedTripLayer}></Layer>
        </Source>
      )}
      {tripsSource && (
        <Source id="trips" type="geojson" data={tripsSource}>
          <Layer {...tripsLayer}></Layer>
        </Source>
      )}
      {circleSource && (
        <Source id="circle" type="geojson" data={circleSource}>
          <Layer {...circleFillLayer}></Layer>
          <Layer {...circleOutlineLayer}></Layer>
        </Source>
      )}
      {planerState.planer.foundRoute && (
        <Source
          id="route"
          type="geojson"
          data={{
            type: "Feature",
            properties: {},
            geometry: planerState.planer.foundRoute.points,
          }}
        >
          <Layer {...foundRouteLayer}></Layer>
        </Source>
      )}
      {planerState.planer.points.map((point, index) => {
        if (!point.coordinates) return null;
        const popup = new Popup({
          closeOnClick: true,
          anchor: "bottom",
          offset: 26 * 1.4,
          closeButton: false,
          className: "point-popup",
        }).setMaxWidth("240px").setHTML(`<div clas='map-popup'>
                    ${
                      point.osmPointId
                        ? `<div class='header'>
                        ${point.coordinates[1].toFixed(
                          5
                        )}&deg;N, ${point.coordinates[0].toFixed(5)}&deg;E
                    </div>`
                        : ""
                    }
                   <div class='description'>
                   <p>${
                     point.osmPointId
                       ? point.name
                       : `${point.coordinates[1].toFixed(
                           5
                         )}&deg;N, ${point.coordinates[0].toFixed(5)}&deg;E`
                   }</p>
                    </div>
                </div>`);

        return (
          <Marker
            key={index}
            longitude={point.coordinates[0]}
            latitude={point.coordinates[1]}
            popup={popup}
          >
            <Pin width={26} text={String.fromCharCode(65 + point.order)} />
          </Marker>
        );
      })}
    </Map>
  );
};

export default PlanerMap;
