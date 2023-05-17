import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import * as api from "../api";

const initialState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socketIO",
  initialState,
  reducers: {
    getSocket: (state, action) => {
      state.socket = action.payload;
    },
    // clearNewNotifications: (state, action) => {
    //   state.newNotifications = [];
    //   Cookies.set("notification", JSON.stringify([]));
    // },
  },
});

// Action creators are generated for each case reducer function
export const { getSocket } = socketSlice.actions;

export default socketSlice.reducer;
