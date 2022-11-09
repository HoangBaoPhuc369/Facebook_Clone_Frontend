import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import * as api from "../api";

export const getProfile = createAsyncThunk(
  "notification/getProfile",
  async (
    { userName, token, path, sort, max, navigate },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.getProfile(userName, token);
      if (!data) {
        navigate("/profile");
      }
      const images = await api.getPhotos(path, sort, max, token);
      return { data, images: images.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  profile: {},
  photos: {},
  error: "",
  loading: false,
};

export const profileSlice = createSlice({
  name: "profile",
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
    [getProfile.pending]: (state, action) => {
      state.loading = true;
    },
    [getProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload.data;
      state.photos = action.payload.images;
      state.error = "";
    },
    [getProfile.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },
  },
});

// Action creators are generated for each case reducer function
// export const { getNewNotifications, clearNewNotifications } =
//   profileSlice.actions;

export default profileSlice.reducer;
