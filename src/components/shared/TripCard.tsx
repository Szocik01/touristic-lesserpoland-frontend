import {
  AccessTime,
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
  Lock,
  Timeline,
} from "@mui/icons-material";
import RouteUnitConverter from "../../utils/routeUnitsConverter";
import CategoryIcon from "./CategoryIcon";
import { TripTypes } from "../../types/api/trips";
import IconBadge from "./IconBadge";
import SelectableButton from "./SelectableButton";

type TripCardProps = {
  imageUrl: string;
  title: string;
  category: TripTypes;
  distance?: number;
  duration?: number;
  url: string;
  isFocused?: boolean;
  showOwnerActions?: boolean;
  isFavorite: boolean;
  onDeleteButtonClick?: () => void;
  onEditModeButtonClick?: () => void;
  onFavoriteButtonClick?: () => void;
  horizontal?: boolean;
  isPublic: boolean;
};

const TripCard = (props: TripCardProps) => {
  const {
    imageUrl,
    title,
    url,
    category,
    distance,
    duration,
    isFocused,
    onDeleteButtonClick,
    onEditModeButtonClick,
    onFavoriteButtonClick,
    showOwnerActions,
    isFavorite,
    horizontal,
    isPublic,
  } = props;
  return (
    <div
      className={`trip-card ${isFocused ? "focused" : ""} ${
        horizontal ? "horizontal" : ""
      }`}
    >
      <a className="link" href={url}></a>
      <div className="card-thumb">
        <div className="actions">
          {showOwnerActions && (
            <>
              <SelectableButton
                icon={<Delete fontSize="small" />}
                elevated
                cssClass="delete-button"
                onClick={() => {
                  onDeleteButtonClick?.();
                }}
              />
              <SelectableButton
                icon={<Edit fontSize="small" />}
                elevated
                cssClass="edit-button"
                onClick={() => {
                  onEditModeButtonClick?.();
                }}
              />
            </>
          )}
          {onFavoriteButtonClick && (
            <SelectableButton
              cssClass="favourite-button"
              icon={
                isFavorite ? (
                  <Favorite
                    fontSize="large"
                    sx={{
                      color: "red",
                    }}
                  />
                ) : (
                  <FavoriteBorder fontSize="large" />
                )
              }
              onClick={() => {
                onFavoriteButtonClick();
              }}
            />
          )}
        </div>
        <img src={imageUrl} alt={props.title} />
        {!isPublic && <IconBadge size="small" icon={<Lock/>} cssClass="private-badge"/>}
      </div>
      <div className="card-body">
        {!horizontal && (
          <div className="category">
            <IconBadge
              size="small"
              icon={<CategoryIcon category={category} />}
            />
          </div>
        )}
        <div className="text-content">
          <div className="title">{title}</div>
          <div className="params-container">
            {horizontal && (
              <div className="category">
                <IconBadge
                  size="small"
                  icon={<CategoryIcon category={category} />}
                />
              </div>
            )}
            {duration && <div className="param">
              <AccessTime fontSize="small" />
              {RouteUnitConverter.convertTimeToString(duration)}
            </div>}
            {distance && <div className="param">
              <Timeline fontSize="small" />
              {RouteUnitConverter.convertMetersToKilometers(distance)} km
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
