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
  localStream: null,
  callState: "CALL_UNAVAILABLE",
  callingDialogVisible: false,
  callerUsername: "",
  callRejected: {
    rejected: false,
    reason: "",
  },
  remoteStream: null,
  localCameraEnabled: true,
  localMicrophoneEnabled: true,
  screenSharingActive: false,
  groupCallActive: false,
  groupCallStreams: [],
  message: {
    received: false,
    content: "",
  },
};

export const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },

    setCallState: (state, action) => {
      state.callState = action.payload;
    },

    setCallingDialogVisible: (state, action) => {
      state.callingDialogVisible = action.payload;
    },

    setCallerUsername: (state, action) => {
      state.callerUsername = action.payload;
    },

    setCallRejected: (state, action) => {
      state.callRejected = action.payload;
    },

    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
    },

    setLocalCameraEnabled: (state, action) => {
      state.localCameraEnabled = action.payload;
    },

    setLocalMicrophoneEnabled: (state, action) => {
      state.localMicrophoneEnabled = action.payload;
    },

    setScreenSharingActive: (state, action) => {
      state.screenSharingActive = action.payload;
    },

    resetCallState: (state) => {
      state.callingDialogVisible = false;
      state.callerUsername = "";
      state.remoteStream = null;
      state.localCameraEnabled = true;
      state.localMicrophoneEnabled = true;
      state.screenSharingActive = false;
    },

    setGroupCallActive: (state, action) => {
      state.groupCallActive = action.payload;
    },

    setGroupCallStreams: (state, action) => {
      state.groupCallStreams = [...state.groupCallStreams, action.payload];
    },
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
export const {
  setLocalStream,
  setCallState,
  setCallingDialogVisible,
  setCallerUsername,
  setCallRejected,
  setRemoteStream,
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
  setScreenSharingActive,
  setGroupCallActive,
  setGroupCallStreams,
} = callSlice.actions;

export default callSlice.reducer;
