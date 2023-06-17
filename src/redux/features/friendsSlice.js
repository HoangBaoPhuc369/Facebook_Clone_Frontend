import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import * as api from "../api";

export const getFriendsPage = createAsyncThunk(
  "friends/getFriendsPage",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await api.getFriendsPageInfos(token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const cancelRequest = createAsyncThunk(
  "friends/cancelRequest",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.cancelRequest(userId, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const acceptRequest = createAsyncThunk(
  "friends/acceptRequest",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.acceptRequest(userId, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteRequest = createAsyncThunk(
  "friends/deleteRequest",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.deleteRequest(userId, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  friends: null,
  loading: false,
  error: null,
};

export const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {},
  extraReducers: {
    [getFriendsPage.pending]: (state, action) => {
      state.loading = true;
    },
    [getFriendsPage.fulfilled]: (state, action) => {
      state.loading = false;
      state.friends = action.payload;
      state.error = null;
    },
    [getFriendsPage.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [cancelRequest.fulfilled]: (state, action) => {
      state.friends = action.payload;
      state.error = null;
    },
    [cancelRequest.rejected]: (state, action) => {
      state.error = action.payload;
    },


    [acceptRequest.fulfilled]: (state, action) => {
      state.friends = action.payload;
      state.error = null;
    },
    [acceptRequest.rejected]: (state, action) => {
      state.error = action.payload;
    },


    [deleteRequest.fulfilled]: (state, action) => {
      state.friends = action.payload;
      state.error = null;
    },
    [deleteRequest.rejected]: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedAudience } = friendsSlice.actions;

export default friendsSlice.reducer;
