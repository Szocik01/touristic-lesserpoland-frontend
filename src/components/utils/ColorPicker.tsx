import { ClickAwayListener, Popper, Tooltip } from "@mui/material";
import { useState } from "react";
import ContentPanel from "./ContentPanel";

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
};

const colors = [
  { color: "#FF0000", name: "Czerwony" },
  { color: "#FFFF00", name: "Żółty" },
  { color: "#00FF00", name: "Zielony" },
  { color: "#0000FF", name: "Niebieski" },
  { color: "#FFA500", name: "Pomarańczowy" },
  { color: "#800080", name: "Fioletowy" },
  { color: "#00FFFF", name: "Cyjanowy" },
  { color: "#FFC0CB", name: "Różowy" },
  { color: "#FF69B4", name: "Ciepły różowy" },
];

const ColorPicker = (props: ColorPickerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <div className="color-picker-container">
        <button
          className="color-indicator"
          style={{ backgroundColor: props.color }}
          onClick={(event) => {
            setAnchorEl(anchorEl ? null : event.currentTarget);
          }}
        ></button>

        <Popper
          open={!!anchorEl}
          anchorEl={anchorEl}
          placement="bottom"
          sx={{ zIndex: 9999 }}
        >
          <ContentPanel cssClass="color-picker-options">
            {colors.map((color) => {
              return (
                <button
                  title={color.name}
                  key={color.color}
                  style={{ backgroundColor: color.color }}
                  onClick={() => {
                    props.onChange(color.color);
                    setAnchorEl(null);
                  }}
                ></button>
              );
            })}
          </ContentPanel>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default ColorPicker;
