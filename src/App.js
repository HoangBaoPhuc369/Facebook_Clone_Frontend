import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import { useDispatch, useSelector } from "react-redux";
import Activate from "./pages/home/activate";
import Reset from "./pages/reset";
import CreatePostPopup from "./components/createPostPopup";
import { useRef, useState } from "react";
import Friends from "./pages/friends";
import { useEffect } from "react";
import { getAllPosts } from "./redux/features/postSlice";
import { getConversations } from "./redux/features/conversationSlice";
import NotificationPopUp from "./components/notificationPopUp";
import DeletePostPopUp from "./components/deletePost";
import { getNotification } from "./redux/features/notificationSlice";
import VideoCall from "./pages/videoCall/VideoCall";

function App() {
  const [visible, setVisible] = useState(false);
  const [onlineUser, setOnlineUsers] = useState([]);
  const [visibleDelPost, setVisibleDelPost] = useState(false);
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { darkTheme } = useSelector((state) => ({ ...state.theme }));
  const userId = user?.id;
  const socketRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.token) {
      dispatch(getAllPosts({ userToken: user?.token }));
      dispatch(getNotification({ userToken: user?.token }));
      dispatch(getConversations({ userToken: user?.token }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className={darkTheme ? "dark" : "light"}>
      {visible && <CreatePostPopup user={user} setVisible={setVisible} />}

      {visibleDelPost && <DeletePostPopUp />}

      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/profile"
            element={
              <Profile
                socketRef={socketRef}
                setVisible={setVisible}
                onlineUser={onlineUser}
                setOnlineUsers={setOnlineUsers}
              />
            }
            exact
          />
          <Route
            path="/profile/:username"
            element={
              <Profile
                socketRef={socketRef}
                setVisible={setVisible}
                onlineUser={onlineUser}
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
                socketRef={socketRef}
                onlineUser={onlineUser}
                setVisible={setVisible}
                setOnlineUsers={setOnlineUsers}
                setVisibleDelPost={setVisibleDelPost}
              />
            }
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
          <Route path="/video-call" element={<VideoCall />} exact />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
        <Route path="/reset" element={<Reset />} />
      </Routes>

      {/* <NotificationPopUp>{user?.picture}</NotificationPopUp> */}
    </div>
  );
}

export default App;
