import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import * as api from "../api";

export const createNotifications = createAsyncThunk(
  "notification/createNotifications",
  async ({ props, token }, { rejectWithValue }) => {
    try {
      console.log(props);
      const { data } = await api.createNotifications(props, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getNotification = createAsyncThunk(
  "notification/getNotification",
  async ({ userToken }, { rejectWithValue }) => {
    try {
      const { data } = await api.getNotification(userToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const seenNotification = createAsyncThunk(
  "notification/seenNotification",
  async ({ userToken, nofId }, { rejectWithValue }) => {
    try {
      const { data } = await api.seenNotification(userToken, nofId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getPost = createAsyncThunk(
  "notification/details/getPost",
  async ({ userToken, postId }, { rejectWithValue }) => {
    try {
      const { data } = await api.getPost(postId, userToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const editCommentInDetailsPost = createAsyncThunk(
  "notification/details/editComment",
  async ({ id, postId, comment, image, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.editComment(id, postId, comment, image, token);
      return { data: data, postId };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createCommentInDetailsPost = createAsyncThunk(
  "notification/details/createComment",
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

export const deletePostDetails = createAsyncThunk(
  "notification/details/deletePost",
  async ({ postId, token, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await api.deletePost(postId, token);
      navigate("/");
      return {
        status: data.status,
        postId,
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createPostDetails = createAsyncThunk(
  "notification/details/createPost",
  async (
    { type, background, text, images, user, postRef, token, whoCanSee },
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
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  notifications: null,
  newNotifications: Cookies.get("notification")
    ? JSON.parse(Cookies.get("notification"))
    : [],
  notificationsSelected: null,
  postDetails: null,
  error: "",
  loading: false,
  loadingPostDetails: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    getNewNotifications: (state, action) => {
      if (action.payload.senderId) {
        state.newNotifications.push(action.payload.senderId);
      } else {
        state.newNotifications.push(action.payload._id);
      }
      Cookies.set("notification", JSON.stringify([...state.newNotifications]));
    },
    clearNewNotifications: (state, action) => {
      state.newNotifications = [];
      Cookies.set("notification", JSON.stringify([]));
    },
    selecteNotification: (state, action) => {
      state.notificationsSelected = action.payload;
    },
    viewNegativePostDetails: (state, action) => {
      state.postDetails.hidePost = true;
    },
    viewNegativeCommentInPostDetails: (state, action) => {
      const findCommnent = state.postDetails.comments.find(
        (c) => c._id === action.payload
      );
      if (findCommnent) {
        findCommnent.hideComment = false;
      }
    },
    editCommentPostDetailsLoading: (state, action) => {
      const findCommnent = state.postDetails.comments.find(
        (c) => c._id === action.payload.commentId
      );
      if (findCommnent) {
        findCommnent.comment = action.payload.comment.comment;
        findCommnent.image = action.payload.comment.image;
        findCommnent.isFetching = action.payload.comment.isFetching;
      }
    },
    createCommentPostDetailsLoading: (state, action) => {
      state.postDetails.comments = [
        action.payload.comment,
        ...state.postDetails.comments,
      ];
    },

    deleteCommentInDetails: (state, action) => {
      state.postDetails.comments = action.payload.comments;
    },
  },
  extraReducers: {
    [getNotification.pending]: (state, action) => {
      state.loading = true;
    },
    [getNotification.fulfilled]: (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
      state.error = "";
    },
    [getNotification.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [createNotifications.fulfilled]: (state, action) => {
      state.error = "";
    },
    [createNotifications.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [seenNotification.fulfilled]: (state, action) => {
      state.notifications = action.payload;
      state.error = "";
    },
    [seenNotification.rejected]: (state, action) => {
      state.error = action.payload.message;
    },

    [getPost.pending]: (state, action) => {
      state.loadingPostDetails = true;
    },
    [getPost.fulfilled]: (state, action) => {
      state.loadingPostDetails = false;
      state.postDetails = action.payload;
      state.error = "";
    },
    [getPost.rejected]: (state, action) => {
      state.loadingPostDetails = false;
      state.error = action.payload.message;
    },

    [editCommentInDetailsPost.fulfilled]: (state, action) => {
      state.postDetails.comments = action.payload.comments;
      state.error = "";
    },
    [editCommentInDetailsPost.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [createCommentInDetailsPost.fulfilled]: (state, action) => {
      state.postDetails.comments = action.payload.data;
      state.error = "";
    },
    [createCommentInDetailsPost.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },
    [deletePostDetails.fulfilled]: (state, action) => {
      if (action.payload.status === "ok") {
        state.postDetails = null;
      }

      state.error = "";
    },
    [deletePostDetails.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [createPostDetails.pending]: (state, action) => {
      state.loadingPostDetails = true;
    },
    [createPostDetails.fulfilled]: (state, action) => {
      state.loadingPostDetails = false;
      console.log(action.payload);
      state.error = "";
    },
    [createPostDetails.rejected]: (state, action) => {
      state.loadingPostDetails = false;
      state.error = action.payload?.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  selecteNotification,
  getNewNotifications,
  clearNewNotifications,
  deleteCommentInDetails,
  viewNegativePostDetails,
  editCommentPostDetailsLoading,
  createCommentPostDetailsLoading,
  viewNegativeCommentInPostDetails,
} = notificationSlice.actions;

export default notificationSlice.reducer;
