import { createSlice } from "@reduxjs/toolkit";
import { loginUser, signupUser } from "./authThunks";

function readStoredAuth() {
  const token = localStorage.getItem("qj_token");
  const userString = localStorage.getItem("qj_user");

  if (!token || !userString) {
    localStorage.removeItem("qj_user");
    localStorage.removeItem("qj_token");
    return { user: null, token: null };
  }

  try {
    return { user: JSON.parse(userString), token };
  } catch {
    localStorage.removeItem("qj_user");
    localStorage.removeItem("qj_token");
    return { user: null, token: null };
  }
}

const storedAuth = readStoredAuth();

const initialState = {
  user: storedAuth.user,
  token: storedAuth.token,
  isAuthenticated: Boolean(storedAuth.user && storedAuth.token),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      localStorage.removeItem("qj_user");
      localStorage.removeItem("qj_token");
    },

    clearAuthError(state) {
      state.error = null;
    },

    updateAuthUser(state, action) {
      if (!state.user) return;

      state.user = {
        ...state.user,
        ...action.payload,
      };

      localStorage.setItem("qj_user", JSON.stringify(state.user));
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      })

      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Signup failed";
      });
  },
});

export const { logout, clearAuthError, updateAuthUser } = authSlice.actions;

export default authSlice.reducer;
