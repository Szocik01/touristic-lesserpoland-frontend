import { useCallback, useState } from "react";
import CategoriesList from "../shared/CategoriesList";
import {
  FindRouteBody,
  GraphHopperApiSuccessResponse,
  PlaceHintParsed,
  Point,
  TripTypes,
} from "../../types/api/trips";
import { Button, Divider } from "@mui/material";
import PointsList from "./PointsList";
import { Route } from "@mui/icons-material";
import useHttp from "../../hooks/useHttp";
import { API_CALL_URL_BASE } from "../../utils/constants";
import { useAppSelector } from "../../redux/store";

type FindRouteProps = {
  onHintSelected: (hint: PlaceHintParsed) => void;
  category: TripTypes;
  onCategoryChange: (category: TripTypes) => void;
  onRouteFound: (route: GraphHopperApiSuccessResponse) => void;
};

const FindRoute = (props: FindRouteProps) => {
  const { category, onCategoryChange, onRouteFound, onHintSelected } = props;

  const [sendFindRouteRequest, isLoading] = useHttp(
    `${API_CALL_URL_BASE}/find-route`
  );

  const planerState = useAppSelector((state) => state.planerState);

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
    </>
  );
};

export default FindRoute;
