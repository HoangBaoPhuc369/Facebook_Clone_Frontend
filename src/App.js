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
import {
  getAllPosts,
  handleAddUserTypingPost,
  handleRemoveUserTypingPost,
  handleUserTypingPost,
} from "./redux/features/postSlice";
import { getConversations } from "./redux/features/conversationSlice";
import { getNotification } from "./redux/features/notificationSlice";
import { io } from "socket.io-client";
import { handleWSSCallInParent } from "./utils/wssConnection/wssConnectionInParent";
import Test from "./components/test";
import { setActiveUsers } from "./redux/features/dashboardSlice";
import { ToastContainer, cssTransition } from "react-toastify";
import CreatePostSharePopup from "./components/createPostSharePopup";

const bounce = cssTransition({
  enter: "animate__animated animate__bounceInUp",
  exit: "animate__animated animate__bounceOutDown",
});

const CloseButton = ({ closeToast }) => (
  <div className="small_circle" onClick={closeToast}>
    <i className="exit_icon"></i>
  </div>
);

function App() {
  const [visible, setVisible] = useState(false);
  const [onlineUser, setOnlineUsers] = useState([]);
  // const [visibleDelPost, setVisibleDelPost] = useState(false);
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { darkTheme } = useSelector((state) => ({ ...state.theme }));
  const userId = user?.id;
  const [socketRef, setSocketRef] = useState(null);
  const [sharePostPopUp, setsharePostPopUp] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [postShare, setPostShare] = useState({});
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

      newSocket?.emit("addUser", {
        userId: user?.id,
        userName: `${user?.first_name} ${user?.last_name}`,
        picture: user?.picture,
        timeJoin: new Date(),
      });
    }

    newSocket?.on("getUsers", (users) => {
      const activeUsers = user.following.filter((f) =>
        users.some((u) => u.userId === f._id)
      );

      const activeUsersSocket = users.filter(
        (activeUser) =>
          activeUser.socketId !== socketRef?.id &&
          user.following.some((u) => u._id === activeUser.userId)
      );
      // console.log(activeUsers);
      setOnlineUsers(activeUsers);
      dispatch(setActiveUsers(activeUsersSocket));
    });

    setSocketRef(newSocket);
    handleWSSCallInParent(newSocket);
    return () => newSocket.close();
  }, [setSocketRef, user]); //

  useEffect(() => {
    if (socketRef) {
      socketRef.on("getUsers", (users) => {
        const activeUsers = user.following.filter((f) =>
          users.some((u) => u.userId === f._id)
        );

        const activeUsersSocket = users.filter(
          (activeUser) =>
            activeUser.socketId !== socketRef?.id &&
            user.following.some((u) => u._id === activeUser.userId)
        );
        setOnlineUsers(activeUsers);
        dispatch(setActiveUsers(activeUsersSocket));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef]);

  useEffect(() => {
    if (socketRef) {
      socketRef.on("startPostCommentTyping", (data) => {
        dispatch(handleAddUserTypingPost(data));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef]);

  useEffect(() => {
    if (socketRef) {
      socketRef.on("stopPostCommentTyping", (data) => {
        dispatch(handleRemoveUserTypingPost(data));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef]);

  // useEffect(() => {
  //   socketRef?.emit("addUser", {
  //     userId: user?.id,
  //     userName: `${user?.first_name} ${user?.last_name}`,
  //     picture: user?.picture,
  //     timeJoin: new Date(),
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [socketRef, user]);

  return (
    <div className={`relative ${darkTheme === "dark" ? "dark" : "light"}`}>
      {/* {visible && } */}
      <CreatePostPopup visible={visible} setVisible={setVisible} />

      <CreatePostSharePopup
        post={postShare}
        profile={isProfile}
        openSharePost={sharePostPopUp}
        setOpenSharePost={setsharePostPopUp}
      />

      <Routes>
        <Route element={<LoggedInRoutes socketRef={socketRef} />}>
          <Route
            path="/profile"
            element={
              socketRef ? (
                <Profile
                  setPostShare={setPostShare}
                  setsharePostPopUp={setsharePostPopUp}
                  setIsProfile={setIsProfile}
                  socketRef={socketRef}
                  setVisible={setVisible}
                  onlineUser={onlineUser}
                  setOnlineUsers={setOnlineUsers}
                />
              ) : null
            }
            exact
          />
          <Route
            path="/profile/:username"
            element={
              socketRef ? (
                <Profile
                  setPostShare={setPostShare}
                  setsharePostPopUp={setsharePostPopUp}
                  setIsProfile={setIsProfile}
                  socketRef={socketRef}
                  setVisible={setVisible}
                  onlineUser={onlineUser}
                  setOnlineUsers={setOnlineUsers}
                />
              ) : null
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
                  setPostShare={setPostShare}
                  setIsProfile={setIsProfile}
                  setsharePostPopUp={setsharePostPopUp}
                  onlineUser={onlineUser}
                  setVisible={setVisible}
                  setOnlineUsers={setOnlineUsers}
                  // setVisibleDelPost={setVisibleDelPost}
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

      <div id="modal" className="relative"></div>
      <div className="absolute z-[99999999999999]">
        <ToastContainer
          transition={bounce}
          closeButton={CloseButton}
          limit={5}
        />
      </div>
    </div>
  );
}

export default App;
