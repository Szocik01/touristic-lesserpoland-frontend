import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { ChangeEvent, FC, useState, FocusEvent } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type AuthFormProps = {
  values: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    userName?: string;
    rememberMe?: boolean;
  };
  valueErrors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    userName?: string;
  };
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const AuthFormInputs: FC<AuthFormProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [canDisplayValueError, setCanDisplayValueError] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    userName: false,
  });

  const { values, valueErrors, onChange } = props;

  function unsetErrorVisibilityHandler(event: FocusEvent<HTMLInputElement>) {
    setCanDisplayValueError((prevValue) => {
      return { ...prevValue, ...{ [event.target.name]: false } };
    });
  }
  function setErrorVisibilityHandler(event: FocusEvent<HTMLInputElement>) {
    setCanDisplayValueError((prevValue) => {
      return { ...prevValue, ...{ [event.target.name]: true } };
    });
  }

  const showPasswordHandler = () => setShowPassword((prevState) => !prevState);
  const showConfirmPasswordHandler = () =>
    setShowConfirmPassword((prevState) => !prevState);
  return (
    <>
      {values.email !== undefined && (
        <TextField
          fullWidth
          name="email"
          type="text"
          variant="outlined"
          label="E-mail"
          value={values.email}
          helperText={
            canDisplayValueError.email && valueErrors.email
              ? valueErrors.email
              : " "
          }
          error={canDisplayValueError.email && !!valueErrors.email}
          onChange={onChange}
          onFocus={unsetErrorVisibilityHandler}
          onBlur={setErrorVisibilityHandler}
        />
      )}
      {values.password !== undefined && (
        <FormControl
          fullWidth
          variant="outlined"
          error={canDisplayValueError.password && !!valueErrors.password}
        >
          <InputLabel htmlFor="password">Hasło</InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            value={values.password}
            type={showPassword ? "text" : "password"}
            onChange={onChange}
            onFocus={unsetErrorVisibilityHandler}
            onBlur={setErrorVisibilityHandler}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={showPasswordHandler}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <FormHelperText>
            {canDisplayValueError.password && valueErrors.password
              ? valueErrors.password
              : " "}
          </FormHelperText>
        </FormControl>
      )}
      {values.confirmPassword !== undefined && (
        <FormControl
          fullWidth
          variant="outlined"
          error={
            canDisplayValueError.confirmPassword &&
            !!valueErrors.confirmPassword
          }
        >
          <InputLabel htmlFor="confirm-password">Powtórz hasło</InputLabel>
          <OutlinedInput
            id="confirm-password"
            name="confirmPassword"
            value={values.confirmPassword}
            type={showConfirmPassword ? "text" : "password"}
            onChange={onChange}
            onFocus={unsetErrorVisibilityHandler}
            onBlur={setErrorVisibilityHandler}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm-password visibility"
                  onClick={showConfirmPasswordHandler}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm password"
          />
          <FormHelperText>
            {canDisplayValueError.confirmPassword && valueErrors.confirmPassword
              ? valueErrors.confirmPassword
              : " "}
          </FormHelperText>
        </FormControl>
      )}
      {values.userName !== undefined && (
        <TextField
          fullWidth
          name="userName"
          type="text"
          variant="outlined"
          label="Nazwa użytkownika"
          value={values.userName}
          error={canDisplayValueError.userName && !!valueErrors.userName}
          helperText={
            canDisplayValueError.userName && valueErrors.userName
              ? valueErrors.userName
              : " "
          }
          onChange={onChange}
          onFocus={unsetErrorVisibilityHandler}
          onBlur={setErrorVisibilityHandler}
        />
      )}
      {values.rememberMe !== undefined && (
        <FormControlLabel
          control={
            <Checkbox
              checked={values.rememberMe}
              name="rememberMe"
              onChange={onChange}
            />
          }
          label="Zapamiętaj mnie"
        />
      )}
    </>
  );
};

export default AuthFormInputs;
