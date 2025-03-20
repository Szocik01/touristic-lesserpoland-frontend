import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInfo = {
  userId: string;
  userName: string;
};

type AuthSliceState = {
  token: string;
  userInfo?: UserInfo;
  authDialogOpen: boolean;
  isLogin: boolean;
  userStateLoaded: boolean;
};

const initialState: AuthSliceState = {
  authDialogOpen: false,
  isLogin: false,
  token: "",
  userStateLoaded: false,
  userInfo: {
    userId: "",
    userName: "",
  },
};

const authSlice = createSlice({
  name: "Auth slice",
  initialState,
  reducers: {
    addLoggedUserData: (
      state,
      action: PayloadAction<{ token: string; userId: string; userName: string, userStateLoaded: boolean }>
    ) => {
      state.token = action.payload.token;
      state.userStateLoaded = action.payload.userStateLoaded;
      state.userInfo = {
        userId: action.payload.userId,
        userName: action.payload.userName,
      };
    },

    updateUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },

    addUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    setUserDataLoaded: (state) => {
      state.userStateLoaded = true;
    },

    deleteUserData: (state) => {
      state.token = "";
      state.userInfo = undefined;
    },

    openLoginDialog: (state) => {
      state.authDialogOpen = true;
      state.isLogin = true;
    },

    openRegisterDialog: (state) => {
      state.authDialogOpen = true;
      state.isLogin = false;
    },

    closeAuthDialog: (state) => {
      state.authDialogOpen = false;
    },
  },
});

export { type AuthSliceState as UserSliceState };
export const authSliceActions = authSlice.actions;
export default authSlice.reducer;
