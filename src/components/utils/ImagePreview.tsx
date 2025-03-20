import { Delete } from "@mui/icons-material";
import { Button } from "@mui/material";

type ImagePreviewProps = {
  url: string;
  onDelete: () => void;
};

const ImagePreview = (props: ImagePreviewProps) => {
  const { onDelete, url } = props;

  return (
    <div className={`image-preview-container`}>
      <img src={url} loading="lazy" />
      <Button
        type="button"
        variant="contained"
        color="error"
        sx={{
          minWidth: "auto",
          minHeight: "auto !important",
          width: "1.7rem",
          height: "1.7rem",
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "3px",
          right: "3px",
        }}
        onClick={onDelete}
      >
        <Delete sx={{ width: "90%", height: "90%", color: "white" }} />
      </Button>
    </div>
  );
};

export default ImagePreview;
