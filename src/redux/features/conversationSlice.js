import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import * as api from "../api";
import {
  handleCheck,
  handleSetStatusMessage,
} from "../helpers/handleConversation";

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

export const deliveredMessageChat = createAsyncThunk(
  "conversations/deliveredMessageChat",
  async ({ userToken, messageId, currentChatId }, { rejectWithValue }) => {
    try {
      const res = await api.deliveredMessageChat(
        userToken,
        messageId,
        currentChatId
      );

      const data = { messageId, currentChatId };
      if (res) return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const seenMessageChat = createAsyncThunk(
  "conversations/seenMessageChat",
  async ({ userToken, messageId, currentChatId }, { rejectWithValue }) => {
    try {
      const res = await api.seenMessageChat(
        userToken,
        messageId,
        currentChatId
      );

      const data = { messageId, currentChatId };
      if (res) return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const seenAllMessageChat = createAsyncThunk(
  "conversations/seenAllMessageChat",
  async ({ userToken, currentChatId }, { rejectWithValue }) => {
    try {
      const { data } = await api.seenAllMessageChat(userToken, currentChatId);

      return { data, currentChatId };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  conversations: null,
  chatBox: Cookies.get("chatBox")
    ? JSON.parse(Cookies.get("chatBox"))
    : {
        currentChatBox: null,
        chatBoxVisible: [],
        chatBoxMinimized: [],
        chatBoxWaiting: [],
      },
  error: "",
  loading: false,
  messageSendSuccess: false,
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
            if (!state.chatBox.chatBoxVisible.includes(action.payload)) {
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
            }
            // else {
            //   state.chatBox = { ...state.chatBox };
            // }
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
      }
      // else {
      //   state.chatBox = { ...state.chatBox };
      // }
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
        } else if (state.chatBox.currentChatBox === action.payload) {
          state.chatBox.currentChatBox = null;
          state.chatBox.chatBoxVisible = state.chatBox.chatBoxVisible.filter(
            (item) => item !== action.payload
          );

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
      const { checkConversation, indexConversation } = handleCheck({
        conversations: state.conversations,
        currentChatId: action.payload.currentChatId,
        type: "conversation",
      });
      if (checkConversation && indexConversation > -1) {
        checkConversation.messages = [
          ...checkConversation.messages,
          action.payload.data,
        ];
        state.conversations.splice(indexConversation, 1, checkConversation);

        if (state.chatBox.currentChatBox !== action.payload.currentChatId) {
          const index = state.chatBox.chatBoxWaiting.findIndex(
            (i) => i === action.payload.currentChatId
          );
          if (index === -1) {
            state.chatBox.chatBoxWaiting = [
              action.payload.currentChatId,
              ...state.chatBox.chatBoxWaiting,
            ];
            Cookies.set(
              "chatBox",
              JSON.stringify({
                ...state.chatBox,
                chatBoxWaiting: [
                  ...state.chatBox.chatBoxWaiting,
                  action.payload,
                ],
              })
            );
          }
        }
      }
    },

    clearMessageSuccess: (state, action) => {
      state.messageSendSuccess = false;
    },

    setCurrentChatBox: (state, action) => {
      state.chatBox.currentChatBox = action.payload;
      Cookies.set(
        "chatBox",
        JSON.stringify({
          ...state.chatBox,
          currentChatBox: action.payload,
        })
      );
    },

    setDeliveredMessage: (state, action) => {
      handleSetStatusMessage({
        conversations: state.conversations,
        currentChatId: action.payload.currentChatId,
        messageId: action.payload.messageId,
        status: "delivered",
      });
    },

    setSeenMessage: (state, action) => {
      handleSetStatusMessage({
        conversations: state.conversations,
        currentChatId: action.payload.currentChatId,
        messageId: action.payload.messageId,
        status: "seen",
      });
    },

    removeChatBoxWaiting: (state, action) => {
      const index = state.chatBox.chatBoxWaiting.findIndex(
        (c) => c === action.payload
      );
      if (index > -1) {
        state.chatBox.chatBoxWaiting.splice(index, 1);
      }
      Cookies.set(
        "chatBox",
        JSON.stringify({
          ...state.chatBox,
          chatBoxWaiting: [...state.chatBox.chatBoxWaiting],
        })
      );
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
      const { checkConversation, indexConversation } = handleCheck({
        conversations: state.conversations,
        currentChatId: action.payload.currentChatId,
        type: "conversation",
      });

      if (checkConversation && indexConversation > -1) {
        checkConversation.messages = action.payload.data.messages;
        state.conversations.splice(indexConversation, 1, checkConversation);
        state.messageSendSuccess = true;
      }
    },
    [sendMessageChat.rejected]: (state, action) => {
      console.log(action.payload?.message);
    },

    [deliveredMessageChat.fulfilled]: (state, action) => {
      handleSetStatusMessage({
        conversations: state.conversations,
        currentChatId: action.payload.currentChatId,
        messageId: action.payload.messageId,
        status: "delivered",
      });
    },
    [deliveredMessageChat.rejected]: (state, action) => {
      console.log(action.payload?.message);
    },

    [seenMessageChat.fulfilled]: (state, action) => {
      handleSetStatusMessage({
        conversations: state.conversations,
        currentChatId: action.payload.currentChatId,
        messageId: action.payload.messageId,
        status: "seen",
      });
    },
    [seenMessageChat.rejected]: (state, action) => {
      console.log(action.payload?.message);
    },

    [seenAllMessageChat.fulfilled]: (state, action) => {
      const { checkConversation, indexConversation } = handleCheck({
        conversations: state.conversations,
        currentChatId: action.payload.currentChatId,
        type: "conversation",
      });

      if (checkConversation && indexConversation > -1) {
        checkConversation.messages = action.payload.data;
        state.conversations.splice(indexConversation, 1, checkConversation);
      }
    },
    [seenAllMessageChat.rejected]: (state, action) => {
      console.log(action.payload?.message);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setChatBox,
  removeChatBox,
  setSeenMessage,
  setCurrentChatBox,
  getNewFriendMessage,
  clearMessageSuccess,
  setDeliveredMessage,
  removeChatBoxWaiting,
} = conversationSlice.actions;

export default conversationSlice.reducer;
