import axios from "axios";

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

// --------------------------POST API--------------------------------------
export const getPosts = (userToken) =>
  axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts/get-all-posts`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

export const createPost = (type, background, text, images, user, token) =>
  axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/posts/create-post`,
    {
      type,
      background,
      text,
      images,
      user,
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
  axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/notifications`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

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

