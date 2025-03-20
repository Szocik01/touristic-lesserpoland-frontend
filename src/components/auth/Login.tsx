import { ChangeEvent, useCallback, useState } from "react";
import AuthFormInputs from "./AuthInputsForm";
import Validators from "../../utils/validators";
import { Button } from "@mui/material";
import { useAppDispatch } from "../../redux/store";
import useHttp from "../../hooks/useHttp";
import { API_CALL_URL_BASE } from "../../utils/constants";
import { LoginBody, LoginResponse } from "../../types/api/user";
import setSingleCookie from "../../utils/setSingleCookie";
import { authSliceActions } from "../../redux/authSlice";

type LoginProps = {
  onChangeToRegisterViewClick: () => void;
};

const Login = (props: LoginProps) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [httpError, setHttpError] = useState("");

  const { onChangeToRegisterViewClick } = props;

  const dispatch = useAppDispatch();

  const [sendLoginRequest, isLoading] = useHttp(
    `${API_CALL_URL_BASE}/auth/login`
  );

  const handleLoginResponse = useCallback((response: Response) => {
    if (!response.ok) {
      throw new Error("Nie udało się zalogować");
    }
    return response.json().then((data: LoginResponse) => {
      const expirationDate = new Date();
      if (data.rememberMe) {
        expirationDate.setDate(expirationDate.getDate() + 7);
      } else {
        expirationDate.setHours(expirationDate.getHours() + 2);
      }
      setSingleCookie("token", data.token, expirationDate.toUTCString());
      setSingleCookie(
        "userId",
        data.userId.toString(),
        expirationDate.toUTCString()
      );
      setSingleCookie("userName", data.userName, expirationDate.toUTCString());
      dispatch(
        authSliceActions.addLoggedUserData({
          token: data.token,
          userId: data.userId.toString(),
          userName: data.userName,
          userStateLoaded: true,
        })
      );
      dispatch(authSliceActions.closeAuthDialog());
    });
  }, []);

  const handleLoginError = useCallback((error: Error) => {
    setHttpError(error.message);
  }, []);

  const emailError = Validators.validateEmail(loginData.email);
  const passwordError = Validators.validatePassword(loginData.password);

  return (
    <form
      className="auth-form"
      onSubmit={(event) => {
        event.preventDefault();
        const requestBody: LoginBody = {
          email: loginData.email,
          password: loginData.password,
          rememberMe: loginData.rememberMe,
        };
        sendLoginRequest(handleLoginResponse, handleLoginError, {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }}
    >
      <AuthFormInputs
        values={loginData}
        valueErrors={{
          email: emailError,
          password: passwordError,
        }}
        onChange={function (event) {
          const { name, value, checked } = event.target;
          setLoginData((prevData) => {
            return name === "rememberMe"
              ? {
                  ...prevData,
                  rememberMe: checked,
                }
              : {
                  ...prevData,
                  [name]: value,
                };
          });
        }}
      />
      {httpError && <span className="http-error-text">{httpError}</span>}
      <Button
        disabled={emailError !== "" || passwordError !== ""}
        variant="contained"
        type="submit"
      >
        Zaloguj się
      </Button>
      <span className="toggle-dialog-text">
        Jeśli nie posiadasz konta{" "}
        <button onClick={onChangeToRegisterViewClick}>zarejestruj się</button>
      </span>
    </form>
  );
};

export default Login;
