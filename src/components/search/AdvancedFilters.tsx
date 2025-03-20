import {
  Close,
  FilterAltOutlined,
  HexagonOutlined,
  Place,
} from "@mui/icons-material";
import { Autocomplete, Button, Slider, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { FindRouteHintDTO, FindRouteHintsDTO, ParsedFindRouteHint } from "../../types/api/trips";
import useHttp from "../../hooks/useHttp";
import { API_CALL_URL_BASE } from "../../utils/constants";
import RouteUnitConverter from "../../utils/routeUnitsConverter";

type AdvancedFiltersProps = {
  onFilterClick: () => void;
  onClearFilters: () => void;
  onQueryChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  searchParams: URLSearchParams;
  onHintChange: (event: ChangeEvent<{}>, value: ParsedFindRouteHint) => void;
  onBeforeHintsInputChange: (
    event: ChangeEvent<{}>,
    value: string,
    reason: string
  ) => void;
  onSliderChange: (event: Event, value: number | number[]) => void;
  selectedHint: ParsedFindRouteHint | null;
};

const AdvancedFilters = (props: AdvancedFiltersProps) => {
  const {
    onClearFilters,
    searchParams,
    onFilterClick,
    onQueryChange,
    onHintChange,
    onBeforeHintsInputChange,
    selectedHint,
  } = props;

  const [hints, setHints] = useState<FindRouteHintsDTO>([]);

  const [getHintsRequest] = useHttp(
    `${API_CALL_URL_BASE}/search-find-routes-hints`
  );

  const handleHintsResponse = (response: Response) => {
    if (!response.ok) {
      throw new Error("Nie udało się pobrać podpowiedzi");
    }
    return response.json().then((data: FindRouteHintsDTO) => {
      setHints(data);
    });
  };

  const handleHintsError = (error: Error) => {
    console.error(error);
  };

  return (
    <div className="hidable-filters-container row">
      <div className="col-12 col-lg-10 offset-lg-1 mb-3">
        <TextField
          fullWidth
          label="Słowa kluczowe"
          name="query"
          value={searchParams.get("query") || ""}
          onChange={(event) => {
            onQueryChange(event);
          }}
        />
      </div>
      <div className="col-12 offset-lg-1 col-lg-5 mb-3">
        <Autocomplete<ParsedFindRouteHint | FindRouteHintDTO>
          fullWidth
          filterOptions={(x) => x}
          options={hints}
          noOptionsText="Nie znaleziono wyników"
          isOptionEqualToValue={(option, value) => option.id === value.id}
          value={selectedHint}
          onInputChange={(_, value, reason) => {
            if (reason !== "input") return;
            onBeforeHintsInputChange(_, value, reason);
            if (value.length > 2) {
              getHintsRequest(
                handleHintsResponse,
                handleHintsError,
                { method: "GET" },
                `?query=${value}`
              );
            } else {
              setHints([]);
            }
          }}
          onChange={(_, value) => {
            if (!value) return;
            const hint = value as FindRouteHintDTO;
            const parsedHint: ParsedFindRouteHint = {
              ...hint,
              way: JSON.parse(hint.way),
            }
            onHintChange(_, parsedHint);
          }}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          getOptionKey={(option) => {
            return option.id;
          }}
          onBlur={() => {
            setHints([]);
          }}
          renderOption={(props, option) => {
            return (
              <li {...props} key={props.key}>
                <span className="name">{option.name}</span>{" "}
                <span className="area-type">
                  {option.type === "polygon" ? (
                    <>
                      <HexagonOutlined fontSize="small" /> rejon
                    </>
                  ) : (
                    <>
                      <Place fontSize="small" /> punkt
                    </>
                  )}
                </span>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              label="Przechodzi przez"
              variant="outlined"
              {...params}
            />
          )}
        />
      </div>
      <div className="offset-1 col-10 col-sm-12 offset-sm-0 col-lg-5 mb-3">
        <Slider
          min={1}
          marks={[
            { value: 1, label: "1 km" },
            { value: 100, label: "100 km" },
          ]}
          valueLabelDisplay="auto"
          disabled={!searchParams.get("pointId")}
          value={RouteUnitConverter.convertMetersToKilometers(
            parseInt(searchParams.get("radius") || "5000")
          )}
          onChange={(_, value) => {
            props.onSliderChange(_, value);
          }}
        />
      </div>
      <div className="offset-lg-1 col-12 col-sm-4 col-md-3 col-lg-2 mb-3 mb-lg-0">
        <Button
          fullWidth
          variant="contained"
          startIcon={<FilterAltOutlined />}
          onClick={() => {
            onFilterClick();
          }}
        >
          filtruj
        </Button>
      </div>
      <div className="col-12 col-sm-4 col-md-3 col-lg-2">
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Close />}
          onClick={() => {
            onClearFilters();
            setHints([]);
          }}
        >
          Wyczyść
        </Button>
      </div>
    </div>
  );
};

export default AdvancedFilters;
