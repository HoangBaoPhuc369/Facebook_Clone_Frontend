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
  getConversations,
  seenAllConversationsChat,
  setConversation,
} from "./redux/features/conversationSlice";
import {
  getNewNotifications,
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

const Msg = ({ picture, text, icon, name, type }) => (
  <>
    <div className="notification-box_header">
      <span>New notification</span>
    </div>
    <div className="notification-box_container">
      <div className="notification-picture mr-[10px]">
        <img className="noftification-avatar" src={picture} alt="" />
        {type !== "react" ? (
          <div className="absolute bottom-2 right-0 w-5 h-5">
            <i className={`notification_${type}_icon`}></i>
          </div>
        ) : (
          <img
            className="absolute bottom-2 right-0 w-5 h-5"
            src={`../../../reacts/${icon}.svg`}
            alt=""
          />
        )}
      </div>
      <div className="notification-information">
        <div className="notification-text">
          <span>{name}</span> {text}
        </div>
        <span className="notification-time">a few second ago</span>
      </div>
    </div>
  </>
);

function App() {
  const [visible, setVisible] = useState(false);
  const [onlineUser, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { page } = useSelector((state) => ({ ...state.pageSite }));
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

    console.log(newSocket);
    if (user) {
      newSocket.emit("joinUser", user.id);

      dispatch(
        seenAllConversationsChat({
          userToken: user?.token,
        })
      );

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
      setOnlineUsers(activeUsers);
      dispatch(setActiveUsers(activeUsersSocket));
    });

    setSocketRef(newSocket);
    handleWSSCallInParent(newSocket);
    return () => newSocket.close();
  }, [user]); //

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

  useEffect(() => {
    if (user) {
      socketRef?.on("seenAllConversations", (data) => {
        console.log();
        dispatch(setConversation(data));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, socketRef]);

  useEffect(() => {
    socketRef?.on("getNotification", (data) => {
      console.log(data);
      //Cho nay chi can day vo state khong can call api
      dispatch(getNotification({ userToken: user?.token }));
      dispatch(getNewNotifications(data));

      toast(
        <Msg
          picture={data?.picture}
          text={data?.text}
          icon={data?.icon}
          name={data?.name}
          type={data?.type}
        />,
        {
          className: "notification_form",
          toastClassName: "notification_toast",
          bodyClassName: "notification_body",
          position: "bottom-left",
          hideProgressBar: true,
          autoClose: 3000,
          transition: bounce,
        }
      );
    });

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
                  // setVisibleDelPost={setVisibleDelPost}
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
