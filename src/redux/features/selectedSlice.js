import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

const initialState = {
  selectAudience: "public",
};

export const selectedSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setSelectedAudience: (state, action) => {
      state.selectAudience = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedAudience } = selectedSlice.actions;

export default selectedSlice.reducer;
