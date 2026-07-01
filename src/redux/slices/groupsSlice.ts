import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Group {
  id: string;
  name: string;
  category: string;
  avatarUrl: string;
  isJoined: boolean;
  membersCount: number;
}

interface GroupsState {
  list: Group[];
  loading: boolean;
  error: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001/api";

const initialState: GroupsState = {
  list: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(`${API_BASE}/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch groups");
      }
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error fetching groups");
    }
  }
);

export const toggleJoinGroup = createAsyncThunk(
  "groups/toggleJoinGroup",
  async (groupId: string, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(`${API_BASE}/groups/${groupId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to toggle group join");
      }
      return { groupId, isJoined: data.isJoined };
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error toggling group join");
    }
  }
);

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Groups
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle Join Group
      .addCase(toggleJoinGroup.fulfilled, (state, action) => {
        const { groupId, isJoined } = action.payload;
        const group = state.list.find((g) => g.id === groupId);
        if (group) {
          group.isJoined = isJoined;
          if (isJoined) {
            group.membersCount += 1;
          } else {
            group.membersCount -= 1;
          }
        }
      });
  },
});

export default groupsSlice.reducer;
