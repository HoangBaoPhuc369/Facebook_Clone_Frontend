import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomSocketId: null,
  localStream: null,
  callState: "CALL_AVAILABLE",
  callingDialogVisible: false,
  callerUser: {
    username: "",
    picture: "",
    roomId: null,
  },
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
    setRoomSocketId: (state, action) => {
      state.roomSocketId = action.payload;
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },

    setCallState: (state, action) => {
      state.callState = action.payload;
    },

    setCallingDialogVisible: (state, action) => {
      state.callingDialogVisible = action.payload;
    },

    setCallerUser: (state, action) => {
      state.callerUser = action.payload;
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

    getCallUser: (state, action) => {
      state.callUser = action.payload;
    },

    clearGroupCallData: (state, action) => {
      state.groupCallActive = false;
      state.groupCallStreams = [];
      state.callState = "CALL_AVAILABLE";
      state.localMicrophoneEnabled = true;
      state.localCameraEnabled = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setRoomSocketId,
  getCallUser,
  setLocalStream,
  setCallState,
  setCallingDialogVisible,
  setCallerUser,
  setCallRejected,
  setRemoteStream,
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
  setScreenSharingActive,
  setGroupCallActive,
  setGroupCallStreams,
  clearGroupCallData,
} = callSlice.actions;

export default callSlice.reducer;
