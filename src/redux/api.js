import axios from "axios";

// --------------------------THEME API--------------------------------------
export const changeTheme = (data, userToken) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/users/update-theme`,
    {
      theme: data,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

// --------------------------AUTH API--------------------------------------
export const userLogin = (formValue) =>
  axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, formValue);

export const userRegister = (formValue) =>
  axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, formValue);

export const activateAccount = (token, userToken) =>
  axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/auth/activate`,
    { token },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

// --------------------------PROFILE API-----------------------------------
export const getProfile = (userName, token) =>
  axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/users/get-profile/${userName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getPhotos = (path, sort, max, token) =>
  axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/uploads/list-images`,
    { path, sort, max },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const updateDetails = (infos, token) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/users/update-details`,
    {
      infos,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const updateProfilePictureUser = (url, token) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/users/update-profile-picture`,
    {
      url: url,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const addFriend = (id, token) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/users/add-friend/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const cancelRequest = (id, token) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/users/cancel-request/${id}`,
    {},

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const follow = (id, token) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/users/follow/${id}`,
    {},

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const unFollow = (id, token) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/users/unfollow/${id}`,
    {},

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const acceptRequest = (id, token) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/users/accept-request/${id}`,
    {},

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const unfriend = (id, token) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/users/unfriend/${id}`,
    {},

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const deleteRequest = (id, token) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/users/delete-request/${id}`,
    {},

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// --------------------------POST API--------------------------------------
export const getPosts = (userToken) =>
  axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts/get-all-posts`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

export const getPost = (postId, userToken) =>
  axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

export const createPost = (
  type,
  background,
  text,
  images,
  whoCanSee,
  user,
  token,
  postRef
) =>
  axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/posts/create-post`,
    {
      type,
      background,
      text,
      images,
      whoCanSee,
      user,
      postRef,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
export const createPostUpdateProfile = (
  type,
  background,
  text,
  image,
  user,
  token
) =>
  axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/posts/create-post`,
    {
      type,
      background,
      text,
      images: image,
      user,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const deletePost = async (postId, token) =>
  axios.delete(
    `${process.env.REACT_APP_BACKEND_URL}/posts/delete-post/${postId}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const comment = (
  postId,
  getParentId = "",
  comment,
  image,
  socketId,
  token
) =>
  axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/posts/comment`,
    {
      postId,
      comment,
      parentId: getParentId,
      socketId,
      image,
    },

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const editComment = (id, postId, comment, image, token) =>
  axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/posts/update-comment`,
    {
      id,
      postId,
      comment,
      image,
    },

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// --------------------------CHAT API--------------------------------------
export const getConversations = (userToken) =>
  axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/chat/conversations`,
    {},
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

export const sendMessageChat = (userToken, message) =>
  axios.put(`${process.env.REACT_APP_BACKEND_URL}/chat/message`, message, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

export const deliveredMessageChat = (userToken, messageId, currentChatId) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/chat/delivered-message`,
    {
      conversationId: currentChatId,
      messageId,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

export const seenMessageChat = (userToken, messageId, currentChatId) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/chat/seen-message`,
    {
      conversationId: currentChatId,
      messageId,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

export const seenAllMessageChat = (userToken, currentChatId) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/chat/seen-all-message`,
    {
      conversationId: currentChatId,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

export const seenAllConversationsChat = (userToken) => {
  return axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/chat/seen-all-conversations`,
    {},
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
};

export const deliveredAllConversationsChat = (userToken) => {
  return axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/chat/delivered-all-conversations`,
    {},
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
};

// --------------------------NOTIFICATION API--------------------------------------
export const createNotifications = (props, token) =>
  axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/notifications`,
    {
      from: props.senderId,
      user: props.receiverId,
      icon: props.icon,
      text: props.text,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getNotification = (userToken) =>
  axios.get(`${process.env.REACT_APP_BACKEND_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

export const seenNotification = (userToken, nofId) =>
  axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/notifications/${nofId}/seen`,
    {},
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

// =================FRIEND PAGES ==================
export const getFriendsPageInfos = (token) =>
  axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/users/get-friends-page-infos`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

