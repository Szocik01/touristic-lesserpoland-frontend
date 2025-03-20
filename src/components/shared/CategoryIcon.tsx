import {
  DirectionsBike,
  DirectionsCar,
  DirectionsWalk,
} from "@mui/icons-material";
import { TripTypes } from "../../types/api/trips";
import { Tooltip } from "@mui/material";

type CategoryIconProps = {
  category: TripTypes;
};

const CategoryIcon = (props: CategoryIconProps) => {
  const { category } = props;
  switch (category) {
    case "foot":
      return (
        <Tooltip title="Pieszo" placement="bottom">
          <DirectionsWalk />
        </Tooltip>
      );
    case "bike":
      return (
        <Tooltip title="Rower" placement="bottom">
          <DirectionsBike />
        </Tooltip>
      );
    case "car":
      return (
        <Tooltip title="Samochód" placement="bottom">
          <DirectionsCar />
        </Tooltip>
      );
    default:
      return null;
  }
};

export default CategoryIcon;
