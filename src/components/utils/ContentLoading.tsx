import { FC } from "react";
import { CircularProgress } from "@mui/material";

type ContentLoadingProps = {
  coverParent?: boolean;
  blurOverlay?: boolean;
  cssClass?: string;
  color?: string;
};

const ContentLoading: FC<ContentLoadingProps> = (props) => {
  const { coverParent, blurOverlay, cssClass, color } = props;
  return (
    <div
      className={`loading-container ${coverParent ? "cover-parent" : ""} ${
        blurOverlay ? "blur-overlay" : ""
      } ${cssClass ? cssClass : ""}`}
    >
      <CircularProgress sx={{ color: color ? color : "black" }} />
    </div>
  );
};

export default ContentLoading;
