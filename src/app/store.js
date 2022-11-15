import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../redux/features/authSlice";
import ThemeReducer from "../redux/features/themeSlice";
import PostReducer from "../redux/features/postSlice";
import ConversationReducer from "../redux/features/conversationSlice";
import NotificationReducer from "../redux/features/notificationSlice";
import ProfileUser from "../redux/features/profileSlice";
import Dashboard from "../redux/features/dashboardSlice";
import Call from "../redux/features/callSlice";

export const store = configureStore({
  reducer: {
    call: Call,
    auth: AuthReducer,
    theme: ThemeReducer,
    dashboard: Dashboard,
    profile: ProfileUser,
    newFeed: PostReducer,
    messenger: ConversationReducer,
    notification: NotificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
