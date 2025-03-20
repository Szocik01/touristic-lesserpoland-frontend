import { MapRef } from "react-map-gl/dist/esm/exports-maplibre";
import CategoriesList from "../shared/CategoriesList";
import { ParsedTrip, SearchTripDTO, TripTypes } from "../../types/api/trips";
import { Box, Button, Pagination, Slider } from "@mui/material";
import { Search } from "@mui/icons-material";
import TripCard from "../shared/TripCard";
import useHttp from "../../hooks/useHttp";
import { API_CALL_URL_BASE } from "../../utils/constants";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { planerSliceActions } from "../../redux/planerSlice";
import { useEffect, useState } from "react";
import RouteUnitConverter from "../../utils/routeUnitsConverter";
import ContentLoading from "../utils/ContentLoading";
import ImagePlaceholder from "../../assets/images/image-placeholder.webp";
import { getBoundsFromRoutesOrPolygon } from "../../utils/mapFunctions";
import { boundsPaddingWithSidePanel } from "../../config/map";

type PlanTripProps = {
  map?: MapRef;
};

const SearchTrip = (props: PlanTripProps) => {
  const [getTrips, isLoading] = useHttp(`${API_CALL_URL_BASE}/search-trips`);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<TripTypes | undefined>(
    undefined
  );

  const dispatch = useAppDispatch();

  const { trips, radius, point } = useAppSelector(
    (state) => state.planerState.search
  );

  function handleTripsResponse(response: Response) {
    if (!response.ok) {
      throw new Error("Failed to fetch trips");
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
      dispatch(planerSliceActions.setTrips(parsedTrips));
      dispatch(planerSliceActions.clearFocusedTripId());
      setPageCount(data.pageCount);
      props.map?.fitBounds(
        getBoundsFromRoutesOrPolygon(
          parsedTrips.map((trip) => {
            return trip.route.coordinates;
          })
        ),
        {
          padding: boundsPaddingWithSidePanel,
          speed: 0.8,
        }
      );
    });
  }

  function handleTripsError(error: Error) {
    console.error(error);
  }

  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage.toString());
    if (activeCategory) {
      searchParams.append("type", activeCategory);
    }
    if (point) {
      searchParams.append("point", `${point[0]},${point[1]}`);
      searchParams.append("radius", radius.toString());
    }

    getTrips(
      handleTripsResponse,
      handleTripsError,
      { method: "GET" },
      `?${searchParams.toString()}`
    );
  }, [currentPage, activeCategory]);

  useEffect(() => {
    return () => {
      dispatch(planerSliceActions.clearTrips());
      dispatch(planerSliceActions.clearMapCenterPoint());
      dispatch(planerSliceActions.clearFocusedTripId());
    };
  }, []);

  return (
    <div className="search-trip-container">
      <CategoriesList
        onCategoryChange={(category) => {
          setActiveCategory(category);
        }}
        activeCategory={activeCategory}
      />
      <Button
        variant="contained"
        startIcon={<Search />}
        onClick={() => {
          const center = props.map?.getCenter();
          if (!center) return;
          setCurrentPage(1);
          const searchParams = new URLSearchParams();
          if (activeCategory) {
            searchParams.append("type", activeCategory);
          }
          if (center) {
            searchParams.append("point", `${center.lng},${center.lat}`);
            searchParams.append("radius", radius.toString());
          }
          getTrips(
            handleTripsResponse,
            handleTripsError,
            { method: "GET" },
            `?${searchParams.toString()}`
          );
          dispatch(
            planerSliceActions.setMapCenterPoint([center.lng, center.lat])
          );
        }}
      >
        wyszukaj w okolicy
      </Button>
      <Box sx={{ paddingLeft: "16px", paddingRight: "16px", width: "100%" }}>
        <Slider
          min={1}
          marks={[
            { value: 1, label: "1 km" },
            { value: 100, label: "100 km" },
          ]}
          valueLabelDisplay="auto"
          value={RouteUnitConverter.convertMetersToKilometers(radius || 0)}
          onChange={(_, value) => {
            dispatch(
              planerSliceActions.setRadius(
                RouteUnitConverter.convertKilometersToMeters(value as number)
              )
            );
          }}
        />
      </Box>
      {!isLoading ? (
        <ul className="trips-list">
          {trips.map((trip) => {
            return (
              <li className="trip-card-container">
                <TripCard
                  horizontal
                  isPublic={trip.public}
                  imageUrl={
                    trip.images[0]
                      ? `${API_CALL_URL_BASE}${trip.images[0].path}`
                      : ImagePlaceholder
                  }
                  title={trip.name}
                  category={trip.type}
                  distance={trip.distance}
                  duration={trip.time}
                  url={`/wycieczka/${trip.id}`}
                  isFavorite={false}
                />
              </li>
            );
          })}
          {pageCount !== 0 && (
            <div className="pagination-container mt-3 mb-1">
              <Pagination
                siblingCount={0}
                count={pageCount}
                page={currentPage}
                onChange={(_, page) => {
                  setCurrentPage(page);
                }}
              />
            </div>
          )}
        </ul>
      ) : (
        <ContentLoading coverParent blurOverlay />
      )}
    </div>
  );
};

export default SearchTrip;
