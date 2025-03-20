import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngAlt } from "../types/api/trips";
import { MapStates } from "../types/map";

type MapSliceState = {
  state: MapStates;
};

const initialState: MapSliceState = {
  state: "idle",
};

const mapSlice = createSlice({
  name: "Map slice",
  initialState,
  reducers: {
    changeMapState: (state, action: PayloadAction<MapStates>) => {
      state.state = action.payload;
    },
  },
});

export type { MapSliceState };
export const mapSliceActions = mapSlice.actions;
export default mapSlice.reducer;
