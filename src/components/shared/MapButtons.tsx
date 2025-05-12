import { Add, Remove } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useMap } from "react-map-gl";

const buttonStyle = {
  backgroundColor: "white",
  boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.2)",
  borderRadius: "50%",
  aspectRatio: "1",
  minWidth: "42px",
  hover: {
    backgroundColor: "white",
    color: "red",
  },
};

const MapButtons = () => {
  const maps = useMap();
  const map = Object.values(maps)[0];

  console.log("MapButtons", maps);

  console.log("MapButtons", map);
  return (
    <div className="map-buttons-container">
      {map && (
        <Button sx={buttonStyle} onClick={() => map.zoomIn()}>
          <Add />
        </Button>
      )}
      {map && (
        <Button sx={buttonStyle} onClick={() => map.zoomOut()}>
          <Remove />
        </Button>
      )}
    </div>
  );
};

export default MapButtons;
