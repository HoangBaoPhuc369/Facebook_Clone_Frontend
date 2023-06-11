import "./style.css";
import { Link } from "react-router-dom";
import {
  Friends,
  FriendsActive,
  Gaming,
  Home,
  HomeActive,
  Market,
  Menu,
  Messenger,
  Notifications,
  Search,
  Watch,
} from "../../svg";
import { useDispatch, useSelector } from "react-redux";
import SearchMenu from "./SearchMenu";
import { useRef, useState, useEffect } from "react";
import AllMenu from "./AllMenu";
import useClickOutside from "../../helpers/clickOutside";
import UserMenu from "./userMenu";
import AllMessenger from "./AllMessenger";
import ChatBox from "../chatBox";
import { getAllPosts } from "../../redux/features/postSlice";
import {
  clearNewMessage,
  getConversations,
  getNewFriendMessage,
  getNewMessage,
  removeChatBoxWaiting,
  seenAllMessageChat,
  setChatBox,
  setDeliveredMessage,
  setSeenMessage,
} from "../../redux/features/conversationSlice";
import AllNotifications from "./AllNotifications";
import {
  clearNewNotifications,
  getNewNotifications,
  getNotification,
} from "../../redux/features/notificationSlice";
import "animate.css/animate.min.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, cssTransition } from "react-toastify";
import { setActiveUsers } from "../../redux/features/dashboardSlice";
import NotificationPopUp from "../notificationPopUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { setPage } from "../../redux/features/pageSlice";
import { useLocation } from "react-router-dom";
import { updateProfile } from "../../redux/features/profileSlice";
import { getFriendsInformation } from "../../redux/features/authSlice";

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

const ReportNoftication = ({ text, icon }) => (
  <>
    <div className="notification-box_header">
      <span>New notification</span>
    </div>
    <div className="notification-box_container">
      <div className="notification-picture mr-[10px]">
        <div
          className="w-14 h-14 flex flex-wrap justify-center content-center bg-yellow-400
            rounded-full mr-2.5 text-white text-2xl"
        >
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </div>
        <img
          className="absolute bottom-2 right-[7px] w-5 h-5"
          src={icon}
          alt=""
        />
      </div>
      <div className="notification-information">
        <div className="notification-text">{text}</div>
        <span className="notification-time">a few second ago</span>
      </div>
    </div>
  </>
);
//

const bounce = cssTransition({
  enter: "animate__animated animate__bounceInUp",
  exit: "animate__animated animate__bounceOutDown",
});

