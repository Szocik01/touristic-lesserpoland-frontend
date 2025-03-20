import { Button, IconButton, Tooltip } from "@mui/material";
import { TripTypes } from "../../types/api/trips";
import ContentLoading from "../utils/ContentLoading";

type SelectableButtonProps = {
  icon: React.ReactNode;
  tooltipTitle?: string;
  onClick: (value: any) => void;
  isActive?: boolean;
  disabled?: boolean;
  value?: any;
  cssClass?: string;
  isLoading?: boolean;
  elevated?: boolean;
};

const SelectableButton = (props: SelectableButtonProps) => {
  const { icon, tooltipTitle, onClick, isActive, cssClass, isLoading, disabled, elevated } = props;
  return (
    <Tooltip
      title={tooltipTitle}
      placement="bottom"
      onClick={() => {
        onClick(props?.value);
      }}
    >
      <IconButton
        className={`selectable-button ${cssClass ? cssClass : ""} ${
          isActive ? "active" : ""
        } ${elevated ? "elevated" : ""}`}
        disabled={disabled}
      >
        {isLoading ===true ? <ContentLoading color="white"/> : icon}
      </IconButton>
    </Tooltip>
  );
};

export default SelectableButton;
