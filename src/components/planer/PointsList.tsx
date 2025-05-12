import { Autocomplete, Button, TextField } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { PlaceHintParsed, PlaceHintResponse } from "../../types/api/trips";
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../hooks/useHttp";
import { API_CALL_URL_BASE } from "../../utils/constants";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import SelectableButton from "../shared/SelectableButton";
import { Add, Delete, MyLocation, Place } from "@mui/icons-material";
import { planerSliceActions } from "../../redux/planerSlice";
import { mapSliceActions } from "../../redux/mapSlice";

type PointsListProps = {
  onHintSelected: (hint: PlaceHintParsed) => void;
};

const PointsList = (props: PointsListProps) => {
  const [hints, setHints] = useState<PlaceHintParsed[]>([]);
  const [loadingCurrentPosition, setLoadingCurrentPosition] = useState(false);

  const { onHintSelected } = props;

  const state = useAppSelector((state) => state);
  const planerState = state.planerState;
  const mapState = state.mapState;

  const dispatch = useAppDispatch();

  const [getHintsRequest, isLoading] = useHttp(
    `${API_CALL_URL_BASE}/search-locations-hints`
  );

  const handleHintsResponse = useCallback((response: Response) => {
    if (!response.ok) return;
    return response.json().then((data: PlaceHintResponse) => {
      const parsedHints: PlaceHintParsed[] = data.map((hint) => ({
        id: hint.id,
        name: hint.name,
        city: hint.city,
        point: JSON.parse(hint.point),
      }));
      setHints(parsedHints);
    });
  }, []);

  return (
    <>
      <DragDropContext
        onDragEnd={(result) => {
          dispatch(
            planerSliceActions.changePointsOrder({
              sourceIndex: result.source.index,
              destinationIndex: result.destination?.index,
            })
          );
        }}
      >
        <Droppable droppableId="points">
          {(provided) => (
            <ul
              className="points-list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {planerState.planer.points.map((point, index, points) => {
                const disabled = planerState.planer.roundTrip && index === points.length - 1
                return (
                  <Draggable
                    key={`point-${point.order}`}
                    draggableId={`point-${point.order}`}
                    index={point.order}
                  >
                    {(provided) => (
                      <li
                        className="point-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="point-letter">
                          {String.fromCharCode(65 + point.order)}
                        </div>
                        <Autocomplete
                          fullWidth
                          freeSolo
                          filterOptions={(x) => x}
                          options={hints}
                          disabled={disabled}
                          isOptionEqualToValue={(option, value) =>
                            option === value
                          }
                          inputValue={point.name}
                          onInputChange={(_, value) => {
                            if (value.length > 2) {
                              getHintsRequest(
                                handleHintsResponse,
                                undefined,
                                { method: "GET" },
                                `?query=${value}`
                              );
                            } else {
                              setHints([]);
                            }
                            dispatch(
                              planerSliceActions.setPointFromString({
                                index,
                                value,
                              })
                            );
                          }}
                          onChange={(_, value) => {
                            if (!value || typeof value === "string") return;
                            const hint = value as PlaceHintParsed;
                            dispatch(
                              planerSliceActions.setPointValueFromPlaceHint({
                                index,
                                value: hint,
                              })
                            );
                            onHintSelected(hint);
                          }}
                          getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.name
                          }
                          getOptionKey={(option) =>
                            typeof option === "string"
                              ? option
                              : `${option.city}-${option.id}`
                          }
                          onBlur={() => {
                            setHints([]);
                            if (!point.coordinates) {
                              dispatch(
                                planerSliceActions.clearPoint({ index })
                              );
                            }
                          }}
                          renderOption={(props, option) => {
                            return (
                              <li {...props}>
                                <span className="name">{option.name}</span>{" "}
                                <span className="city">{option.city}</span>
                              </li>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              placeholder={
                                index === 0
                                  ? "Punkt początkowy"
                                  : index ===
                                    planerState.planer.points.length - 1
                                  ? "Punkt końcowy"
                                  : "Punkt pośredni"
                              }
                              variant="outlined"
                              {...params}
                            />
                          )}
                        />
                        {planerState.planer.points.length > 2 && (
                          <SelectableButton
                            cssClass="point-action-button"
                            tooltipTitle="Usuń punkt"
                            disabled={disabled}
                            isActive={false}
                            icon={<Delete />}
                            onClick={() => {
                              dispatch(
                                planerSliceActions.removePoint({ index })
                              );
                            }}
                          />
                        )}
                        <SelectableButton
                          cssClass="point-action-button"
                          tooltipTitle="Wskaż na mapie"
                          disabled={disabled}
                          isActive={
                            planerState.planer.focusedPointIndex === index &&
                            mapState.state === "pointer"
                          }
                          icon={<Place />}
                          onClick={() => {
                            dispatch(
                              planerSliceActions.setFocusedPointIndex(index)
                            );
                            dispatch(mapSliceActions.changeMapState("pointer"));
                          }}
                        />
                        {navigator && (
                          <SelectableButton
                            cssClass="point-action-button"
                            tooltipTitle="Moja lokalizacja"
                            disabled={disabled}
                            isActive={
                              loadingCurrentPosition &&
                              planerState.planer.focusedPointIndex === index
                            }
                            isLoading={
                              loadingCurrentPosition &&
                              planerState.planer.focusedPointIndex === index
                            }
                            icon={<MyLocation />}
                            onClick={() => {
                              setLoadingCurrentPosition(true);
                              dispatch(
                                planerSliceActions.setFocusedPointIndex(index)
                              );
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  dispatch(
                                    planerSliceActions.setPointFromString({
                                      index,
                                      value: `${position.coords.latitude},${position.coords.longitude}`,
                                      name: "Moja lokalizacja",
                                    })
                                  );
                                  setLoadingCurrentPosition(false);
                                },
                                () => {
                                  setLoadingCurrentPosition(false);
                                }
                              );
                            }}
                          />
                        )}
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      {planerState.planer.points.length < 5 && (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Add />}
          onClick={() => {
            dispatch(planerSliceActions.addEmptyPoint());
          }}
        >
          Dodaj punkt
        </Button>
      )}
    </>
  );
};

export default PointsList;
