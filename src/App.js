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
import { io } from "socket.io-client";
import { connectWithWebSocket } from "./utils/wssConnection/wssConnection";
import { handleWSSCallInParent } from "./utils/wssConnection/wssConnectionInParent";
import Test from "./components/test";

function App() {
  const [visible, setVisible] = useState(false);
  const [onlineUser, setOnlineUsers] = useState([]);
  const [visibleDelPost, setVisibleDelPost] = useState(false);
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { callerUser, callState, connectedUserSocketId } = useSelector(
    (state) => ({ ...state.call })
  );
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
  useEffect(() => {
    const newSocket = io("http://localhost:8900/", {
      transports: ["polling"],
    });
    // console.log(newSocket);
    setSocketRef(newSocket);
    handleWSSCallInParent(newSocket);
    return () => newSocket.close();
  }, [setSocketRef]);

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
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
        <Route path="/reset" element={<Reset />} />

        <Route path="/test-ui" element={<Test />} />
      </Routes>
    </div>
  );
}

export default App;
