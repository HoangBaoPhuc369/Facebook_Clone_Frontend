import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

const initialState = {
  darkTheme: "",
};

export const changeTheme = createAsyncThunk(
  "theme/changeTheme",
  async ({ theme, userToken }, { rejectWithValue }) => {
    try {
      const { data } = await api.changeTheme(theme, userToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDarkTheme: (state, action) => {
      state.darkTheme = action.payload;
    },
    setLightTheme: (state, action) => {
      state.darkTheme = action.payload;
    },
  },
  extraReducers: {
    [changeTheme.fulfilled]: (state, action) => {
      state.darkTheme = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDarkTheme, setLightTheme } = themeSlice.actions;

export default themeSlice.reducer;
