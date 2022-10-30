import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import * as api from "../api";

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async ({ userToken }, { rejectWithValue }) => {
    try {
      const { data } = await api.getPosts(userToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (
    { type, background, text, images, user, token },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.createPost(
        type,
        background,
        text,
        images,
        user,
        token
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  posts: [],
  error: "",
  loading: false,
  errorCreatePost: "",
  loadingCreatePost: false,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setError: (state, action) => {
        state.errorCreatePost = action.payload;
    }
  },
  extraReducers: {
    [getAllPosts.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
      state.error = "";
    },
    [getAllPosts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [createPost.pending]: (state, action) => {
      state.loadingCreatePost = true;
    },
    [createPost.fulfilled]: (state, action) => {
      state.loadingCreatePost = false;
      state.posts = [action.payload, ...state.posts];
      state.errorCreatePost = "";
    },
    [createPost.rejected]: (state, action) => {
      state.loadingCreatePost = false;
      state.errorCreatePost = action.payload.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setError } = postSlice.actions;

export default postSlice.reducer;
