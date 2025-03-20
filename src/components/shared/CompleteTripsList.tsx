import { useCallback, useEffect, useState } from "react";
import Filters from "../search/Filters";
import {
  FindRouteHintDTO,
  ParsedFindRouteHint,
  ParsedTrip,
  SearchTripDTO,
  ToggleFavouriteTripResponse,
} from "../../types/api/trips";
import useHttp from "../../hooks/useHttp";
import { API_CALL_URL_BASE } from "../../utils/constants";
import { useSearchParams } from "react-router-dom";
import TripsList from "./TripsList";
import { Pagination } from "@mui/material";
import { useAppSelector } from "../../redux/store";

type CompleteTripsListProps = {
  getTripsRequestUrl: string;
  getTripsRequestInit?: RequestInit;
  allowOwnerActions?: boolean;
  onDeleteButtonClick?: (tripId: string) => void;
  onEditModeButtonClick?: (tripId: string) => void;
};

const CompleteTripsList = (props: CompleteTripsListProps) => {
  const {
    getTripsRequestUrl,
    getTripsRequestInit,
    onDeleteButtonClick,
    onEditModeButtonClick,
    allowOwnerActions,
  } = props;

  const [trips, setTrips] = useState<ParsedTrip[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [focusedTripId, setFocusedTripId] = useState<
    string | number | undefined
  >();

  const [selectedHint, setSelectedHint] = useState<ParsedFindRouteHint | null>(
    null
  );

  const [sendRequest, isLoading] = useHttp(
    `${API_CALL_URL_BASE}${getTripsRequestUrl}`,
    true
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const token = useAppSelector((state) => state.authState.token);
  const userStateLoaded = useAppSelector((state) => state.authState.userStateLoaded);

  const handleResponse = useCallback((response: Response) => {
    if (!response.ok) {
      throw new Error("Nie udało się pobrać tras");
    }
    return response.json().then((data: SearchTripDTO) => {
      const parsedTrips = data.trips.map<ParsedTrip>((trip) => {
        trip.points = trip.points.map((point) => {
          return {
            ...point,
            coordinates: JSON.parse(point.coordinates),
          };
        });
        trip.route = JSON.parse(trip.route);
        return trip as unknown as ParsedTrip;
      });
      setTrips(parsedTrips);
      setPageCount(data.pageCount);
    });
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error(error);
  }, []);

  const [sendGetHintRequest] = useHttp(`${API_CALL_URL_BASE}/find-hint`);

  function handleGetHintResponse(response: Response) {
    if (!response.ok) {
      throw new Error("Nie udało się pobrać podpowiedzi");
    }
    return response.json().then((data: FindRouteHintDTO) => {
      const parsedHint: ParsedFindRouteHint = {
        ...data,
        way: JSON.parse(data.way),
      };
      setSelectedHint(parsedHint);

      sendRequest(
        handleResponse,
        handleError,
        getTripsRequestInit || {},
        "?" +
          searchParams.toString() +
          `${
            parsedHint.type === "place"
              ? `&point=${parsedHint.way.coordinates[0]},${parsedHint.way.coordinates[1]}`
              : ""
          }`
      );
    });
  }

  function handleGetHintError(error: Error) {
    console.error(error);
  }

  const [sendToggleFavouritesRequest] = useHttp(
    `${API_CALL_URL_BASE}/toggle-favourite-trip`
  );

  function handleToggleFavouritesResponse(response: Response) {
    if (!response.ok) {
      throw new Error("Nie udało się zmienić stanu wycieczki");
    }
    return response.json().then((data: ToggleFavouriteTripResponse) => {
      setTrips((prevTrips) => {
        return prevTrips.map((trip) => {
          if (trip.id == data.tripId) {
            trip.isUsersFavourite = data.isAdded;
          }
          return trip;
        });
      });
    });
  }

  function handleToggleFavouritesError(error: Error) {
    console.error(error);
  }

  useEffect(() => {
    if(!userStateLoaded) return;
    const pointId = searchParams.get("pointId");
    const polygonToIntersectId = searchParams.get("polygonToIntersectId");
    if (!pointId && !polygonToIntersectId) {
      sendRequest(
        handleResponse,
        handleError,
        getTripsRequestInit || {},
        "?" + searchParams.toString()
      );
      return;
    }
    sendGetHintRequest(
      handleGetHintResponse,
      handleGetHintError,
      { method: "GET" },
      `/${pointId ? pointId : polygonToIntersectId}/${
        pointId ? "place" : "polygon"
      }`
    );
  }, [userStateLoaded, token]);

  return (
    <>
      <Filters
        focusedTripId={focusedTripId}
        selectedHint={selectedHint}
        onSelectedHintChange={(hint) => {
          setSelectedHint(hint);
        }}
        onSearch={(params) => {
          sendRequest(
            handleResponse,
            handleError,
            getTripsRequestInit || {},
            "?" +
              params.toString() +
              `${
                selectedHint && selectedHint.type === "place"
                  ? `&point=${selectedHint.way.coordinates[0]},${selectedHint.way.coordinates[1]}`
                  : ""
              }`
          );
        }}
        onTripClick={(tripId) => {
          setFocusedTripId(tripId);
        }}
        onTripBlur={() => {
          setFocusedTripId(undefined);
        }}
        trips={trips}
      />
      {trips.length > 0 || isLoading ? (
        <TripsList
          trips={trips}
          loading={isLoading}
          focusedTripId={focusedTripId}
          onDeleteButtonClick={onDeleteButtonClick}
          onEditModeButtonClick={onEditModeButtonClick}
          onFavoriteButtonClick={(tripId) => {
            sendToggleFavouritesRequest(
              handleToggleFavouritesResponse,
              handleToggleFavouritesError,
              {
                method: "POST",
                headers: {
                  Authorization: token,
                },
              },
              `/${tripId}`
            );
          }}
          allowOwnerActions={allowOwnerActions}
          showFavoriteButton={token !== ""}
        />
      ) : (
        <div className="no-routes-text">
          Nie znaleziono tras spełniających podane parametry.
        </div>
      )}

      {pageCount !== 0 && (
        <div className="pagination-container my-5">
          <Pagination
            siblingCount={0}
            count={pageCount}
            page={parseInt(searchParams.get("page") || "1")}
            onChange={(_, page) => {
              setSearchParams((prevParams) => {
                const newParams = new URLSearchParams(prevParams);
                newParams.set("page", page.toString());
                sendRequest(
                  handleResponse,
                  handleError,
                  getTripsRequestInit || {},
                  "?" +
                    newParams.toString() +
                    `${
                      selectedHint && selectedHint.type === "place"
                        ? `&point=${selectedHint.way.coordinates[0]},${selectedHint.way.coordinates[1]}`
                        : ""
                    }`
                );
                return newParams;
              });
            }}
          />
        </div>
      )}
    </>
  );
};

export default CompleteTripsList;
