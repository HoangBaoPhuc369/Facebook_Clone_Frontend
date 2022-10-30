import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import * as api from "../api";

export const login = createAsyncThunk(
  "auth/login",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await api.userLogin(formValue);
      navigate("/");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await api.userRegister(formValue);
      navigate("/");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const active = createAsyncThunk(
  "auth/active",
  async ({ token, userToken, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await api.activateAccount(token, userToken);
      navigate("/");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  message: "",
  error: "",
  loading: false,
  errorRegister: "",
  loadingRegister: false,
  errorActive: "",
  loadingActive: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogout: (state, action) => {
      state.user = null;
      Cookies.set("user", "");
    },
    updatePicture: (state, action) => {
      state.user.picture = action.payload;
      Cookies.set(
        "user",
        JSON.stringify({
          ...state.user,
          picture: action.payload,
        })
      );
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      Cookies.set("user", JSON.stringify(action.payload));
      state.user = action.payload;
      state.error = "";
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [register.pending]: (state, action) => {
      state.loadingRegister = true;
    },
    [register.fulfilled]: (state, action) => {
      const { message, ...rest } = action.payload;
      state.loadingRegister = false;
      state.message = message;
      Cookies.set("user", JSON.stringify(rest));
      state.user = rest;
      state.errorRegister = "";
    },
    [register.rejected]: (state, action) => {
      state.loadingRegister = false;
      state.errorRegister = action.payload.message;
    },

    [active.pending]: (state, action) => {
      state.loadingActive = true;
    },
    [active.fulfilled]: (state, action) => {
      state.loadingActive = false;
      Cookies.set("user", JSON.stringify({ ...state.user, verified: true }));
      state.message = action.payload.message;
      state.user = { ...state.user, verified: true };
      state.errorActive = "";
    },
    [active.rejected]: (state, action) => {
      state.loadingActive = false;
      state.errorActive = action.payload.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLogout, updatePicture } = authSlice.actions;

export default authSlice.reducer;
