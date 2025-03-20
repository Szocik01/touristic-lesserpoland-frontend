import { ParsedTrip, TripDTO } from "../../types/api/trips";
import { API_CALL_URL_BASE } from "../../utils/constants";
import TripCard from "../shared/TripCard";
import ImagePlaceholder from "../../assets/images/image-placeholder.webp";
import TripCardSkeleton from "../shared/TripCardSkeleton";

type TripsListProps = {
  trips: ParsedTrip[];
  loading: boolean;
  focusedTripId?: string | number;
  allowOwnerActions?: boolean;
  showFavoriteButton?: boolean;
  onDeleteButtonClick?: (tripId: string) => void;
  onEditModeButtonClick?: (tripId: string) => void;
  onFavoriteButtonClick?: (tripId: string) => void;
};

const TripsList = (props: TripsListProps) => {
  const {
    trips,
    loading,
    focusedTripId,
    allowOwnerActions,
    showFavoriteButton,
    onDeleteButtonClick,
    onEditModeButtonClick,
    onFavoriteButtonClick,
  } = props;

  for (let i = 0; i < 12; i++) {
    <TripCardSkeleton />;
  }

  const skeletons = Array.from({ length: 12 }, (_, index) => {
    return (
      <li
        className="trip-list-item mb-4 col-12 col-xs-6 col-sm-4 col-md-3"
        key={index}
      >
        <TripCardSkeleton />
      </li>
    );
  });

  return (
    <ul className="trips-list row">
      {!loading &&
        trips.map((trip) => {
          return (
            <li
              className="trip-list-item mb-4 col-12 col-xs-6 col-sm-4 col-md-3"
              key={trip.id}
            >
              <TripCard
                isPublic={trip.public}
                isFocused={focusedTripId === trip.id}
                imageUrl={
                  trip.images[0]
                    ? `${API_CALL_URL_BASE}${trip.images[0].path}`
                    : ImagePlaceholder
                }
                title={trip.name}
                category={trip.type}
                distance={trip.distance}
                duration={trip.time}
                isFavorite={trip.isUsersFavourite}
                url={`wycieczka/${trip.id}`}
                onDeleteButtonClick={() => {
                  onDeleteButtonClick?.(trip.id);
                }}
                onEditModeButtonClick={() => {
                  onEditModeButtonClick?.(trip.id);
                }}
                onFavoriteButtonClick={showFavoriteButton == true ? () => {
                  onFavoriteButtonClick?.(trip.id);
                } : undefined}
                showOwnerActions={allowOwnerActions && trip.isUserOwner}
              />
            </li>
          );
        })}
      {loading && skeletons}
    </ul>
  );
};

export default TripsList;
