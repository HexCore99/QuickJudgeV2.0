import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, signupApi } from "./authApi";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkApi) => {
    try {
      const response = await loginApi(credentials);

      localStorage.setItem("qj_token", response.token);
      localStorage.setItem("qj_user", JSON.stringify(response.user));

      return response;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.message || "Login failed. Please try again.",
      );
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (payload, thunkApi) => {
    try {
      const response = await signupApi(payload);

      localStorage.setItem("qj_token", response.token);
      localStorage.setItem("qj_user", JSON.stringify(response.user));

      return response;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.message || "Signup failed. Please try again.",
      );
    }
  },
);
