import {
  DirectionsBike,
  DirectionsCar,
  DirectionsWalk,
} from "@mui/icons-material";
import SelectableButton from "./SelectableButton";
import { TripTypes } from "../../types/api/trips";

type CategoriesListProps = {
  onCategoryChange: (category: TripTypes) => void;
  activeCategory?: TripTypes;
  contrastButtons?: boolean;
  showSubtext?: boolean;
};

const CategoriesList = (props: CategoriesListProps) => {
  const { onCategoryChange, activeCategory, contrastButtons, showSubtext } =
    props;
  return (
    <div className={`categories-list ${contrastButtons ? "contrast" : ""}`}>
      <div className="button-container">
        <SelectableButton
          isActive={activeCategory === "foot"}
          icon={<DirectionsWalk />}
          tooltipTitle={!showSubtext ? "Pieszo" : ""}
          value="foot"
          onClick={onCategoryChange}
        />
        {props.showSubtext && <span>Pieszo</span>}
      </div>

      <div className="button-container">
        <SelectableButton
          isActive={activeCategory === "bike"}
          icon={<DirectionsBike />}
          tooltipTitle={!showSubtext ? "Rower" : ""}
          value="bike"
          onClick={onCategoryChange}
        />
        {props.showSubtext && <span>Rower</span>}
      </div>

      <div className="button-container">
        <SelectableButton
          isActive={activeCategory === "car"}
          icon={<DirectionsCar />}
          tooltipTitle={!showSubtext ? "Samochód" : ""}
          value="car"
          onClick={onCategoryChange}
        />
        {props.showSubtext && <span>Samochód</span>}
      </div>
    </div>
  );
};

export default CategoriesList;
