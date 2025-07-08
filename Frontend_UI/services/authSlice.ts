// src/core/data/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./reduxStore";

interface User {
  userId: number;
  userFullName: string;
  userRoleName: string;
  designation?: string;  

}

interface Permission {
  entity: string;
  isActive: boolean;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  permissions: Permission[]; // Added permissions field
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  permissions: [], // Initialize with an empty array
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        authtoken: string;
        user: User;
        permissions: Permission[];
      }>
    ) => {
      state.token = action.payload.authtoken;
      state.user = action.payload.user;
      state.permissions = action.payload.permissions;
      state.isAuthenticated = true;
      localStorage.setItem("authToken", action.payload.authtoken);
      // localStorage.setItem("userFullName", action.payload.user.userFullName);
      localStorage.setItem(
        "userId",
        action.payload.user.userId?.toString() || ""
      );
      localStorage.setItem(
        "permissions",
        JSON.stringify(action.payload.permissions)
      );
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.permissions = [];
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    },
    setTokenFromStorage: (state) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
    refreshTokenSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("authToken", action.payload);
    },
  },
});

export const {
  loginSuccess,
  logout,
  setTokenFromStorage,
  refreshTokenSuccess,
} = authSlice.actions;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const loggedUser = {
  user: (state: RootState) => state.auth.user,
};

export const selectUserPermissions = (state: RootState) =>
  state.auth.permissions; // Selector for permissions

export default authSlice.reducer;

export type {AuthState} ;
