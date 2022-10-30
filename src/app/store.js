import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../redux/features/authSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
});
