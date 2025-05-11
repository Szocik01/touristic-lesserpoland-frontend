import {
  ChevronLeft,
  Save,
} from "@mui/icons-material";
import {
  Point,
  Route,
  TripTypes,
} from "../../types/api/trips";
import IconBadge from "../shared/IconBadge";
import CategoryIcon from "../shared/CategoryIcon";
import RouteUnitConverter from "../../utils/routeUnitsConverter";
import { Button } from "@mui/material";
import RouteParams from "../shared/RouteParams";
import { Fragment } from "react/jsx-runtime";
import RouteElevationChart from "../shared/RouteElevationChart";

type RouteDetailsProps = {
  route: Route;
  category: TripTypes;
  points: (Point & { name: string })[];
  onPointClick: (index: number) => void;
  onReturn: () => void;
  onSaveRoute: () => void;
  routeName?: string;
};

const RouteDetails = (props: RouteDetailsProps) => {
  const {
    route,
    category,
    points,
    onReturn,
    onPointClick,
    onSaveRoute,
    routeName,
  } = props;

  return (
    <>
      <div className="route-details-header">
        <Button onClick={onReturn} variant="text" startIcon={<ChevronLeft />}>
          wróć
        </Button>
        <div className="title">
          <h3>{routeName ? routeName : "WYSZUKANA TRASA"}</h3>
          <div className="category-info">
            <IconBadge icon={<CategoryIcon category={category} />} />
          </div>
        </div>
      </div>
      <div className="route-points">
        {points.map((point, index) => {
          return (
            <Fragment key={index}>
              <div
                onClick={() => {
                  onPointClick(index);
                }}
                className="route-point"
                role="button"
              >
                <IconBadge
                  dark
                  size="small"
                  icon={String.fromCharCode(65 + index)}
                />
                <span>{point.name}</span>
              </div>
              { route.details?.leg_distance[index] && (
                <div className="distance-to-next-point">
                  {RouteUnitConverter.convertMetersToKilometers(
                    route.details.leg_distance[index][2]
                  )}{" "}
                  km
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
      <RouteParams
        distance={route.distance}
        time={route.time}
        ascend={route.ascend}
        descend={route.descend}
      />
      <RouteElevationChart height={150} coordinates={route.points.coordinates}/>
      {!routeName && (
        <Button
          fullWidth
          variant="contained"
          onClick={onSaveRoute}
          startIcon={<Save />}
        >
          zapisz trasę
        </Button>
      )}
    </>
  );
};

export default RouteDetails;
