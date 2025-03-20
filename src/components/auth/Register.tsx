import { ChangeEvent, useCallback, useState } from "react";
import AuthFormInputs from "./AuthInputsForm";
import Validators from "../../utils/validators";
import { Button } from "@mui/material";
import useHttp from "../../hooks/useHttp";
import { API_CALL_URL_BASE } from "../../utils/constants";
import { SignUpBody, SignUpReponse } from "../../types/api/user";
import { useAppDispatch } from "../../redux/store";
import { authSliceActions } from "../../redux/authSlice";
import setSingleCookie from "../../utils/setSingleCookie";

type RegisterProps = {
  onChangeToLoginViewClick: () => void;
};

const Register = (props: RegisterProps) => {
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [httpError, setHttpError] = useState("");

  const { onChangeToLoginViewClick } = props;

  const dispatch = useAppDispatch();

  const [sendRegisterRequest, isLoading] = useHttp(
    `${API_CALL_URL_BASE}/auth/signup`
  );

  const handleRegisterResponse = useCallback((response: Response) => {
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Brak wymaganych pól");
      }
      throw new Error("Nie udało się zarejestrować");
    }
    return response.json().then((data: SignUpReponse) => {
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 2);
      setSingleCookie("token", data.token, expirationDate.toUTCString());
      setSingleCookie("userId", data.userId.toString(),expirationDate.toUTCString());   
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

  const handleRegisterError = useCallback((error: Error) => {
    setHttpError(error.message);
  }, []);

  const emailError = Validators.validateEmail(registerData.email);
  const passwordError = Validators.validatePassword(registerData.password);
  const confirmPasswordError = Validators.validateConfirmPassword(
    registerData.password,
    registerData.confirmPassword
  );

  return (
    <form
      className="auth-form"
      onSubmit={(event) => {
        event.preventDefault();
        const requestBody: SignUpBody = {
          email: registerData.email,
          password: registerData.password,
          userName: registerData.email,
        };
        sendRegisterRequest(handleRegisterResponse, handleRegisterError, {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }}
    >
      <AuthFormInputs
        values={registerData}
        valueErrors={{
          email: emailError,
          password: passwordError,
          confirmPassword: confirmPasswordError,
        }}
        onChange={function (event) {
          const { name, value, checked } = event.target;
          setRegisterData((prevData) => {
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
        disabled={
          emailError !== "" ||
          passwordError !== "" ||
          confirmPasswordError !== ""
        }
        variant="contained"
        type="submit"
      >
        Zarejestruj się
      </Button>
      <span className="toggle-dialog-text">
        Jeśli posiadasz już konto{" "}
        <button onClick={onChangeToLoginViewClick}>zaloguj się</button>
      </span>
    </form>
  );
};

export default Register;
