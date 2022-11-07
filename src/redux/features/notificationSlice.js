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
        console.log(userToken);
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
  notification: null,
  error: "",
  loading: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // setLogout: (state, action) => {
    //   state.user = null;
    //   Cookies.set("user", "");
    // },
    // updatePicture: (state, action) => {
    //   state.user.picture = action.payload;
    //   Cookies.set(
    //     "user",
    //     JSON.stringify({
    //       ...state.user,
    //       picture: action.payload,
    //     })
    //   );
    // },
  },
  extraReducers: {
    [getNotification.pending]: (state, action) => {
      state.loading = true;
    },
    [getNotification.fulfilled]: (state, action) => {
      state.loading = false;
      state.notification = action.payload;
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
      state.notification = [action.payload, ...state.notification];
      state.error = "";
    },
    [seenNotification.rejected]: (state, action) => {
      state.error = action.payload.message;
    },
  },
});

// Action creators are generated for each case reducer function
// export const { setLogout, updatePicture } = notificationSlice.actions;

export default notificationSlice.reducer;
