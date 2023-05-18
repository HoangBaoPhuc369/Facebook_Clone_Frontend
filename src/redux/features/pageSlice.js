import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: localStorage.getItem("pageSite")
    ? JSON.parse(localStorage.getItem("pageSite"))
    : "home",
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPage: (state, action) => {
      localStorage.setItem("pageSite", JSON.stringify(action.payload));
      state.page = action.payload;
    },
  },
});

export const { setPage } = pageSlice.actions;

export default pageSlice.reducer;
