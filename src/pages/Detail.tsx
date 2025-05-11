import { Download, Favorite, FavoriteBorder, Lock } from "@mui/icons-material";
import { API_CALL_URL_BASE } from "../utils/constants";
import useHttp from "../hooks/useHttp";
import { Route, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { GeoJsonFeature, GeoJsonFeatureCollection, LatLng, ParsedTrip, TripDTO } from "../types/api/trips";
import ContentLoading from "../components/utils/ContentLoading";
import HeaderImages from "../components/detail/HeaderImages";
import DetailMap from "../components/detail/DetailMap";
import Gallery from "../components/detail/Gallery";
import AddComment from "../components/detail/AddComment";
import FsLightbox from "fslightbox-react";
import { useAppSelector } from "../redux/store";
import CategoryIcon from "../components/shared/CategoryIcon";
import IconBadge from "../components/shared/IconBadge";
import RouteParams from "../components/shared/RouteParams";
import CommentsListing from "../components/detail/CommentsListing";
import RouteElevationChart from "../components/shared/RouteElevationChart";
import { Weather } from "../components/detail/Weather";
import { Badge } from "../components/shared/Badge";
import { Button } from "@mui/material";
import { RouteFormatConverter } from "../utils/routeFormatConverter";
import { downloadFile } from "../utils/downloadFile";

const Detail = () => {
  const [trip, setTrip] = useState<ParsedTrip>();
  const [elevationMarkerOnMapCoordinates, setElevationMarkerOnMapCoordinates] =
    useState<LatLng | null>(null);
  const [ligthboxStatus, setLightboxStatus] = useState<{
    open: boolean;
    index: number;
  }>({
    open: false,
    index: 1,
  });

  const authState = useAppSelector((state) => state.authState);
  const token = authState.token;
  const userId = authState.userInfo?.userId;
  const userStateLoaded = authState.userStateLoaded;

  const tripId = useParams<{ id: string }>().id;

  const [sendTripRequest, isLoading] = useHttp(
    `${API_CALL_URL_BASE}/get-trip/${tripId}${
      authState.userInfo?.userId ? `?userId=${userId}` : ""
    }`,
    true
  );

  const handleTripResponse = (response: Response) => {
    if (response.status === 404) {
      throw new Error("Nie znaleziono wycieczki");
    }
    if (!response.ok) {
      throw new Error("Nie udało się pobrać wycieczki");
    }
    return response.json().then((data: TripDTO) => {
      data.points = data.points.map((point) => {
        return {
          ...point,
          coordinates: JSON.parse(point.coordinates),
        };
      });
      data.route = JSON.parse(data.route);
      const parsedData = data as unknown as ParsedTrip;
      setTrip(parsedData);
    });
  };

  const handleTripError = (error: Error) => {
    console.error(error);
  };

  const [sendFavouriteRequest] = useHttp(
    `${API_CALL_URL_BASE}/toggle-favourite-trip/${tripId}`
  );

  function handleFavouriteResponse(response: Response) {
    if (!response.ok) {
      throw new Error("Nie udało się zmienić statusu wycieczki");
    }
    return response.json().then((data) => {
      setTrip((prevValue) => {
        return prevValue
          ? {
              ...prevValue,
              isUsersFavourite: !prevValue.isUsersFavourite,
            }
          : undefined;
      });
    });
  }

  function handleFavouriteError(error: Error) {
    console.error(error);
  }

  const imagesUrls = trip?.images.map((image) => {
    return `${API_CALL_URL_BASE}${image.path}`;
  });

  const tripGeoJsonFeatureCollection: GeoJsonFeatureCollection | undefined = useMemo(()=>{
    if (!trip) return undefined;
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: trip.route,
        },
        ...trip.points.map((point) => {
          return {
            type: "Feature" as const,
            properties: {
              name: point.name,
            },
            geometry: point.coordinates,
          };
        }),
      ],
    }
  },[
    trip
  ])

  useEffect(() => {
    if (!userStateLoaded) {
      return;
    }
    sendTripRequest(handleTripResponse, handleTripError);
  }, [tripId, userStateLoaded]);

  if (!tripId) return null;

  const routeWithFilteredUndefinedElevation = trip?.route.coordinates.filter(
    (coordinate) => {
      return coordinate.length > 2;
    }
  );

  return (
    <>
      {imagesUrls && imagesUrls.length > 0 && (
        <FsLightbox
          toggler={ligthboxStatus.open}
          sources={trip?.images.map((image) => {
            return `${API_CALL_URL_BASE}${image.path}`;
          })}
          sourceIndex={ligthboxStatus.index}
        />
      )}
      <div className="container main py-5 detail">
        {isLoading || !trip ? (
          <ContentLoading coverParent />
        ) : (
          <div className="row">
            <div className="col-12">
              <div className="detail-header-section">
                <div className="detail-title">
                  <h1>{trip.name}</h1>
                  <div className="rigth-side-container">
                    {token && (
                      <button
                        className="favourites-button"
                        type="button"
                        onClick={() =>
                          sendFavouriteRequest(
                            handleFavouriteResponse,
                            handleFavouriteError,
                            {
                              method: "POST",
                              headers: {
                                Authorization: token,
                              },
                            }
                          )
                        }
                      >
                        {!trip.isUsersFavourite ? (
                          <FavoriteBorder />
                        ) : (
                          <Favorite sx={{ color: "red" }} />
                        )}
                      </button>
                    )}
                    <IconBadge
                      icon={<CategoryIcon category={trip.type} />}
                      size="large"
                    />
                  </div>
                </div>
                {!trip.public && (
                  <Badge rounded className="private-badge">
                    <Lock />
                    {`wycieczka prywatna`}
                  </Badge>
                )}
              </div>
            </div>
            {imagesUrls && imagesUrls.length > 0 && (
              <div className="col-12 mb-5">
                <HeaderImages
                  imagesUrls={imagesUrls.slice(0, 5)}
                  onOpenLightbox={(index) => {
                    setLightboxStatus((prevValue) => {
                      return {
                        open: !prevValue.open,
                        index: index,
                      };
                    });
                  }}
                />
              </div>
            )}
            {trip && (
              <div className="col-12 mb-4 download-route-buttons">
                <Button variant="outlined" startIcon={<Download />} onClick={() => {
                  const fileName = `${trip.name}-${new Date().toISOString()}.gpx`;
                  const gpxContent = RouteFormatConverter.geoJsonToGpx(tripGeoJsonFeatureCollection!!);
                  const gpxBlob = new Blob([gpxContent], { type: "application/gpx+xml" });
                  downloadFile(gpxBlob, fileName);
                }}>
                  Pobierz jako GPX
                </Button>
                <Button variant="outlined" startIcon={<Download />} onClick={() => {
                  const fileName = `${trip.name}-${new Date().toISOString()}.json`;
                  const geoJsonContent = JSON.stringify(tripGeoJsonFeatureCollection, null, 2);
                  const geoJsonBlob = new Blob([geoJsonContent], { type: "application/json" });
                  downloadFile(geoJsonBlob, fileName);
                }}>
                  Pobierz jako GeoJSON
                </Button>
              </div>
            )}
            {trip && (
              <div className="col-12 mb-4">
                <DetailMap
                  route={trip.route}
                  color={trip.color}
                  points={trip.points}
                  elevationMarkerCoordinates={elevationMarkerOnMapCoordinates}
                />
              </div>
            )}
            {routeWithFilteredUndefinedElevation &&
              routeWithFilteredUndefinedElevation.length > 0 && (
                <div className="col-12 mb-5">
                  <div className="chart">
                    <RouteElevationChart
                      coordinates={trip.route.coordinates}
                      onMouseMove={(event) => {
                        const payload = event?.activePayload?.[0].payload as
                          | { lat: number; lng: number }
                          | undefined;
                        if (!payload) return;
                        setElevationMarkerOnMapCoordinates([
                          payload.lat,
                          payload.lng,
                        ]);
                      }}
                      onMouseLeave={() => {
                        setElevationMarkerOnMapCoordinates(null);
                      }}
                    />
                  </div>
                </div>
              )}
            {(trip.distance || trip.time || trip.ascend || trip.descend) && (
              <div className="col-12 mb-5">
                <RouteParams
                  distance={trip.distance}
                  time={trip.time}
                  ascend={trip.ascend}
                  descend={trip.descend}
                />
              </div>
            )}
            <div className="col-12 mb-5">
              <Weather weatherForecast={trip.weather} />
            </div>
            <div className="col-9 mb-5">
              <div
                className="description"
                dangerouslySetInnerHTML={{ __html: trip.description }}
              ></div>
            </div>
            {imagesUrls && (
              <div className="col-12 mb-5">
                <Gallery
                  imagesUrls={imagesUrls}
                  onOpenLightbox={(index) => {
                    setLightboxStatus((prevValue) => {
                      return {
                        open: !prevValue.open,
                        index: index,
                      };
                    });
                  }}
                />
              </div>
            )}
            <div className="col-12 mb-4">
              <div className="comments-title">Komentarze</div>
            </div>
            {token && (
              <div className="col-12 col-lg-9 mb-4">
                <AddComment
                  token={token}
                  onAddComment={(comment) => {
                    setTrip((prevValue) => {
                      return prevValue
                        ? {
                            ...prevValue,
                            comments: [...prevValue.comments, comment],
                          }
                        : undefined;
                    });
                  }}
                  tripId={tripId}
                />
              </div>
            )}
            <div className="col-12 col-lg-9 ">
              <CommentsListing
                token={token}
                comments={trip.comments}
                userId={userId}
                onSuccessfulDelete={(deletedCommentId) => {
                  setTrip((prevValue) => {
                    if (!prevValue) return undefined;
                    const commentsCopy = prevValue.comments.filter(
                      (comment) => comment.id != deletedCommentId
                    );
                    return { ...prevValue, comments: commentsCopy };
                  });
                }}
                onSuccessfulEdit={(updatedComment) => {
                  setTrip((prevValue) => {
                    if (!prevValue) return undefined;
                    const commentsCopy = [...prevValue.comments];
                    const index = commentsCopy.findIndex(
                      (comment) => comment.id == updatedComment.id
                    );
                    commentsCopy[index] = updatedComment;
                    return { ...prevValue, comments: commentsCopy };
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Detail;
