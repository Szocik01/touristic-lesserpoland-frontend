import { Button, Collapse } from "@mui/material";
import { useState } from "react";
import CategoriesList from "../shared/CategoriesList";
import { ParsedFindRouteHint, ParsedTrip, TripTypes } from "../../types/api/trips";
import { useSearchParams } from "react-router-dom";
import { FilterAltOutlined, MapOutlined } from "@mui/icons-material";
import AdvancedFilters from "./AdvancedFilters";
import RouteUnitConverter from "../../utils/routeUnitsConverter";
import SearchMap from "./SearchMap";

type FiltersProps = {
  onSearch: (params: URLSearchParams) => void;
  onSelectedHintChange: (hint: ParsedFindRouteHint | null) => void;
  selectedHint: ParsedFindRouteHint | null;
  onTripClick?: (tripId: string | number | undefined) => void;
  onTripBlur?: () => void;
  trips?: ParsedTrip[];
  focusedTripId?: string | number;

};

const Filters = (props: FiltersProps) => {
  const {
    onSearch,
    onSelectedHintChange,
    selectedHint,
    onTripClick,
    onTripBlur,
    trips,
    focusedTripId
  } = props;

  const [openFilters, setOpenFilters] = useState<"Map" | "Filters" | "Hidden">(
    "Hidden"
  );

  const [searchParams, setSearchParams] = useSearchParams();


  return (
    <div className="filters-container my-5">
      <div className="row">
        <div className="visible-filters col-12">
          <CategoriesList
            activeCategory={searchParams.get("type") as TripTypes}
            onCategoryChange={(category) => {
              setSearchParams((prevParams) => {
                const newParams = new URLSearchParams(prevParams);
                if (category === prevParams.get("type")) {
                  newParams.delete("type");
                  return newParams;
                }
                newParams.set("type", category);
                return newParams;
              });
            }}
            contrastButtons
            showSubtext
          />
          <div className="buttons-container">
            <Button
              variant="outlined"
              startIcon={<MapOutlined />}
              onClick={() => {
                setOpenFilters((prevValue) => {
                  return prevValue === "Map" ? "Hidden" : "Map";
                });
              }}
            >
              mapa
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setOpenFilters((prevValue) => {
                  return prevValue === "Filters" ? "Hidden" : "Filters";
                });
              }}
            >
              zaawansowane
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setSearchParams((prevValue) => {
                  const newParams = new URLSearchParams(prevValue);
                  newParams.delete("page");
                  onSearch(newParams);
                  return newParams;
                });
              }}
              startIcon={<FilterAltOutlined />}
            >
              filtruj
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Collapse in={openFilters === "Filters"}>
          <AdvancedFilters
            onFilterClick={() => {
              setSearchParams((prevValue) => {
                const newParams = new URLSearchParams(prevValue);
                newParams.delete("page");
                onSearch(newParams);
                return newParams;
              });
            }}
            onClearFilters={() => {
              setSearchParams(new URLSearchParams());
              onSelectedHintChange(null);
            }}
            onQueryChange={(event) => {
              if (event.target.value === "") {
                setSearchParams((prevParams) => {
                  const newParams = new URLSearchParams(prevParams);
                  newParams.delete("query");
                  return newParams;
                });
                return;
              }
              setSearchParams((prevParams) => {
                const newParams = new URLSearchParams(prevParams);
                newParams.set("query", event.target.value);
                return newParams;
              });
            }}
            searchParams={searchParams}
            selectedHint={selectedHint}
            onHintChange={(event, hint) => {
              setSearchParams((prevParams) => {
                const newParams = new URLSearchParams(prevParams);
                if (hint.type === "place") {
                  newParams.delete("polygonToIntersectId");
                  newParams.set("pointId", hint.id.toString());
                } else {
                  newParams.delete("radius");
                  newParams.delete("pointId");
                  newParams.set("polygonToIntersectId", hint.id.toString());
                }
                return newParams;
              });
              onSelectedHintChange(hint);
            }}
            onBeforeHintsInputChange={() => {
              setSearchParams((prevParams) => {
                const newParams = new URLSearchParams(prevParams);
                newParams.delete("pointId");
                newParams.delete("polygonToIntersectId");
                return newParams;
              });
            }}
            onSliderChange={(event, value) => {
              setSearchParams((prevParams) => {
                const newParams = new URLSearchParams(prevParams);
                newParams.set(
                  "radius",
                  RouteUnitConverter.convertKilometersToMeters(
                    value as number
                  ).toString()
                );
                return newParams;
              });
            }}
          />
        </Collapse>
        <Collapse in={openFilters === "Map"}>
          <SearchMap
            onTripClick={(tripId) => {onTripClick?.(tripId)}}
            onTripBlur={() => {onTripBlur?.()}}
            selectedHint={selectedHint}
            trips={trips || []}
            radius={parseInt(searchParams.get("radius") || "5000")}
            focusedTripId={focusedTripId}
          />
        </Collapse>
      </div>
    </div>
  );
};

export default Filters;
