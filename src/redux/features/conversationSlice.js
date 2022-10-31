import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import * as api from "../api";

export const getConversations = createAsyncThunk(
  "conversations/getConversations",
  async ({ userToken }, { rejectWithValue }) => {
    try {
      const { data } = await api.getConversations(userToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  conversations: null,
  chatBox: Cookies.get("chatBox") ? JSON.parse(Cookies.get("chatBox")) : [],
  error: "",
  loading: false,
};

export const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setChatBox: (state, action) => {
      if (!state.chatBox.includes(action.payload)) {
        Cookies.set(
          "chatBox",
          JSON.stringify([action.payload, ...state.chatBox])
        );
        state.chatBox = [action.payload, ...state.chatBox];
      }else {
        state.chatBox = [...state.chatBox]
      }
    },
    removeChatBox: (state, action) => {
      Cookies.set(
        "chatBox",
        JSON.stringify(state.chatBox.filter((item) => item !== action.payload))
      );
      state.chatBox = state.chatBox.filter((item) => item !== action.payload);
    }
  },
  extraReducers: {
    [getConversations.pending]: (state, action) => {
      state.loading = true;
    },
    [getConversations.fulfilled]: (state, action) => {
      state.loading = false;
      state.conversations = action.payload;
      state.error = "";
    },
    [getConversations.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setChatBox, removeChatBox } = conversationSlice.actions;

export default conversationSlice.reducer;
