import { ChangeEvent } from "react";
import { authSliceActions } from "../../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import DefaultDialog from "../utils/DefaultDialog";
import AuthFormInputs from "./AuthInputsForm";
import Register from "./Register";
import Login from "./Login";

const AuthDialog = () => {
  const authData = useAppSelector((state) => state.authState);
  const dispatch = useAppDispatch();

  return (
    <DefaultDialog
      open={authData.authDialogOpen}
      onClose={() => {
        dispatch(authSliceActions.closeAuthDialog());
      }}
      fullWidth
      maxWidth="xs"
      title={authData.isLogin ? "Zaloguj się" : "Zarejestruj się"}
    >
      {authData.isLogin ? (
        <Login
          onChangeToRegisterViewClick={() => {
            dispatch(authSliceActions.openRegisterDialog());
          }}
        />
      ) : (
        <Register onChangeToLoginViewClick={
          () => {
            dispatch(authSliceActions.openLoginDialog());
          }
        } />
      )}
    </DefaultDialog>
  );
};

export default AuthDialog;
