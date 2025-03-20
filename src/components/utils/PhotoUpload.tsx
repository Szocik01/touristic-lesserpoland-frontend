import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { ChangeEvent, DragEventHandler, FC, useRef, useState } from "react";

type PhotoUploadProps = {
  textUnderDropbox?: string;
  onChange: (file: FileList) => void;
  // onImageDelete?: () => void;
};

const PhotoUpload: FC<PhotoUploadProps> = (props) => {
  const [isDraggedOver, setDraggedOver] = useState(false);

  const dropZoneLabelRef = useRef<HTMLLabelElement>(null);
  const { textUnderDropbox, onChange } = props;

  const dragoverImageHandler: DragEventHandler<HTMLLabelElement> = (event) => {
    event.preventDefault();
    setDraggedOver(true);
  };

  const dragLeaveImageHandler: DragEventHandler<HTMLLabelElement> = (event) => {
    event.preventDefault();
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (
      dropZoneLabelRef.current === null ||
      relatedTarget === null ||
      relatedTarget.closest("label") !== dropZoneLabelRef.current
    ) {
      setDraggedOver(false);
    }
  };

  const dropImageHandler: DragEventHandler<HTMLLabelElement> = (event) => {
    event.preventDefault();
    setDraggedOver(false);
    if (event.dataTransfer === null) {
      return;
    }
    const files = event.dataTransfer.files;
    onChange(files);
  };

  function setImageFileHandler(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files === null) {
      return;
    }
    const files = event.target.files;
    onChange(files);
  }

  return (
    <div className="drop-zone-container">
      <>
        <label
          className={`drop-zone ${isDraggedOver ? "drop-zone-dragged" : ""}`}
          onDragOver={dragoverImageHandler}
          onDrop={dropImageHandler}
          onDragLeave={dragLeaveImageHandler}
          ref={dropZoneLabelRef}
        >
          <ImageIcon sx={{ width: "40%", height: "40%" }} />
          <span>Dodaj zdjęcia</span>
          <input
            className="input-hidden"
            type="file"
            onChange={setImageFileHandler}
            multiple
          />
        </label>
        {textUnderDropbox && (
          <span className="error-info">{textUnderDropbox}</span>
        )}
      </>

    </div>
  );
};

export default PhotoUpload;
