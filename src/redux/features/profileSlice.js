import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import * as api from "../api";

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
    { url, token, type, background, text, images, user },
    { rejectWithValue }
  ) => {
    try {
      const { image } = await api.updateProfilePictureUser(url, token);
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

const initialState = {
  profile: {},
  photos: {},
  error: "",
  loading: false,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // getNewNotifications: (state, action) => {
    //   state.newNotifications.push(action.payload.senderId);
    //   Cookies.set("notification", JSON.stringify([...state.newNotifications]));
    // },
    // clearNewNotifications: (state, action) => {
    //   state.newNotifications = [];
    //   Cookies.set("notification", JSON.stringify([]));
    // },
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
  },
});

// Action creators are generated for each case reducer function
// export const { getNewNotifications, clearNewNotifications } =
//   profileSlice.actions;

export default profileSlice.reducer;
