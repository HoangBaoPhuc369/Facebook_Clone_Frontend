import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import Cookies from "js-cookie";
// import * as api from "../api";

// export const createNotifications = createAsyncThunk(
//   "notification/createNotifications",
//   async ({ props, token }, { rejectWithValue }) => {
//     try {
//       console.log(props);
//       const { data } = await api.createNotifications(props, token);
//       return data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

const initialState = {
  // username: '',
  activeUsers: [],
  groupCallRooms: []
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // setUsername: (state, action) => {
    //   state.username = action.payload;
    // },

    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },

    setGroupCallRooms: (state, action) => {
      state.groupCallRooms = action.payload;
    }
    
  },
  //   extraReducers: {
  //     [createNotifications.fulfilled]: (state, action) => {
  //       state.error = "";
  //     },
  //     [createNotifications.rejected]: (state, action) => {
  //       state.error = action.payload?.message;
  //     },
  //   },
});

// Action creators are generated for each case reducer function
export const { setUsername, setActiveUsers, setGroupCallRooms } = dashboardSlice.actions;

export default dashboardSlice.reducer;
