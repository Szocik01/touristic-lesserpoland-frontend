import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import {
  GeoJsonFeature,
  GeoJsonLineString,
  GraphHopperApiSuccessResponse,
  LatLng,
  LatLngAlt,
  ParsedTrip,
  PlaceHintParsed,
  Point,
  Route,
} from "../types/api/trips";

type PlanerSliceState = {
  planer: {
    points: (Point & { name: string })[];
    routeName?: string;
    foundRoute?: Route;
    focusedPointIndex?: number;
    roundTrip: boolean;
  };
  search: {
    trips: ParsedTrip[];
    focusedTripId?: string;
    point?: LatLng;
    radius: number;
  };
};

const initialState: PlanerSliceState = {
  planer: {
    points: [
      { coordinates: undefined, osmPointId: undefined, order: 0, name: "" },
      { coordinates: undefined, osmPointId: undefined, order: 1, name: "" },
    ],
    roundTrip: false,
  },
  search: {
    trips: [],
    radius: 5000,
  },
};

const planerSlice = createSlice({
  name: "Planer slice",
  initialState,
  reducers: {
    setPointValueFromPlaceHint: (
      state,
      action: PayloadAction<{ index: number; value: PlaceHintParsed }>
    ) => {
      state.planer.points[action.payload.index].coordinates = [
        action.payload.value.point.coordinates[0],
        action.payload.value.point.coordinates[1],
      ];
      state.planer.points[action.payload.index].osmPointId =
        action.payload.value.id;

      state.planer.points[action.payload.index].name =
        action.payload.value.name;
      if (state.planer.roundTrip && action.payload.index === 0) {
        planerSlice.caseReducers.setPointValueFromPlaceHint(state, {
          ...action,
          payload: { ...action.payload, index: state.planer.points.length - 1 },
        });
      }
    },
    setPointFromString: (
      state,
      action: PayloadAction<{ index: number; value: string; name?: string }>
    ) => {
      state.planer.points[action.payload.index].name = action.payload.name
        ? action.payload.name
        : action.payload.value;
      const regex = /^([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)$/;
      const match = action.payload.value.match(regex);
      if (match) {
        state.planer.points[action.payload.index].coordinates = [
          parseFloat(match[2]),
          parseFloat(match[1]),
        ];
      } else {
        state.planer.points[action.payload.index].coordinates = undefined;
      }
      if (state.planer.roundTrip && action.payload.index === 0) {
        planerSlice.caseReducers.setPointFromString(state, {
          ...action,
          payload: {
            ...action.payload,
            index: state.planer.points.length - 1,
          },
        });
      }
    },
    clearPoint: (state, action: PayloadAction<{ index: number }>) => {
      state.planer.points[action.payload.index] = {
        coordinates: undefined,
        osmPointId: undefined,
        order: action.payload.index,
        name: "",
      };
      if (state.planer.roundTrip && action.payload.index === 0) {
        planerSlice.caseReducers.clearPoint(state, {
          ...action,
          payload: { index: state.planer.points.length - 1 },
        });
      }
    },
    addEmptyPoint: (state) => {
      if (state.planer.roundTrip) {
        state.planer.points.splice(state.planer.points.length - 1, 0, {
          coordinates: undefined,
          osmPointId: undefined,
          order: state.planer.points.length - 1,
          name: "",
        });
        state.planer.points[state.planer.points.length - 1].order =
          state.planer.points.length - 1;
        return;
      } else {
        state.planer.points.push({
          coordinates: undefined,
          osmPointId: undefined,
          order: state.planer.points.length,
          name: "",
        });
      }
    },
    changePointsOrder: (
      state,
      action: PayloadAction<{ sourceIndex: number; destinationIndex?: number }>
    ) => {
      if (
        action.payload.destinationIndex === undefined ||
        action.payload.sourceIndex === action.payload.destinationIndex
      )
        return;
      const sourcePoint = state.planer.points[action.payload.sourceIndex];
      state.planer.points.splice(action.payload.sourceIndex, 1);
      state.planer.points.splice(
        action.payload.destinationIndex,
        0,
        sourcePoint
      );
      if (
        state.planer.roundTrip &&
        (action.payload.destinationIndex === 0 ||
          action.payload.sourceIndex === 0 ||
          action.payload.destinationIndex === state.planer.points.length - 1 ||
          action.payload.sourceIndex === state.planer.points.length - 1)
      ) {
        state.planer.roundTrip = false;
      }
      state.planer.points.forEach((point, index) => (point.order = index));
    },
    removePoint: (state, action: PayloadAction<{ index: number }>) => {
      state.planer.points.splice(action.payload.index, 1);
      state.planer.points.forEach((point, index) => (point.order = index));
      if (
        state.planer.roundTrip &&
        (action.payload.index === 0 ||
          action.payload.index === state.planer.points.length)
      ) {
        state.planer.roundTrip = false;
      }
    },
    setFoundRoute: (
      state,
      action: PayloadAction<GraphHopperApiSuccessResponse>
    ) => {
      state.planer.foundRoute = action.payload;
    },
    setPointFromMapClick: (state, action: PayloadAction<LatLngAlt>) => {
      if (state.planer.focusedPointIndex === undefined) return;
      const coordinates = action.payload.map((coord) => {
        if (!coord) return undefined;
        return parseFloat(coord.toFixed(6));
      }) as LatLngAlt;
      state.planer.points[state.planer.focusedPointIndex].coordinates =
        coordinates;
      state.planer.points[
        state.planer.focusedPointIndex
      ].name = `${coordinates[1]},${coordinates[0]}`;
      if (state.planer.roundTrip && state.planer.focusedPointIndex === 0) {
        state.planer.points[state.planer.points.length - 1].coordinates =
          coordinates;
        state.planer.points[
          state.planer.points.length - 1
        ].name = `${coordinates[1]},${coordinates[0]}`;
      }
    },
    setPointsAndRouteFromGeoJson: (
      state,
      action: PayloadAction<{ points: GeoJsonFeature[]; route: GeoJsonFeature }>
    ) => {
      state.planer.points = action.payload.points.map((point, index) => {
        return {
          coordinates: point.geometry.coordinates as LatLngAlt,
          name:
            point.properties.name ||
            `${(point.geometry.coordinates as LatLngAlt)[1].toFixed(6)},${(
              point.geometry.coordinates as LatLngAlt
            )[0].toFixed(6)}`,
          order: index,
        };
      });
      state.planer.foundRoute = {
        points: action.payload.route.geometry as GeoJsonLineString,
      };
    },
    setFocusedPointIndex: (state, action: PayloadAction<number>) => {
      state.planer.focusedPointIndex = action.payload;
    },
    setRouteName: (state, action: PayloadAction<string>) => {
      state.planer.routeName = action.payload;
    },
    cleanPlanerData: (state) => {
      state.planer.points = initialState.planer.points;
      state.planer.routeName = undefined;
      state.planer.foundRoute = undefined;
      state.planer.focusedPointIndex = undefined;
      state.planer.roundTrip = initialState.planer.roundTrip;
    },
    setTrips: (state, action: PayloadAction<ParsedTrip[]>) => {
      state.search.trips = action.payload;
    },
    clearTrips: (state) => {
      state.search.trips = [];
    },
    setMapCenterPoint: (state, action: PayloadAction<LatLng>) => {
      state.search.point = action.payload;
    },
    clearMapCenterPoint: (state) => {
      state.search.point = undefined;
    },
    setRadius: (state, action: PayloadAction<number>) => {
      state.search.radius = action.payload;
    },
    setFocusedTripId: (state, action: PayloadAction<string>) => {
      state.search.focusedTripId = action.payload;
    },
    clearFocusedTripId: (state) => {
      state.search.focusedTripId = undefined;
    },
    setRoundTrip: (state, action: PayloadAction<boolean>) => {
      state.planer.roundTrip = action.payload;
      const firstPointCopy = structuredClone(current(state.planer.points[0]));
      firstPointCopy.order = state.planer.points.length - 1;
      state.planer.points[state.planer.points.length - 1] = firstPointCopy;
    },
  },
});

export type { PlanerSliceState };
export const planerSliceActions = planerSlice.actions;
export default planerSlice.reducer;