export default function Header({
  page,
  onlineUser,
  setOnlineUsers,
  socketRef,
}) {
  const location = useLocation();
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { callState, callerUser } = useSelector((state) => ({ ...state.call }));
  const { newNotifications } = useSelector((state) => ({
    ...state.notification,
  }));
  const { conversations, chatBox, newMessage } = useSelector((state) => ({
    ...state.messenger,
  }));
  const color = "#65676b";
  const dispatch = useDispatch();
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showAllMessenger, setShowAllMessenger] = useState(false);
  const [showAllNotification, setShowAllNotification] = useState(false);

  const allmenu = useRef(null);
  const usermenu = useRef(null);
  const messenger = useRef(null);
  const notificationRef = useRef(null);
  useClickOutside(allmenu, () => {
    setShowAllMenu(false);
  });
  useClickOutside(messenger, () => {
    setShowAllMessenger(false);
  });
  useClickOutside(usermenu, () => {
    setShowUserMenu(false);
  });
  useClickOutside(notificationRef, () => {
    setShowAllNotification(false);
  });

  const showChatBox = [];

  for (let i = 0; i < chatBox.chatBoxVisible?.length; i++) {
    let element = chatBox.chatBoxVisible[i];
    for (let j = 0; j < conversations?.length; j++) {
      if (element === conversations[j]._id) {
        showChatBox.push(conversations[j]);
      }
    }
  }

  //================================================================
  const [typingUsers, setTypingUsers] = useState([]);
  const [scrollBottom, setScrollBottom] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [closeArrivalMessage, setCloseArrivalMessage] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      dispatch(setPage("home"));
    } else if (path === "/friends") {
      dispatch(setPage("friends"));
    } else if (path === "/profile") {
      dispatch(setPage("profile"));
    } else if (path.startsWith("/details-notification")) {
      dispatch(setPage("details-notification"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Get message from socketRef io
  useEffect(() => {
    // socketRef = io("ws://localhost:8900", { transports: ["polling"] });
    socketRef?.on("getMessage", ({ messages, currentChatID }) => {
      const message = { messages, currentChatID };
      dispatch(
        getNewFriendMessage({
          currentChatId: currentChatID,
          data: messages,
        })
      );
      setArrivalMessage(message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef?.on("postNotification", (data) => {
      toast(
        <Msg
          picture={data?.from.picture}
          text={data?.text}
          icon={data?.icon}
          name={data?.from?.first_name + " " + data?.from?.last_name}
          type="post"
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
      //Cho nay chi can day vo state khong can call api
      dispatch(getNotification({ userToken: user?.token }));
      dispatch(getNewNotifications(data));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef?.on("toxicNotification", async (data) => {
      await toast(
        <ReportNoftication
          icon="../../../icons/logo_fake.png"
          text={data.text}
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

      await dispatch(getNotification({ userToken: user?.token }));
      await dispatch(getNewNotifications(data));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef?.on("reactPostNotification", (data) => {
      toast(
        <Msg
          picture={data?.from?.picture}
          text={data?.text}
          icon={data?.icon}
          name={data?.from?.first_name + " " + data?.from?.last_name}
          type={data?.icon}
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

      dispatch(getNotification({ userToken: user?.token }));
      dispatch(getNewNotifications(data));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef?.on("commentNotification", (data) => {
      toast(
        <Msg
          picture={data?.from?.picture}
          text={data?.text}
          icon={data?.icon}
          name={data?.from?.first_name + " " + data?.from?.last_name}
          type={data?.icon}
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

      dispatch(getNotification({ userToken: user?.token }));
      dispatch(getNewNotifications(data));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef?.on("friendSentRequest", (data) => {
      toast(
        <Msg
          picture={data?.from?.picture}
          text={data?.text}
          icon={data?.icon}
          name={data?.from?.first_name + " " + data?.from?.last_name}
          type={data?.icon}
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

      const pathCurrent = location.pathname;
      dispatch(getNotification({ userToken: user?.token }));
      dispatch(getNewNotifications(data));
      const userName = data?.from?.username;
      const friendPath = `/profile/${userName}`;
      if (pathCurrent === friendPath) {
        dispatch(
          updateProfile({
            userName,
            token: user?.token,
          })
        );
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef?.on("deleteRequest", (data) => {
      const pathCurrent = location.pathname;
      const userName = data;
      const friendPath = `/profile/${userName}`;
      if (pathCurrent === friendPath) {
        dispatch(
          updateProfile({
            userName,
            token: user?.token,
          })
        );
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef?.on("unfriend", (data) => {
      const pathCurrent = location.pathname;
      const userName = data;
      const friendPath = `/profile/${userName}`;
      console.log(userName);
      dispatch(getFriendsInformation({ token: user?.token }));
      dispatch(getConversations({ userToken: user?.token }));

      if (pathCurrent === friendPath) {
        dispatch(
          updateProfile({
            userName,
            token: user?.token,
          })
        );
      } else if (pathCurrent === "/") {
        //Xử lý load lại post ở new Feed ở đây, tạo hàm gọi api khác với getPosts
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef?.on("cancelRequest", (data) => {
      const pathCurrent = location.pathname;
      const userName = data;
      const friendPath = `/profile/${userName}`;
      if (pathCurrent === friendPath) {
        dispatch(
          updateProfile({
            userName,
            token: user?.token,
          })
        );
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef?.on("friendRequestAccepted", (data) => {
      toast(
        <Msg
          picture={data?.from?.picture}
          text={data?.text}
          icon={data?.icon}
          name={data?.from?.first_name + " " + data?.from?.last_name}
          type={data?.icon}
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

      const pathCurrent = location.pathname;

      dispatch(getNotification({ userToken: user?.token }));
      dispatch(getNewNotifications(data));
      dispatch(getConversations({ userToken: user?.token }));
      dispatch(getFriendsInformation({ token: user?.token }));

      const userName = data?.from?.username;
      const friendPath = `/profile/${userName}`;
      if (pathCurrent === friendPath) {
        dispatch(
          updateProfile({
            userName,
            token: user?.token,
          })
        );
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef?.on("getUsers", (users) => {
      const activeUsers = user?.friends.filter((f) =>
        users.some((u) => u.userId === f._id)
      );

      const activeUsersSocket = users.filter(
        (activeUser) =>
          activeUser.socketId !== socketRef?.id &&
          user?.friends.some((u) => u._id === activeUser.userId)
      );
      setOnlineUsers(activeUsers);
      dispatch(setActiveUsers(activeUsersSocket));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef?.emit("messageDelivered", {
      message: arrivalMessage?.messages,
      currentChatId: arrivalMessage?.currentChatID,
    });
    dispatch(
      setDeliveredMessage({
        currentChatId: arrivalMessage?.currentChatID,
        messageId: arrivalMessage?.messages._id,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage]);

  useEffect(() => {
    if (
      arrivalMessage?.currentChatID === chatBox.currentChatBox &&
      !chatBox.chatBoxWaiting.includes(arrivalMessage?.currentChatID)
    ) {
      console.log(arrivalMessage?.messages);
      socketRef?.emit("messageSeen", {
        message: arrivalMessage?.messages,
        currentChatId: arrivalMessage?.currentChatID,
      });

      dispatch(
        setSeenMessage({
          currentChatId: arrivalMessage?.currentChatID,
          messageId: arrivalMessage?.messages._id,
        })
      );
    } else if (arrivalMessage?.currentChatID) {
      dispatch(getNewMessage(arrivalMessage?.currentChatID));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage]);

  useEffect(() => {
    if (
      arrivalMessage?.currentChatID !== chatBox.currentChatBox &&
      !chatBox.chatBoxVisible.includes(
        arrivalMessage?.currentChatID && arrivalMessage?.currentChat
      )
    ) {
      dispatch(setChatBox(arrivalMessage?.currentChatID));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage]);

  const getFiendChat = (current) => {
    return current.members.find((m) => m._id !== user.id);
  };

  const handleRemoveWaitingMessage = (
    currentChatId,
    friendChatId,
    userToken
  ) => {
    if (chatBox.chatBoxWaiting?.includes(currentChatId)) {
      dispatch(removeChatBoxWaiting(currentChatId));
      dispatch(
        seenAllMessageChat({
          userToken: userToken,
          currentChatId: currentChatId,
        })
      );
      socketRef?.emit("messageSeenAll", {
        receiverId: friendChatId,
        currentChatId: currentChatId,
      });
    }
  };

  //================================================================
  return (
    <header>
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="circle">
            {/* <Logo /> */}
            <img src="../../icons/logo_clone.svg" alt="" />
          </div>
        </Link>
        <div
          className="search search1  "
          onClick={() => {
            setShowSearchMenu(true);
          }}
        >
          <Search color={color} />
          <input
            type="text"
            placeholder="Search Net Friend"
            className="hide_input focus:outline-none appearance-none focus:ring-0"
          />
        </div>
      </div>
      {showSearchMenu && (
        <SearchMenu
          color={color}
          setShowSearchMenu={setShowSearchMenu}
          token={user.token}
        />
      )}
      <div className="header_middle">
        <Link
          to="/"
          className={`middle_icon ${page === "home" ? "active" : "hover1"}`}
          onClick={() => {
            dispatch(getAllPosts({ userToken: user.token }));
            // dispatch(setPage("home"));
          }}
        >
          {page === "home" ? <HomeActive /> : <Home color={color} />}
        </Link>
        <Link
          to="/friends"
          // onClick={() => dispatch(setPage("friends"))}
          className={`middle_icon ${page === "friends" ? "active" : "hover1"}`}
        >
          {page === "friends" ? <FriendsActive /> : <Friends color={color} />}
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Watch color={color} />
          {/* <div className="middle_notification">9+</div> */}
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Market color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1 ">
          <Gaming color={color} />
        </Link>
      </div>
      <div className="header_right">
        <div
          className={`circle_icon hover1 ${showAllMenu && "active_header"}`}
          ref={allmenu}
        >
          <div
            onClick={() => {
              setShowAllMenu((prev) => !prev);
            }}
          >
            <div style={{ transform: "translateY(2px)" }}>
              <Menu />
            </div>
          </div>

          <AllMenu display={showAllMenu ? "block" : "none"} />
        </div>
        <div
          className={`circle_icon hover1 ${
            showAllMessenger && "active_header"
          }`}
          ref={messenger}
        >
          <div
            className="icon_wrapper"
            onClick={() => {
              setShowAllMessenger((prev) => !prev);
              dispatch(clearNewMessage());
            }}
          >
            <Messenger />
          </div>
          <AllMessenger
            user={user}
            onlineUser={onlineUser}
            getFiendChat={getFiendChat}
            conversations={conversations}
            arrivalMessage={arrivalMessage}
            setOnlineUsers={setOnlineUsers}
            setScrollBottom={setScrollBottom}
            closeArrivalMessage={closeArrivalMessage}
            setShowAllMessenger={setShowAllMessenger}
            display={showAllMessenger ? "block" : "none"}
            setCloseArrivalMessage={setCloseArrivalMessage}
            handleRemoveWaitingMessage={handleRemoveWaitingMessage}
          />

          {newMessage?.length > 0 ? (
            <div className="right_notification">{newMessage.length}</div>
          ) : null}
        </div>
        <div
          className={`circle_icon hover1 ${
            showAllNotification ? "active_header" : ""
          }`}
          ref={notificationRef}
        >
          <div
            className="icon_wrapper"
            onClick={() => {
              setShowAllNotification((prev) => !prev);
              dispatch(clearNewNotifications());
            }}
          >
            <Notifications />
          </div>
          {newNotifications?.length > 0 && (
            <div className="right_notification">{newNotifications.length}</div>
          )}

          {showAllNotification && (
            <AllNotifications
              user={user}
              setShowAllNotification={setShowAllNotification}
            />
          )}
          {/* <AllNotifications /> */}
        </div>
        <div
          className={`avatar-icon-header ${showUserMenu && "active_header"}`}
          ref={usermenu}
        >
          <div
            onClick={() => {
              setShowUserMenu((prev) => !prev);
            }}
          >
            <div>
              <img className="avatar-user" src={user?.picture} alt="" />
            </div>
          </div>

          {showUserMenu && <UserMenu user={user} socket={socketRef} />}
        </div>
      </div>
      <div id="wrapper">
        {showChatBox?.map((c) => (
          <ChatBox
            key={c._id}
            currentChat={c}
            socket={socketRef}
            onlineUser={onlineUser}
            messagesChat={c.messages}
            typingUsers={typingUsers}
            scrollBottom={scrollBottom}
            friendChat={getFiendChat(c)}
            arrivalMessage={arrivalMessage}
            setTypingUsers={setTypingUsers}
            handleRemoveWaitingMessage={handleRemoveWaitingMessage}
          />
        ))}
      </div>

      {/* <ToastContainer transition={bounce} closeButton={CloseButton} limit={5} /> */}

      {callState === "CALL_REQUESTED" && (
        <NotificationPopUp
          username={callerUser.username}
          picture={callerUser.picture}
          roomId={callerUser.roomId}
        ></NotificationPopUp>
      )}
    </header>
  );
}
