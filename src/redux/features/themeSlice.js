import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  darkTheme: Cookies.get("darkTheme")
    ? JSON.parse(Cookies.get("darkTheme"))
    : false,
};

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
});

// Action creators are generated for each case reducer function
export const { setDarkTheme, setLightTheme } = themeSlice.actions;

export default themeSlice.reducer;
