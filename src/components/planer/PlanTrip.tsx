import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import FindRoute from "./FindRoute";
import RouteDetails from "./RouteDetails";
import { GeoJsonFeature, GeoJsonPoint, LatLng, TripTypes } from "../../types/api/trips";
import { planerSliceActions } from "../../redux/planerSlice";
import { MapRef } from "react-map-gl/dist/esm/exports-maplibre";
import AddTripDialog from "./AddTripDialog";
import { authSliceActions } from "../../redux/authSlice";
import { mapSliceActions } from "../../redux/mapSlice";

type PlanTripProps = {
  map?: MapRef;
};

const planerMapPadding = { top: 100, bottom: 20, left: 400 };

const PlanTrip = (props: PlanTripProps) => {
  const [category, setCategory] = useState<TripTypes>("foot");
  const [activePage, setActivePage] = useState<"find" | "details">("find");
  const [addTripDialogOpen, setAddTripDialogOpen] = useState(false);

  const { map } = props;

  const planerState = useAppSelector((state) => state.planerState);
  const authState = useAppSelector((state) => state.authState);

  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(planerSliceActions.cleanPlanerData());
      dispatch(mapSliceActions.changeMapState("idle"));
    };
  }, []);

  if (planerState.planer.foundRoute !== undefined && activePage === "details") {
    return (
      <>
        <RouteDetails
          category={category}
          route={planerState.planer.foundRoute}
          points={planerState.planer.points}
          onReturn={() => {
            setActivePage("find");
            dispatch(planerSliceActions.setRouteName(""));
          }}
          onPointClick={(index) => {
            const point = planerState.planer.points[index];
            if (!point.coordinates) return;
            map?.flyTo({
              center: [point.coordinates[0], point.coordinates[1]],
              zoom: 15,
              padding: planerMapPadding,
            });
          }}
          routeName={planerState.planer.routeName}
          onSaveRoute={() => {
            if (authState.token) {
              setAddTripDialogOpen(true);
            } else {
              dispatch(authSliceActions.openLoginDialog());
            }
          }}
        />
        <AddTripDialog
          open={addTripDialogOpen}
          onClose={() => {
            setAddTripDialogOpen(false);
          }}
          route={planerState.planer.foundRoute}
          category={category}
          points={planerState.planer.points}
          token={authState.token}
        />
      </>
    );
  }

  return (
    <FindRoute
      category={category}
      onCategoryChange={(category) => {
        setCategory(category);
      } }
      onRouteFound={(route) => {
        setActivePage("details");
        dispatch(planerSliceActions.setFoundRoute(route));
      } }
      onHintSelected={(hint) => {
        map?.flyTo({
          padding: planerMapPadding,
          center: hint.point.coordinates.slice(0, 2) as LatLng,
          zoom: 15,
        });
      } } 
      onRouteFileUploaded={ (route: GeoJsonFeature, points: GeoJsonFeature[]) => {
        setActivePage("details");
        dispatch(planerSliceActions.setPointsAndRouteFromGeoJson({route, points}));
      } }    />
  );
};

export default PlanTrip;
