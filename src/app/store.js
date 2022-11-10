import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../redux/features/authSlice";
import ThemeReducer from "../redux/features/themeSlice";
import PostReducer from "../redux/features/postSlice";
import ConversationReducer from "../redux/features/conversationSlice";
import NotificationReducer from "../redux/features/notificationSlice";
import ProfileUser from "../redux/features/profileSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    theme: ThemeReducer,
    profile: ProfileUser,
    newFeed: PostReducer,
    messenger: ConversationReducer,
    notification: NotificationReducer,
  },
});
