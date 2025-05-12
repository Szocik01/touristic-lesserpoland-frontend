import { useCallback, useState } from "react";
import CategoriesList from "../shared/CategoriesList";
import {
  FindRouteBody,
  GeoJsonFeature,
  GeoJsonLineString,
  GeoJsonPoint,
  GraphHopperApiSuccessResponse,
  LatLngAlt,
  PlaceHintParsed,
  Point,
  TripTypes,
} from "../../types/api/trips";
import {
  Button,
  Divider,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@mui/material";
import PointsList from "./PointsList";
import { HelpOutline, Route, UploadFile } from "@mui/icons-material";
import useHttp from "../../hooks/useHttp";
import { API_CALL_URL_BASE } from "../../utils/constants";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { RouteFormatConverter } from "../../utils/routeFormatConverter";
import { planerSliceActions } from "../../redux/planerSlice";

type FindRouteProps = {
  onHintSelected: (hint: PlaceHintParsed) => void;
  category: TripTypes;
  onCategoryChange: (category: TripTypes) => void;
  onRouteFound: (route: GraphHopperApiSuccessResponse) => void;
  onRouteFileUploaded: (
    route: GeoJsonFeature,
    points: GeoJsonFeature[]
  ) => void;
};

const FindRoute = (props: FindRouteProps) => {
  const {
    category,
    onCategoryChange,
    onRouteFound,
    onHintSelected,
    onRouteFileUploaded,
  } = props;

  const [sendFindRouteRequest, isLoading] = useHttp(
    `${API_CALL_URL_BASE}/find-route`
  );

  const planerState = useAppSelector((state) => state.planerState);

  const dispatch = useAppDispatch();

  const handleFindRouteResponse = useCallback((response: Response) => {
    return response.json().then((data: GraphHopperApiSuccessResponse) => {
      onRouteFound(data);
    });
  }, []);

  const handleFindRouteError = useCallback((error: Error) => {
    console.log(error);
  }, []);

  const disableRequest = planerState.planer.points.reduce<boolean>(
    (previousValue, currentValue) => {
      return previousValue || !currentValue.coordinates;
    },
    false
  );

  return (
    <>
      <h3>WYSZUKAJ TRASĘ</h3>
      <CategoriesList
        onCategoryChange={(category) => {
          onCategoryChange(category);
        }}
        activeCategory={category}
      />
      <div className="round-trip-container">
        <FormControlLabel
          control={
            <Switch
              sx={{
                ".Mui-checked": {
                  ".MuiSwitch-thumb": { color: "#00883b" },
                },
                ".MuiSwitch-track": {
                  backgroundColor: "#00883b !important",
                },
              }}
              checked={planerState.planer.roundTrip}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                dispatch(planerSliceActions.setRoundTrip(event.target.checked));
              }}
            />
          }
          label="Pętla"
        />
        <Tooltip
          title="Zaznaczenie spowoduje, że pierwszy i ostatni punkt trasy będą takie same."
          placement="bottom"
        >
          <HelpOutline sx={{color:"gray"}}/>
        </Tooltip>
      </div>

      <PointsList onHintSelected={onHintSelected} />
      <Button
        fullWidth
        variant="contained"
        startIcon={<Route />}
        disabled={disableRequest}
        onClick={() => {
          if (disableRequest) return;
          const findRouteBody: FindRouteBody = {
            points: planerState.planer.points.map((point: Point) =>
              point.coordinates ? point.coordinates : [0, 0]
            ),
            profile: category,
            elevation: true,
          };
          sendFindRouteRequest(handleFindRouteResponse, handleFindRouteError, {
            method: "POST",
            body: JSON.stringify(findRouteBody),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }}
      >
        Wyznacz trasę
      </Button>
      <Divider>lub</Divider>
      <div className="upload-file-container">
        <Button
          type="button"
          variant="contained"
          fullWidth
          startIcon={<UploadFile />}
        >
          Dodaj plik GPX
        </Button>
        <label className="gpx-file-label">
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file || !file.name.endsWith(".gpx")) return;
              const reader = new FileReader();
              reader.onload = (event) => {
                const gpxFileContent = event.target?.result
                  ? (event.target.result as string)
                  : null;
                if (!gpxFileContent) return;
                const uploadedFeatureCollection =
                  RouteFormatConverter.gpxToGeoJson(gpxFileContent);
                const points = uploadedFeatureCollection.features.filter(
                  (feature) => {
                    return feature.geometry.type === "Point";
                  }
                );
                const route = uploadedFeatureCollection.features.find(
                  (feature) => {
                    return feature.geometry.type === "LineString";
                  }
                );
                if (!route) return;
                if (points.length === 0) {
                  const firstPoint = route.geometry.coordinates[0];
                  const lastPoint =
                    route.geometry.coordinates[
                      route.geometry.coordinates.length - 1
                    ];
                  points.push({
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: firstPoint as LatLngAlt,
                    },
                    properties: {},
                  });
                  points.push({
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: lastPoint as LatLngAlt,
                    },
                    properties: {},
                  });
                }
                onRouteFileUploaded(route, points);
              };
              reader.readAsText(file);
            }}
          />
        </label>
      </div>
    </>
  );
};

export default FindRoute;
