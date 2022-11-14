import "./style.css";
import { Link } from "react-router-dom";
import {
  Friends,
  FriendsActive,
  Gaming,
  Home,
  HomeActive,
  Logo,
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
import { io } from "socket.io-client";
import { getAllPosts } from "../../redux/features/postSlice";
import {
  getNewFriendMessage,
  removeChatBoxWaiting,
  seenAllMessageChat,
} from "../../redux/features/conversationSlice";
import Moment from "react-moment";
import AllNotifications from "./AllNotifications";
import {
  clearNewNotifications,
  getNewNotifications,
  getNotification,
} from "../../redux/features/notificationSlice";
import "animate.css/animate.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, cssTransition } from "react-toastify";
import {
  connectWithWebSocket,
  handleBroadcastEvents,
} from "./../../utils/wssConnection/wssConnection";
import { setActiveUsers } from "../../redux/features/dashboardSlice";

const Msg = ({ picture, text, icon, name }) => (
  <>
    <div className="notification-box_header">
      <span>New notification</span>
    </div>
    <div className="notification-box_container">
      <div className="notification-picture">
        <img src={picture} alt="" />
        <i className={`notification_${icon}_icon`}></i>
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

const bounce = cssTransition({
  enter: "animate__animated animate__bounceInUp",
  exit: "animate__animated animate__bounceOutDown",
});

const CloseButton = ({ closeToast }) => (
  <div className="small_circle" onClick={closeToast}>
    <i className="exit_icon"></i>
  </div>
);

export default function Header({
  page,
  onlineUser,
  setOnlineUsers,
  socketRef,
}) {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { newNotifications } = useSelector((state) => ({
    ...state.notification,
  }));
  const { conversations, chatBox } = useSelector((state) => ({
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

  // Get message from socketRef io
  useEffect(() => {
    socketRef.current = io("ws://localhost:8900");
    console.log(socketRef.current);
    socketRef.current.on("getMessage", ({ messages, currentChatID }) => {
      const message = { messages, currentChatID };
      setArrivalMessage(message);
      dispatch(
        getNewFriendMessage({
          currentChatId: currentChatID,
          data: messages,
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   socketRef.current.on('broadcast', (data) => {
  //     handleBroadcastEvents({data, socketRef, dispatch, user});
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    socketRef.current.on("getNotification", (data) => {
      //Cho nay chi can day vo state khong can call api
      dispatch(getNotification({ userToken: user?.token }));
      dispatch(getNewNotifications(data));

      toast(
        <Msg
          picture={data?.picture}
          text={data?.text}
          icon={data?.icon}
          name={data?.name}
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
  }, []);

  useEffect(() => {
    socketRef.current.on("start typing message", (typingInfo) => {
      if (typingInfo.senderId !== socketRef.current.id) {
        const user = typingInfo.user;
        setTypingUsers((users) => [...users, user]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef.current.emit("addUser", user.id);
    socketRef.current.on("getUsers", (users) => {
      const activeUsers = user.following.filter((f) =>
        users.some((u) => u.userId === f._id)
      );

      const activeUsersSocket = users.filter(
        (activeUser) =>
          activeUser.socketId !== socketRef.current?.id &&
          user.following.some(u => u._id === activeUser.userId)
      );
      setOnlineUsers(activeUsers);
      dispatch(setActiveUsers(activeUsersSocket));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

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
      socketRef.current?.emit("messageSeenAll", {
        receiverId: friendChatId,
        currentChatId: currentChatId,
      });
    }
  };

  // console.log(Moment("20010704T120854").format("ddd"));

  //================================================================
  return (
    <header>
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="circle">
            <Logo />
          </div>
        </Link>
        <div
          className="search search1"
          onClick={() => {
            setShowSearchMenu(true);
          }}
        >
          <Search color={color} />
          <input
            type="text"
            placeholder="Search Facebook"
            className="hide_input"
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
          onClick={() => dispatch(getAllPosts({ userToken: user.token }))}
        >
          {page === "home" ? <HomeActive /> : <Home color={color} />}
        </Link>
        <Link
          to="/friends"
          className={`middle_icon ${page === "friends" ? "active" : "hover1"}`}
        >
          {page === "friends" ? <FriendsActive /> : <Friends color={color} />}
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Watch color={color} />
          <div className="middle_notification">9+</div>
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
        </div>
        <div className="circle_icon hover1" ref={notificationRef}>
          <div
            className="icon_wrapper"
            onClick={() => {
              setShowAllNotification((prev) => !prev);
              dispatch(clearNewNotifications());
            }}
          >
            <Notifications />
          </div>
          {newNotifications.length > 0 && (
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
          className={`circle_icon hover1 ${showUserMenu && "active_header"}`}
          ref={usermenu}
        >
          <div
            onClick={() => {
              setShowUserMenu((prev) => !prev);
            }}
          >
            <div style={{ transform: "translateY(2px)" }}>
              <img className="avatar-user" src={user?.picture} alt="" />
            </div>
          </div>

          {showUserMenu && <UserMenu user={user} />}
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

      <ToastContainer transition={bounce} closeButton={CloseButton} limit={5} />
    </header>
  );
}
