import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import * as api from "../api";

export const createNotifications = createAsyncThunk(
  "notification/createNotifications",
  async ({ props, token }, { rejectWithValue }) => {
    try {
      console.log(props);
      const { data } = await api.createNotifications(props, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getNotification = createAsyncThunk(
  "notification/getNotification",
  async ({ userToken }, { rejectWithValue }) => {
    try {
      const { data } = await api.getNotification(userToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const seenNotification = createAsyncThunk(
  "notification/seenNotification",
  async ({ userToken, nofId }, { rejectWithValue }) => {
    try {
      const { data } = await api.seenNotification(userToken, nofId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  notifications: null,
  newNotifications: Cookies.get("notification")
    ? JSON.parse(Cookies.get("notification"))
    : [],
  error: "",
  loading: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    getNewNotifications: (state, action) => {
      state.newNotifications.push(action.payload.senderId);
      Cookies.set("notification", JSON.stringify([...state.newNotifications]));
    },
    clearNewNotifications: (state, action) => {
      state.newNotifications = [];
      Cookies.set("notification", JSON.stringify([]));
    },
  },
  extraReducers: {
    [getNotification.pending]: (state, action) => {
      state.loading = true;
    },
    [getNotification.fulfilled]: (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
      state.error = "";
    },
    [getNotification.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [createNotifications.fulfilled]: (state, action) => {
      state.error = "";
    },
    [createNotifications.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [seenNotification.fulfilled]: (state, action) => {
      state.notifications = action.payload;
      state.error = "";
    },
    [seenNotification.rejected]: (state, action) => {
      state.error = action.payload.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getNewNotifications, clearNewNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
