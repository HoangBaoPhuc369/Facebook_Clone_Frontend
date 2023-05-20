import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import * as api from "../api";
import {
  createComment,
  createCommentLoading,
  editCommentLoading,
  replaceComment,
  showNegativeComment,
  showNegativePost,
} from "../helpers/handlePosts";

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
    {
      type,
      background,
      text,
      images,
      whoCanSee,
      user,
      token,
      postRef,
      toastDetailsPost,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.createPost(
        type,
        background,
        text,
        images,
        whoCanSee,
        user,
        token,
        postRef
      );
      if (data && toastDetailsPost) {
        toastDetailsPost("share");
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async ({ postId, token, toastDetailsPost }, { rejectWithValue }) => {
    try {
      const { data } = await api.deletePost(postId, token);
      if (data) {
        toastDetailsPost("delete");
      }
      return {
        status: data.status,
        postId,
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createCommentPost = createAsyncThunk(
  "post/createComment",
  async (
    { postId, getParentId, comment, image, socketId, token },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.comment(
        postId,
        getParentId,
        comment,
        image,
        socketId,
        token
      );
      return { data: data.comments, postId };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const editCommentPost = createAsyncThunk(
  "post/editCommentPost",
  async ({ id, postId, comment, image, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.editComment(id, postId, comment, image, token);
      return { data: data, postId };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  posts: [],
  userTypingPosts: false,
  error: "",
  loading: false,
  errorCreatePost: "",
  loadingCommentPost: false,
  loadingCreatePost: false,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.errorCreatePost = action.payload;
    },
    setPostLoading: (state, action) => {
      state.loadingCreatePost = action.payload;
    },
    createCommentPostLoading: (state, action) => {
      createCommentLoading({
        posts: state.posts,
        postId: action.payload.postId,
        comment: action.payload.comment,
      });
    },
    editCommentPostLoading: (state, action) => {
      editCommentLoading({
        posts: state.posts,
        postId: action.payload.postId,
        comment: action.payload.comment,
        commentId: action.payload.commentId,
      });
    },
    viewNegativeCommentInPost: (state, action) => {
      showNegativeComment({
        posts: state.posts,
        postId: action.payload.postId,
        commentId: action.payload.commentId,
      });
    },
    viewNegativePost: (state, action) => {
      showNegativePost({
        posts: state.posts,
        postId: action.payload,
      });
    },
    deleteCommentInFeed: (state, action) => {
      replaceComment({
        posts: state.posts,
        postId: action.payload.postId,
        comments: action.payload.comments,
      });
    },
    handleAddUserTypingPost: (state, action) => {
      state.userTypingPosts = action.payload;
    },
    handleRemoveUserTypingPost: (state, action) => {
      state.userTypingPosts = action.payload;
    },
    getNewCommentPost: (state, action) => {
      const post = state.posts.find((p) => p._id === action.payload.postId);
      post.comments = [action.payload.comment, ...post.comments];
    },
    getNewPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
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
      state.errorCreatePost = action.payload;
    },

    [deletePost.fulfilled]: (state, action) => {
      if (action.payload.status === "ok") {
        state.posts = state.posts.filter(
          (p) => p._id !== action.payload.postId
        );
      }
      state.errorCreatePost = "";
    },
    [deletePost.rejected]: (state, action) => {
      state.errorCreatePost = action.payload;
    },
    [createCommentPost.pending]: (state, action) => {
      state.loadingCommentPost = true;
    },
    [createCommentPost.fulfilled]: (state, action) => {
      state.loadingCommentPost = false;
      createComment({
        posts: state.posts,
        postId: action.payload.postId,
        comments: action.payload.data,
      });
      state.error = "";
    },
    [createCommentPost.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },
    [editCommentPost.pending]: (state, action) => {
      state.loadingCommentPost = true;
    },
    [editCommentPost.fulfilled]: (state, action) => {
      state.loadingCommentPost = false;
      createComment({
        posts: state.posts,
        postId: action.payload.postId,
        comments: action.payload.data,
      });
      state.error = "";
    },
    [editCommentPost.rejected]: (state, action) => {
      state.loadingCommentPost = false;
      state.error = action.payload?.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setError,
  getNewPost,
  setPostLoading,
  viewNegativePost,
  getNewCommentPost,
  deleteCommentInFeed,
  editCommentPostLoading,
  handleAddUserTypingPost,
  createCommentPostLoading,
  viewNegativeCommentInPost,
  handleRemoveUserTypingPost,
} = postSlice.actions;

export default postSlice.reducer;
