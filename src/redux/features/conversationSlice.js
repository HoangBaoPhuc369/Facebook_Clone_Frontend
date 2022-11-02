import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import * as api from "../api";

export const getConversations = createAsyncThunk(
  "conversations/getConversations",
  async ({ userToken }, { rejectWithValue }) => {
    try {
      const { data } = await api.getConversations(userToken);
      if (data) {
        return data;
      } else {
        return null;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const sendMessageChat = createAsyncThunk(
  "conversations/sendMessageChat",
  async ({ userToken, message, currentChatId }, { rejectWithValue }) => {
    try {
      const { data } = await api.sendMessageChat(userToken, message);
      if (data) return { data, currentChatId };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  conversations: null,
  chatBox: Cookies.get("chatBox")
    ? JSON.parse(Cookies.get("chatBox"))
    : { currentChatBox: null, chatBoxVisible: [], chatBoxMinimized: [] },
  error: "",
  loading: false,
};

export const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setChatBox: (state, action) => {
      if (action.payload !== state.chatBox.currentChatBox) {
        if (state.chatBox.currentChatBox === null) {
          state.chatBox.currentChatBox = action.payload;
          state.chatBox.chatBoxVisible = [
            action.payload,
            ...state.chatBox.chatBoxVisible,
          ];
          Cookies.set(
            "chatBox",
            JSON.stringify({
              ...state.chatBox,
              currentChatBox: action.payload,
              chatBoxVisible: [action.payload],
            })
          );
        } else {
          if (state.chatBox.chatBoxVisible.length < 3) {
            Cookies.set(
              "chatBox",
              JSON.stringify({
                ...state.chatBox,
                currentChatBox: action.payload,
                chatBoxVisible: [
                  action.payload,
                  ...state.chatBox.chatBoxVisible,
                ],
              })
            );
            state.chatBox.currentChatBox = action.payload;
            state.chatBox.chatBoxVisible = [
              action.payload,
              ...state.chatBox.chatBoxVisible,
            ];
          } else {
            const getChatBoxMinimized = state.chatBox.chatBoxVisible.pop();

            Cookies.set(
              "chatBox",
              JSON.stringify({
                ...state.chatBox,
                currentChatBox: action.payload,
                chatBoxVisible: [
                  action.payload,
                  ...state.chatBox.chatBoxVisible,
                ],
                chatBoxMinimized: [
                  getChatBoxMinimized,
                  ...state.chatBox.chatBoxMinimized,
                ],
              })
            );
            state.chatBox.currentChatBox = action.payload;
            state.chatBox.chatBoxVisible = [
              action.payload,
              ...state.chatBox.chatBoxVisible,
            ];
            state.chatBox.chatBoxMinimized = [
              getChatBoxMinimized,
              ...state.chatBox.chatBoxMinimized,
            ];
          }
        }
      } else {
        state.chatBox = { ...state.chatBox };
      }
    },
    removeChatBox: (state, action) => {
      if (state.chatBox.chatBoxVisible.length > 1) {
        if (state.chatBox.chatBoxMinimized.length > 0) {
          const getChatBoxMinimized = state.chatBox.chatBoxMinimized.shift();
          const index = state.chatBox.chatBoxVisible.findIndex(
            (i) => i === action.payload
          );
          if (index > -1) {
            state.chatBox.chatBoxVisible.splice(index, 1, getChatBoxMinimized);
            Cookies.set(
              "chatBox",
              JSON.stringify({
                ...state.chatBox,
              })
            );
          }
        } else {
          Cookies.set(
            "chatBox",
            JSON.stringify({
              ...state.chatBox,
              chatBoxVisible: state.chatBox.chatBoxVisible.filter(
                (item) => item !== action.payload
              ),
            })
          );
          state.chatBox.chatBoxVisible = state.chatBox.chatBoxVisible.filter(
            (item) => item !== action.payload
          );
        }
      } else {
        Cookies.set(
          "chatBox",
          JSON.stringify({
            ...state.chatBox,
            currentChatBox: null,
            chatBoxVisible: state.chatBox.chatBoxVisible.filter(
              (item) => item !== action.payload
            ),
          })
        );
        state.chatBox.currentChatBox = null;
        state.chatBox.chatBoxVisible = state.chatBox.chatBoxVisible.filter(
          (item) => item !== action.payload
        );
      }
    },
    getNewFriendMessage: (state, action) => {
      const checkConversation = state.conversations.find(
        (c) => c._id === action.payload.currentChatId
      );

      const indexConversation = state.conversations.findIndex(
        (c) => c._id === action.payload.currentChatId
      );
      if (checkConversation && indexConversation > -1) {
        checkConversation.messages = [
          ...checkConversation.messages,
          action.payload.data,
        ];
        state.conversations.splice(indexConversation, 1, checkConversation);
      }
    },
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
      state.error = action.payload?.message;
    },

    [sendMessageChat.fulfilled]: (state, action) => {
      const checkConversation = state.conversations.find(
        (c) => c._id === action.payload.currentChatId
      );
      const indexConversation = state.conversations.findIndex(
        (c) => c._id === action.payload.currentChatId
      );

      if (checkConversation && indexConversation > -1) {
        checkConversation.messages = action.payload.data.messages;
        state.conversations.splice(indexConversation, 1, checkConversation);
      }
    },
    [sendMessageChat.rejected]: (state, action) => {
      console.log(action.payload?.message);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setChatBox, removeChatBox, getNewFriendMessage } =
  conversationSlice.actions;

export default conversationSlice.reducer;
