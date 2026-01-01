import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { AuthState, User } from "../../type/auth.types";
import authApi from "../../api/auth.api";
import type { AxiosError } from "axios";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
  isLoading: true,
  error: null,
};

export const checkCurrentUser = createAsyncThunk(
  "auth/checkCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getCurrentUser();
      return user;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      return rejectWithValue(
        axiosError.response?.data?.detail || "Auth check failed"
      );
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    {
      username,
      email,
      password,
    }: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const user = await authApi.signup({ username, email, password });
      return user;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      return rejectWithValue(
        axiosError.response?.data?.detail || "Signup failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.login({ email, password });
      return response.user;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      return rejectWithValue(
        axiosError.response?.data?.detail || "Login failed"
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.refreshToken();
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      return rejectWithValue(
        axiosError.response?.data?.detail || "Token refresh failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      return rejectWithValue(
        axiosError.response?.data?.detail || "Logout failed"
      );
    }
  }
);

export const logoutAll = createAsyncThunk(
  "auth/logout_all",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logoutAll();
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      return rejectWithValue(
        axiosError.response?.data?.detail || "Logout_All failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.authChecked = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      });
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.error = null;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        // Still clear user even if API call fails
        state.user = null;
        state.isAuthenticated = false;
      });
    builder.addCase(refreshToken.rejected, (state) => {
      // Token refresh failed, logout user
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError , setError } = authSlice.actions;
export default authSlice.reducer;
