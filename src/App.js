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
import { useState } from "react";
import Friends from "./pages/friends";
import { useEffect } from "react";
import { getAllPosts } from "./redux/features/postSlice";
import { getConversations } from "./redux/features/conversationSlice";
import DeletePostPopUp from "./components/deletePost";
import { getNotification } from "./redux/features/notificationSlice";
import { io } from "socket.io-client";
import { handleWSSCallInParent } from "./utils/wssConnection/wssConnectionInParent";
import Test from "./components/test";

function App() {
  const [visible, setVisible] = useState(false);
  const [onlineUser, setOnlineUsers] = useState([]);
  const [visibleDelPost, setVisibleDelPost] = useState(false);
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { darkTheme } = useSelector((state) => ({ ...state.theme }));
  const userId = user?.id;
  const [socketRef, setSocketRef] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.token) {
      dispatch(getAllPosts({ userToken: user?.token }));
      dispatch(getNotification({ userToken: user?.token }));
      dispatch(getConversations({ userToken: user?.token }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  //  process.env.REACT_APP_BACKEND_URL
  // "http://localhost:8900/"
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ["polling"],
    });
    if (user) {
      newSocket.emit("joinUser", user.id);
    }
    setSocketRef(newSocket);
    handleWSSCallInParent(newSocket);
    return () => newSocket.close();
  }, [setSocketRef, user]); //

  useEffect(() => {
    if (socketRef) {
      socketRef?.emit("addUser", {
        userId: user?.id,
        userName: `${user?.first_name} ${user?.last_name}`,
        picture: user?.picture,
        timeJoin: new Date(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef]);

  return (
    <div className={darkTheme ? "dark" : "light"}>
      {visible && <CreatePostPopup user={user} setVisible={setVisible} />}

      {visibleDelPost && <DeletePostPopUp />}

      <Routes>
        <Route element={<LoggedInRoutes socketRef={socketRef} />}>
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
          <Route
            path="/friends"
            element={socketRef ? <Friends socketRef={socketRef} /> : null}
            exact
          />
          <Route
            path="/friends/:type"
            element={socketRef ? <Friends socketRef={socketRef} /> : null}
            exact
          />
          <Route
            path="/"
            element={
              socketRef ? (
                <Home
                  socketRef={socketRef}
                  onlineUser={onlineUser}
                  setVisible={setVisible}
                  setOnlineUsers={setOnlineUsers}
                  setVisibleDelPost={setVisibleDelPost}
                />
              ) : null
            }
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
        </Route>

        {/* Khi đã ở trong app và bị mất user thì mới vô component này */}
        <Route element={<NotLoggedInRoutes socketRef={socketRef} />}>
          <Route
            path="/login"
            element={<Login socketRef={socketRef} />}
            exact
          />
        </Route>
        <Route path="/reset" element={<Reset />} />

        <Route path="/test-ui" element={<Test />} />
      </Routes>
    </div>
  );
}

export default App;
