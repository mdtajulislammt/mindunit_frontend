import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  headline: string;
  connectionsCount: number;
}

interface AuthState {
  currentUser: User | null;
  token: string | null;
  users: User[]; // directory list
  error: string | null;
  loading: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001/api";

const initialState: AuthState = {
  currentUser: null,
  token: null,
  users: [],
  error: null,
  loading: false,
};

// Async Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    payload: { firstName: string; lastName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Registration failed");
      }
      return data; // contains user, token, accessToken
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error during registration");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    payload: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Login failed");
      }
      return data; // contains user, token, accessToken
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error during login");
    }
  }
);

export const fetchDirectory = createAsyncThunk(
  "auth/fetchDirectory",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(`${API_BASE}/users/directory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch directory");
      }
      return data; // returns user list
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error fetching directory");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.users = [];
      state.error = null;
      state.loading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    updateCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.accessToken || action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.accessToken || action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Directory
      .addCase(fetchDirectory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDirectory.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchDirectory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser, clearAuthError, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;
