import { ChevronRight, Close, Edit, Save } from "@mui/icons-material";
import PageHeader from "../components/shared/PageHeader";
import { useAppSelector } from "../redux/store";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import ContentEditor from "../components/utils/ContentEditor";
import { useEffect, useRef, useState } from "react";
import { TripDTO } from "../types/api/trips";
import ColorPicker from "../components/utils/ColorPicker";
import { useNavigate, useParams } from "react-router-dom";
import useHttp from "../hooks/useHttp";
import { API_CALL_URL_BASE } from "../utils/constants";
import ContentLoading from "../components/utils/ContentLoading";
import { Editor } from "@tinymce/tinymce-react";
import PhotoUpload from "../components/utils/PhotoUpload";
import ImagePreview from "../components/utils/ImagePreview";

const EditTrip = () => {
  const [trip, setTrip] = useState<TripDTO | null>(null);
  const [newPhotos, setNewPhotos] = useState<
    { previewUrl: string; file: File }[]
  >([]);
  const originalTrip = useRef<TripDTO | null>(null);
  const [editorLoading, setEditorLoading] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);

  const tripId = useParams<{ id: string }>().id;

  const token = useAppSelector((state) => state.authState.token);
  const userId = useAppSelector((state) => state.authState.userInfo?.userId);

  const navigate = useNavigate();

  const editorRef = useRef<Editor>(null);
  const deletedPhotosIdsRef = useRef<number[]>([]);

  const [getTrip] = useHttp(
    `${API_CALL_URL_BASE}/get-trip/${tripId}${
      userId ? `?userId=${userId}` : ""
    }`
  );

  function handleTripResponse(response: Response) {
    if (!response.ok) {
      const error = new Error("Wystąpił błąd podczas pobierania trasy");
      throw error;
    }
    return response.json().then((data: TripDTO) => {
      setTrip(data);
      originalTrip.current = structuredClone(data);
    });
  }

  function handleTripError(error: Error) {
    console.error(error);
  }

  useEffect(() => {
    getTrip(handleTripResponse, handleTripError, {
      method: "GET",
      headers: { Authorization: token },
    });
  }, []);

  const [editTrip, isEditLoading] = useHttp(`${API_CALL_URL_BASE}/edit-trip`);

  function handleEditTripResponse(response: Response) {
    if (!response.ok) {
      const error = new Error("Wystąpił błąd podczas edycji trasy");
      throw error;
    }
    return response.json().then(() => {
      navigate(`/wycieczka/${tripId}`);
    });
  }

  function handleEditTripError(error: Error) {
    console.error(error);
  }

  if (!tripId) return null;

  return (
    <div className="container main">
      <PageHeader
        title="Edytuj wycieczkę"
        icon={<Edit />}
        endElement={
          <Button
            variant="outlined"
            onClick={() => {
              navigate(`/wycieczka/${tripId}`);
            }}
            endIcon={<ChevronRight />}
          >
            Przejdź do wycieczki
          </Button>
        }
      />
      {trip ? (
        <div className="row">
          <div className="col-12 mb-4">
            <TextField
              value={trip.name}
              onChange={(e) => {
                setTrip((prev) => {
                  return { ...prev!!, name: e.target.value };
                });
              }}
              onBlur={() => {
                setShowTitleError(true);
              }}
              onFocus={() => {
                setShowTitleError(false);
              }}
              label="Tytuł"
              variant="outlined"
              fullWidth
              error={showTitleError && trip.name == ""}
              helperText={
                showTitleError && trip.name == ""
                  ? "Tytuł nie może być pusty"
                  : " "
              }
            />
          </div>
          <div className="col-12 mb-4">
            <ContentEditor
              ref={editorRef}
              initialValue={trip.description}
              isLoading={editorLoading}
              onInit={() => {
                setEditorLoading(false);
              }}
              height={500}
            />
          </div>
          <div className="col-12 col-md-5 offset-md-1 mb-4">
            <div className="color-picker-row">
              <h4>Wybierz kolor trasy</h4>
              <ColorPicker
                color={trip?.color || "#ff0000"}
                onChange={(color) => {
                  setTrip((prev) => {
                    return { ...prev!!, color };
                  });
                }}
              />
            </div>
          </div>
          <div className="col-12 col-md-5 mb-5">
            <FormControlLabel
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
              className="trip-public-checkbox"
              disableTypography
              control={
                <Checkbox
                  checked={trip.public}
                  name="isPublic"
                  onChange={(_, checked) => {
                    setTrip((prev) => {
                      return { ...prev!!, public: checked };
                    });
                  }}
                />
              }
              label="Trasa publiczna"
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4 offset-md-3 offset-lg-4 mb-5">
            <PhotoUpload
              onChange={(photos) => {
                setNewPhotos((prevValue) => {
                  return [
                    ...prevValue,
                    ...Array.from(photos).map((photo) => {
                      return {
                        previewUrl: URL.createObjectURL(photo),
                        file: photo,
                      };
                    }),
                  ];
                });
              }}
            />
          </div>
          <ul className="col-12">
            <div className="row">
              {trip.images.map((image, index) => {
                return (
                  <li
                    key={index}
                    className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
                  >
                    <ImagePreview
                      url={`${API_CALL_URL_BASE}${image.path}`}
                      onDelete={() => {
                        deletedPhotosIdsRef.current.push(image.id);
                        setTrip((prevValue) => {
                          if (!prevValue) return null;
                          const copy = { ...prevValue };
                          copy.images.splice(index, 1);
                          return copy;
                        });
                      }}
                    />
                  </li>
                );
              })}
              {newPhotos.map((photo, index) => {
                return (
                  <li
                    key={index}
                    className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
                  >
                    <ImagePreview
                      url={photo.previewUrl}
                      onDelete={() => {
                        setNewPhotos((prevValue) => {
                          const copy = [...prevValue];
                          copy.splice(index, 1);
                          return copy;
                        });
                      }}
                    />
                  </li>
                );
              })}
            </div>
          </ul>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 offset-md-2 offset-lg-3 my-5">
            <Button
              fullWidth
              variant="contained"
              disabled={isEditLoading || trip.name == ""}
              startIcon={<Save />}
              onClick={() => {
                if (isEditLoading || trip.name == "") return;
                const editorContent = editorRef.current?.editor?.getContent();
                if (!editorContent) return;
                const formData = new FormData();
                formData.append("id", trip.id);
                formData.append("name", trip.name);
                formData.append("description", editorContent);
                formData.append("color", trip.color);
                formData.append("public", trip.public.toString());
                deletedPhotosIdsRef.current.forEach((id) => {
                  formData.append("deletedImagesIds", id.toString());
                });
                newPhotos.forEach((photo) => {
                  formData.append("images", photo.file);
                });
                editTrip(handleEditTripResponse, handleEditTripError, {
                  method: "POST",
                  headers: {
                    Authorization: token,
                  },
                  body: formData,
                });
              }}
            >
              zapisz
            </Button>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 my-5">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setTrip(structuredClone(originalTrip.current));
                setNewPhotos([]);
              }}
            >
              <Close /> cofnij zmiany
            </Button>
          </div>
        </div>
      ) : (
        <ContentLoading />
      )}
    </div>
  );
};

export default EditTrip;
