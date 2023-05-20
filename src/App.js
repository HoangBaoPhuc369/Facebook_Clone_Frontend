import { Routes, Route, Link } from "react-router-dom";
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
} from "./redux/features/postSlice";
import {
  deliveredAllConversationsChat,
  getConversations,
  setConversation,
} from "./redux/features/conversationSlice";
import {
  getNotification,
} from "./redux/features/notificationSlice";
import { io } from "socket.io-client";
import { handleWSSCallInParent } from "./utils/wssConnection/wssConnectionInParent";
import Test from "./components/test";
import { setActiveUsers } from "./redux/features/dashboardSlice";
import { ToastContainer, cssTransition, toast } from "react-toastify";
import CreatePostSharePopup from "./components/createPostSharePopup";
import DetailsNotifications from "./components/detailsNotifications";
import { IoIosCheckmarkCircle } from "react-icons/io";
import Header from "./components/header";
import socketRef from "./socket/socket";

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

  useEffect(() => {
    if (user?.token) {
      // dispatch(getAllPosts({ userToken: user?.token }));
      dispatch(getNotification({ userToken: user?.token }));
      // dispatch(getConversations({ userToken: user?.token }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (user) {
      socketRef.emit("joinUser", user.id);

      dispatch(
        deliveredAllConversationsChat({
          userToken: user?.token,
        })
      );

      socketRef?.emit("addUser", {
        userId: user?.id,
        userName: `${user?.first_name} ${user?.last_name}`,
        picture: user?.picture,
        timeJoin: new Date(),
      });
    }

    socketRef?.on("getUsers", (users) => {
      const activeUsers = user.friends.filter((f) =>
        users.some((u) => u.userId === f._id)
      );

      const activeUsersSocket = users.filter(
        (activeUser) =>
          activeUser.socketId !== socketRef?.id &&
          user.friends.some((u) => u._id === activeUser.userId)
      );
      setOnlineUsers(activeUsers);
      dispatch(setActiveUsers(activeUsersSocket));
    });

    // setSocketRef(socketRef);
    handleWSSCallInParent(socketRef);
    return () => socketRef.close();
  }, [user]);

  useEffect(() => {
    if (socketRef) {
      socketRef.on("getUsers", (users) => {
        const activeUsers = user.friends.filter((f) =>
          users.some((u) => u.userId === f._id)
        );

        const activeUsersSocket = users.filter(
          (activeUser) =>
            activeUser.socketId !== socketRef?.id &&
            user.friends.some((u) => u._id === activeUser.userId)
        );
        // console.log(friends);
        setOnlineUsers(activeUsers);
        dispatch(setActiveUsers(activeUsersSocket));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef]);

  useEffect(() => {
    if (socketRef) {
      socketRef.on("startPostCommentTyping", () => {
        dispatch(handleAddUserTypingPost(true));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socketRef) {
      socketRef.on("stopPostCommentTyping", () => {
        dispatch(handleRemoveUserTypingPost(false));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      socketRef?.on("deliveredAllConversations", (data) => {
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

      {socketRef && user ? (
        <Header
          page={page}
          socketRef={socketRef}
          onlineUser={onlineUser}
          setOnlineUsers={setOnlineUsers}
        />
      ) : null}

      <Routes>
        <Route element={<LoggedInRoutes socketRef={socketRef} />}>
          <Route
            path="/profile"
            element={
              socketRef ? (
                <Profile
                  socketRef={socketRef}
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
              socketRef ? (
                <Profile
                  socketRef={socketRef}
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
                socketRef={socketRef}
                onlineUser={onlineUser}
                setOnlineUsers={setOnlineUsers}
                toastDetailsPost={toastDetailsPost}
              />
            }
            exact
          />
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
