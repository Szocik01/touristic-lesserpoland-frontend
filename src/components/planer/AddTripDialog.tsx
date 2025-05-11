import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import DefaultDialog from "../utils/DefaultDialog";
import ContentEditor from "../utils/ContentEditor";
import { useCallback, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import ColorPicker from "../utils/ColorPicker";
import PhotoUpload from "../utils/PhotoUpload";
import ImagePreview from "../utils/ImagePreview";
import { Save } from "@mui/icons-material";
import Validators from "../../utils/validators";
import useHttp from "../../hooks/useHttp";
import { API_CALL_URL_BASE } from "../../utils/constants";
import {
  GraphHopperApiSuccessResponse,
  Point,
  Route,
  TripTypes,
} from "../../types/api/trips";
import { useAppDispatch } from "../../redux/store";
import { planerSliceActions } from "../../redux/planerSlice";

type AddTripDialogProps = {
  open: boolean;
  onClose: () => void;
  route: Route;
  category: TripTypes;
  points: (Point & { name: string })[];
  token: string;
};

const AddTripDialog = (props: AddTripDialogProps) => {
  const { open, onClose, route, category, points, token } = props;

  const [editorLoading, setEditorLoading] = useState(true);
  const [color, setColor] = useState<string>("#FF0000");
  const [photos, setPhotos] = useState<{ previewUrl: string; file: File }[]>(
    []
  );
  const [isPublic, setIsPublic] = useState(false);
  const editorRef = useRef<Editor>(null);
  const [showTitleError, setShowTitleError] = useState(false);
  const [title, setTitle] = useState("");
  const [sendAddTripRequest, isLoading] = useHttp(
    `${API_CALL_URL_BASE}/add-trip`
  );

  const dispatch = useAppDispatch();

  const titleError = Validators.validateTripTitle(title);

  const handleResponse = useCallback((response: Response) => {
    if (!response.ok) {
      const error = new Error("Nie udało się dodać trasy");
      throw error;
    }
    return response.json().then((data: { message: string }) => {
      dispatch(planerSliceActions.setRouteName(title))
      alert(data.message);
      onClose();
    });
  }, []);

  const handleError = useCallback((error: Error) => {
    console.log(error);
  }, []);

  return (
    <DefaultDialog
      title="Dodaj wycieczkę"
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      loading={isLoading}
    >
      <div className="add-trip-container">
        <TextField
          required
          label="Tytuł"
          fullWidth
          title={title}
          error={showTitleError && titleError !== ""}
          helperText={showTitleError ? titleError : " "}
          onFocus={() => {
            setShowTitleError(false);
          }}
          onBlur={() => {
            setShowTitleError(true);
          }}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <ContentEditor
          ref={editorRef}
          isLoading={editorLoading}
          onInit={() => {
            setEditorLoading(false);
          }}
        />
        <div className="selectables-row">
          <div className="color-picker-row">
            <h4>Wybierz kolor trasy</h4>
            <ColorPicker
              color={color}
              onChange={(color) => {
                setColor(color);
              }}
            />
          </div>
          <FormControlLabel
            className="trip-public-checkbox"
            disableTypography
            control={
              <Checkbox
                checked={isPublic}
                name="isPublic"
                onChange={(_, checked) => {
                  setIsPublic(checked);
                }}
              />
            }
            label="Trasa publiczna"
          />
        </div>
        <div className="upload-photo-row">
          <PhotoUpload
            onChange={(files) => {
              setPhotos((prevValue) => {
                return [
                  ...prevValue,
                  ...Array.from(files).map((file) => ({
                    previewUrl: URL.createObjectURL(file),
                    file,
                  })),
                ];
              });
            }}
          />
        </div>
        <ul className="images-preview-list">
          {photos.map((photo, index) => {
            return (
              <li key={index} className="images-preview-list-item">
                <ImagePreview
                  url={photo.previewUrl}
                  onDelete={() => {
                    setPhotos((prevValue) => {
                      const copy = [...prevValue];
                      copy.splice(index, 1);
                      return copy;
                    });
                  }}
                />
              </li>
            );
          })}
        </ul>
        <Button
          disabled={ titleError !== "" || points.length < 2 || !token}
          variant="contained"
          fullWidth
          startIcon={<Save />}
          onClick={() => {
            if(isLoading) return;
            const description = editorRef.current?.editor?.getContent();
            if (!description || titleError !== "" || points.length < 2 || !token) return;
            const formData = new FormData();
            formData.append("name", title);
            formData.append("description", description);
            formData.append("color", color);
            formData.append("isPublic", isPublic.toString());
            formData.append("type", category);
            formData.append("route", JSON.stringify(route.points));
            formData.append("points", JSON.stringify(points));
            {route.ascend && formData.append("ascend", route.ascend.toString());}
            {route.descend && formData.append("descend", route.descend.toString())};
            {route.distance && formData.append("distance", route.distance.toString())};
            {route.time && formData.append("time", route.time.toString())};
            photos.forEach((photo) => {
              formData.append("images", photo.file);
            });
            sendAddTripRequest(handleResponse, handleError, {
              method: "POST",
              headers:{
                Authorization: token,
              },
              body: formData,
            });
          }}
        >
          Zapisz trasę
        </Button>
      </div>
    </DefaultDialog>
  );
};

export default AddTripDialog;
