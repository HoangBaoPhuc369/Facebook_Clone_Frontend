import { Routes, Route, Link, useNavigate } from "react-router-dom";
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
  handleAddUserTypingPost,
  handleRemoveUserTypingPost,
} from "./redux/features/postSlice";
import {
  deliveredAllConversationsChat,
  getConversations,
  setConversation,
} from "./redux/features/conversationSlice";
import { getNotification } from "./redux/features/notificationSlice";
import { handleWSSCallInParent } from "./utils/wssConnection/wssConnectionInParent";
import Test from "./components/test";
import { setActiveUsers } from "./redux/features/dashboardSlice";
import { ToastContainer, cssTransition, toast } from "react-toastify";
import CreatePostSharePopup from "./components/createPostSharePopup";
import DetailsNotifications from "./components/detailsNotifications";
import { IoIosCheckmarkCircle } from "react-icons/io";
import Header from "./components/header";
import * as webRTCHandler from "./utils/webRTC/webRTCHandler";
import { io } from "socket.io-client";
import { useRef } from "react";

const bounce = cssTransition({
  enter: "animate__animated animate__bounceInUp",
  exit: "animate__animated animate__bounceOutDown",
});

const CloseButton = ({ closeToast }) => (
  <div className="small_circle" onClick={closeToast}>
    <i className="exit_icon"></i>
  </div>
);

const DetailsNoftication = ({ type }) => (
  <div className="flex items-center justify-between">
    {type === "share" ? (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <IoIosCheckmarkCircle className="w-5 h-5 text-[#007000]" />
          <span>Shared to Feed.</span>
        </div>
        <Link to="/" className="text-blue-500">
          View post
        </Link>
      </>
    ) : (
      <div>Your post has been deleted.</div>
    )}
  </div>
);

function App() {
  const [visible, setVisible] = useState(false);
  const [onlineUser, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { page } = useSelector((state) => ({ ...state.pageSite }));
  const userId = user?.id;
  const [sharePostPopUp, setsharePostPopUp] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [postShare, setPostShare] = useState({});
  const dispatch = useDispatch();

  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Đã kết nối đến máy chủ Socket.IO", socketRef.current.id);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user?.token) {
      dispatch(getNotification({ userToken: user?.token }));
      dispatch(getConversations({ userToken: user?.token }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (user) {
      socketRef.current.emit("joinUser", user.id);
      dispatch(
        deliveredAllConversationsChat({
          userToken: user?.token,
        })
      );
    }

    // setSocketRef(socketRef);
    handleWSSCallInParent(socketRef.current);
  }, [user]);

  useEffect(() => {
    socketRef.current?.on("getFriendsOnline", (users) => {
      if (user) {
        const activeUsers = user.friends.filter((f) =>
          users.some((u) => u.userId === f._id)
        );

        const activeUsersSocket = users.filter(
          (activeUser) =>
            activeUser.socketId !== socketRef.current?.id &&
            user.friends.some((u) => u._id === activeUser.userId)
        );

        setOnlineUsers(activeUsers);
        dispatch(setActiveUsers(activeUsersSocket));
      }
    });
  }, [user]);

  useEffect(() => {
    socketRef.current?.on("call-other", (data) => {
      webRTCHandler.handlePreOfferInParent(data);
    });
  }, [user]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("startPostCommentTyping", () => {
        dispatch(handleAddUserTypingPost(true));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("stopPostCommentTyping", () => {
        dispatch(handleRemoveUserTypingPost(false));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      socketRef.current?.on("deliveredAllConversations", (data) => {
        dispatch(setConversation(data));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, socketRef]);

  const toastDetailsPost = (type) =>
    toast(<DetailsNoftication type={type} />, {
      className: "details_notification_form",
      toastClassName: "details_notification_toast",
      bodyClassName: "details_notification_body",
      position: "bottom-left",
      hideProgressBar: true,
      autoClose: 3000,
      transition: bounce,
    });

  return (
    <div className={`relative ${user?.theme === "dark" ? "dark" : "light"}`}>
      <CreatePostPopup visible={visible} setVisible={setVisible} />

      <CreatePostSharePopup
        post={postShare}
        profile={isProfile}
        openSharePost={sharePostPopUp}
        toastDetailsPost={toastDetailsPost}
        setOpenSharePost={setsharePostPopUp}
      />

      {socketRef.current && user ? (
        <Header
          page={page}
          socketRef={socketRef.current}
          onlineUser={onlineUser}
          setOnlineUsers={setOnlineUsers}
        />
      ) : null}

      <Routes>
        <Route element={<LoggedInRoutes socketRef={socketRef} />}>
          <Route
            path="/profile"
            element={
              socketRef.current ? (
                <Profile
                  socketRef={socketRef.current}
                  setVisible={setVisible}
                  onlineUser={onlineUser}
                  setPostShare={setPostShare}
                  setIsProfile={setIsProfile}
                  setOnlineUsers={setOnlineUsers}
                  toastDetailsPost={toastDetailsPost}
                  setsharePostPopUp={setsharePostPopUp}
                />
              ) : null
            }
            exact
          />
          <Route
            path="/profile/:username"
            element={
              socketRef.current ? (
                <Profile
                  socketRef={socketRef.current}
                  setVisible={setVisible}
                  onlineUser={onlineUser}
                  setIsProfile={setIsProfile}
                  setPostShare={setPostShare}
                  setOnlineUsers={setOnlineUsers}
                  toastDetailsPost={toastDetailsPost}
                  setsharePostPopUp={setsharePostPopUp}
                />
              ) : null
            }
            exact
          />
          <Route
            path="/friends"
            element={
              socketRef.current ? (
                <Friends socketRef={socketRef.current} />
              ) : null
            }
            exact
          />
          <Route
            path="/friends/:type"
            element={
              socketRef.current ? (
                <Friends socketRef={socketRef.current} />
              ) : null
            }
            exact
          />
          <Route
            path="/"
            element={
              socketRef.current ? (
                <Home
                  socketRef={socketRef.current}
                  onlineUser={onlineUser}
                  setVisible={setVisible}
                  setIsProfile={setIsProfile}
                  setPostShare={setPostShare}
                  setOnlineUsers={setOnlineUsers}
                  toastDetailsPost={toastDetailsPost}
                  setsharePostPopUp={setsharePostPopUp}
                />
              ) : null
            }
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
          <Route
            path="/details-notification/:type"
            element={
              <DetailsNotifications
                socketRef={socketRef.current}
                onlineUser={onlineUser}
                setOnlineUsers={setOnlineUsers}
                toastDetailsPost={toastDetailsPost}
              />
            }
            exact
          />
        </Route>

        {/* Khi đã ở trong app và bị mất user thì mới vô component này */}
        <Route element={<NotLoggedInRoutes socketRef={socketRef.current} />}>
          <Route
            path="/login"
            element={<Login socketRef={socketRef.current} />}
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
