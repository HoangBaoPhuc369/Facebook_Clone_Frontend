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

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (
    { userName, token, path, sort, max, navigate },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.getProfile(userName, token);
      if (!data) {
        navigate("/profile");
      }
      const images = await api.getPhotos(path, sort, max, token);
      return { data, images: images.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateDetailsInfo = createAsyncThunk(
  "profile/updateDetails",
  async ({ infos, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateDetails(infos, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateProfilePictureUser = createAsyncThunk(
  "profile/updateProfilePictureUser",
  async (
    { image, token, type, background, text, user },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.createPostUpdateProfile(
        type,
        background,
        text,
        image,
        user,
        token
      );
      if (data) {
        return data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addFriend = createAsyncThunk(
  "profile/addFriend",
  async ({ profileId, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.addFriend(profileId, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const cancelRequest = createAsyncThunk(
  "profile/cancelRequest",
  async ({ profileId, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.cancelRequest(profileId, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const follow = createAsyncThunk(
  "profile/follow",
  async ({ profileId, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.follow(profileId, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const unFollow = createAsyncThunk(
  "profile/unFollow",
  async ({ profileId, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.unFollow(profileId, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const acceptRequest = createAsyncThunk(
  "profile/acceptRequest",
  async ({ profileId, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.acceptRequest(profileId, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const unfriend = createAsyncThunk(
  "profile/unfriend",
  async ({ profileId, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.unfriend(profileId, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteRequest = createAsyncThunk(
  "profile/deleteRequest",
  async ({ profileId, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.deleteRequest(profileId, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createCommentInProfilePost = createAsyncThunk(
  "profile/createComment",
  async (
    {
      postId,
      getParentId,
      comment,
      image,
      socketId,
      token,
      handleSendNotifications,
    },
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
      if (data) {
        handleSendNotifications("comment", "comment");
      }
      return { data: data.comments, postId };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const editCommentInProfilePost = createAsyncThunk(
  "profile/editComment",
  async ({ id, postId, comment, image, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.editComment(id, postId, comment, image, token);
      return { data: data, postId };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createPostProfile = createAsyncThunk(
  "profile/createPost",
  async (
    {
      type,
      background,
      text,
      images,
      user,
      postRef,
      token,
      whoCanSee,
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
      if (data) {
        toastDetailsPost("share");
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deletePostProfile = createAsyncThunk(
  "profile/deletePost",
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

const initialState = {
  profile: {},
  photos: {},
  error: "",
  loading: false,
  loadingComment: false,
  loadingPosts: false,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setPostProfileLoading: (state, action) => {
      state.loadingPosts = action.payload;
    },
    createCommentPostProfileLoading: (state, action) => {
      createCommentLoading({
        posts: state.profile.posts,
        postId: action.payload.postId,
        comment: action.payload.comment,
      });
    },
    editCommentPostProfileLoading: (state, action) => {
      editCommentLoading({
        posts: state.profile.posts,
        postId: action.payload.postId,
        comment: action.payload.comment,
        commentId: action.payload.commentId,
      });
    },
    viewNegativeCommentInProfile: (state, action) => {
      showNegativeComment({
        posts: state.profile?.posts,
        postId: action.payload.postId,
        commentId: action.payload.commentId,
      });
    },
    viewNegativePostInProfile: (state, action) => {
      showNegativePost({
        posts: state.profile?.posts,
        postId: action.payload,
      });
    },
    deleteCommentInProfile: (state, action) => {
      replaceComment({
        posts: state.profile?.posts,
        postId: action.payload.postId,
        comments: action.payload.comments,
      });
    },
    getNewCommentPostProfile: (state, action) => {
      const post = state.profile.posts.find(
        (p) => p._id === action.payload.postId
      );
      post.comments = [action.payload.comment, ...post.comments];
    },
    getNewPostProfile: (state, action) => {
      state.profile.posts = [action.payload, ...state.profile.posts];
    },
  },
  extraReducers: {
    [getProfile.pending]: (state, action) => {
      state.loading = true;
    },
    [getProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload.data;
      state.photos = action.payload.images;
      state.error = "";
    },
    [getProfile.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [updateDetailsInfo.fulfilled]: (state, action) => {
      state.profile.details = action.payload;
      state.error = "";
    },
    [updateDetailsInfo.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [updateProfilePictureUser.fulfilled]: (state, action) => {
      state.profile.posts = [action.payload, ...state.profile.posts];
      state.error = "";
    },
    [updateProfilePictureUser.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [addFriend.fulfilled]: (state, action) => {
      state.profile.friendship = {
        ...state.profile.friendship,
        requestSent: true,
        following: true,
      };
      state.error = "";
    },
    [addFriend.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [cancelRequest.fulfilled]: (state, action) => {
      state.profile.friendship = {
        ...state.profile.friendship,
        requestSent: false,
        following: false,
      };
      state.error = "";
    },
    [cancelRequest.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [follow.fulfilled]: (state, action) => {
      state.profile.friendship = {
        ...state.profile.friendship,
        following: true,
      };
      state.error = "";
    },
    [follow.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [unFollow.fulfilled]: (state, action) => {
      state.profile.friendship = {
        ...state.profile.friendship,
        following: false,
      };
      state.error = "";
    },
    [unFollow.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [acceptRequest.fulfilled]: (state, action) => {
      state.profile.friendship = {
        ...state.profile.friendship,
        friends: true,
        following: true,
        requestSent: false,
        requestReceived: false,
      };
      state.error = "";
    },
    [acceptRequest.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [unfriend.fulfilled]: (state, action) => {
      state.profile.friendship = {
        ...state.profile.friendship,
        friends: false,
        following: false,
        requestSent: false,
        requestReceived: false,
      };
      state.error = "";
    },
    [unfriend.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },

    [deleteRequest.fulfilled]: (state, action) => {
      state.profile.friendship = {
        ...state.profile.friendship,
        friends: false,
        following: false,
        requestSent: false,
        requestReceived: false,
      };
      state.error = "";
    },
    [deleteRequest.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },
    [createCommentInProfilePost.pending]: (state, action) => {
      state.loadingComment = true;
    },
    [createCommentInProfilePost.fulfilled]: (state, action) => {
      state.loadingComment = false;
      createComment({
        posts: state.profile?.posts,
        postId: action.payload.postId,
        comments: action.payload.data,
      });
      state.error = "";
    },
    [createCommentInProfilePost.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },
    [editCommentInProfilePost.pending]: (state, action) => {
      state.loadingComment = true;
    },
    [editCommentInProfilePost.fulfilled]: (state, action) => {
      state.loadingComment = false;
      createComment({
        posts: state.profile?.posts,
        postId: action.payload.postId,
        comments: action.payload.data,
      });
      state.error = "";
    },
    [editCommentInProfilePost.rejected]: (state, action) => {
      state.loadingComment = false;
      state.error = action.payload?.message;
    },
    [createPostProfile.pending]: (state, action) => {
      state.loadingPosts = true;
    },
    [createPostProfile.fulfilled]: (state, action) => {
      state.loadingPosts = false;
      state.profile.posts = [action.payload, ...state.profile.posts];
      state.error = "";
    },
    [createPostProfile.rejected]: (state, action) => {
      state.loadingPosts = false;
      state.error = action.payload?.message;
    },
    [deletePostProfile.fulfilled]: (state, action) => {
      if (action.payload.status === "ok") {
        state.profile.posts = state.profile.posts.filter(
          (p) => p._id !== action.payload.postId
        );
      }

      state.error = "";
    },
    [deletePostProfile.rejected]: (state, action) => {
      state.error = action.payload?.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  getNewPostProfile,
  setPostProfileLoading,
  deleteCommentInProfile,
  getNewCommentPostProfile,
  viewNegativePostInProfile,
  viewNegativeCommentInProfile,
  editCommentPostProfileLoading,
  createCommentPostProfileLoading,
} = profileSlice.actions;

export default profileSlice.reducer;
