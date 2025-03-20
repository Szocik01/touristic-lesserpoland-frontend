/** @jsxImportSource @emotion/react */

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FC } from "react";

type MuiSelectComponentProps = {
  label?: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  selectValues: { label: string; value: string }[];
  unserializedStyles?: any;
  placeholder?: string;
  cssClass?: string;
  enableBottomHelperText?: boolean;
};

const MuiSelectComponent: FC<MuiSelectComponentProps> = (props) => {
  const { label, value, onChange, selectValues, unserializedStyles, placeholder,cssClass, enableBottomHelperText } = props;

  return (
    <FormControl fullWidth sx={unserializedStyles} className={cssClass}>
      {label && <InputLabel id="select-label">{label}</InputLabel>}
      <Select
        MenuProps={{disableScrollLock: true}}
        labelId={label ? "select-label" : undefined}
        value={value}
        label={label ? label : undefined}
        onChange={onChange}
        placeholder={placeholder}
      >
        {selectValues.map((value, index) => {
          return <MenuItem key={index} value={value.value}>{value.label}</MenuItem>;
        })}
      </Select>
      {enableBottomHelperText &&<FormHelperText>{" "}</FormHelperText>}
    </FormControl>
  );
};

export default MuiSelectComponent;
