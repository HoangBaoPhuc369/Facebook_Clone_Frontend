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


const initialState = {
  reacts: null,
  newNotifications: Cookies.get("notification")
    ? JSON.parse(Cookies.get("notification"))
    : [],
  error: "",
  loading: false,
};

export const reactSlice = createSlice({
  name: "reacts",
  initialState,
  reducers: {
    // getNewNotifications: (state, action) => {
    //   state.newNotifications.push(action.payload.senderId);
    //   Cookies.set("notification", JSON.stringify([...state.newNotifications]));
    // },
    // clearNewNotifications: (state, action) => {
    //   state.newNotifications = [];
    //   Cookies.set("notification", JSON.stringify([]));
    // },
  },
  extraReducers: {
    [createNotifications.fulfilled]: (state, action) => {
      state.error = "";
    },
    [createNotifications.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },
  },
});

// Action creators are generated for each case reducer function
// export const { getNewNotifications, clearNewNotifications } =
//   reactSlice.actions;

export default reactSlice.reducer;
