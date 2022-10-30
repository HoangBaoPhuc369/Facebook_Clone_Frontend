import axios from "axios";

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
