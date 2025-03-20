import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "./authSlice";
import mapSlice from "./mapSlice";
import planerSlice from "./planerSlice";

export const store = configureStore({
  reducer: {
    authState: authSlice,
    mapState: mapSlice,
    planerState: planerSlice,
  },
});

type AppState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
