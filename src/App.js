import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import { useSelector } from "react-redux";
import Activate from "./pages/home/activate";
import Reset from "./pages/reset";
import CreatePostPopup from "./components/createPostPopup";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { postsReducer } from "./functions/reducers";
import Friends from "./pages/friends";
import DeletePostPopUp from "./components/deletePost";

function App() {
  const [visible, setVisible] = useState(false);
  const [onlineUser, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [visibleDelPost, setVisibleDelPost] = useState(false);
  const { user, darkTheme } = useSelector((state) => ({ ...state }));
  const [{ loading, error, posts }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });
  useEffect(() => {
    getAllPosts();
  }, [user?.token]);

 

  const getAllPosts = async () => {
    try {
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/posts/get-all-posts`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "POSTS_SUCCESS",
        payload: data,
      });

    } catch (error) {
      dispatch({
        type: "POSTS_ERROR",
        payload: error?.response?.data?.message,
      });
    }
  };

  //Get conversation
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/chat/conversations`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user?.following, user?.token]);

  return (
    <div className={darkTheme ? "dark" : "light"}>
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={posts}
          dispatch={dispatch}
        />
      )}

      {visibleDelPost && <DeletePostPopUp />}

      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/profile"
            element={
              <Profile
                setVisible={setVisible}
                onlineUser={onlineUser}
                getAllPosts={getAllPosts}
                conversations={conversations}
                setOnlineUsers={setOnlineUsers}
              />
            }
            exact
          />
          <Route
            path="/profile/:username"
            element={
              <Profile
                setVisible={setVisible}
                onlineUser={onlineUser}
                getAllPosts={getAllPosts}
                conversations={conversations}
                setOnlineUsers={setOnlineUsers}
              />
            }
            exact
          />
          <Route path="/friends" element={<Friends />} exact />
          <Route path="/friends/:type" element={<Friends />} exact />
          <Route
            path="/"
            element={
              <Home
                posts={posts}
                loading={loading}
                onlineUser={onlineUser}
                setVisible={setVisible}
                getAllPosts={getAllPosts}
                conversations={conversations}
                setOnlineUsers={setOnlineUsers}
                setVisibleDelPost={setVisibleDelPost}
              />
            }
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </div>
  );
}

export default App;
