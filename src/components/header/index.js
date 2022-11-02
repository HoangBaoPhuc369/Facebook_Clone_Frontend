import "./style.css";
import { Link } from "react-router-dom";
import {
  ArrowDown,
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
import { getNewFriendMessage } from "../../redux/features/conversationSlice";

export default function Header({ page, onlineUser, setOnlineUsers }) {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { conversations, chatBox } = useSelector((state) => ({
    ...state.messenger,
  }));
  const dispatch = useDispatch();
  const color = "#65676b";
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showAllMessenger, setShowAllMessenger] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  // const [showChatBox, setShowChatBox] = useState([]);
  const allmenu = useRef(null);
  const usermenu = useRef(null);
  const messenger = useRef(null);
  useClickOutside(allmenu, () => {
    setShowAllMenu(false);
  });
  useClickOutside(messenger, () => {
    setShowAllMessenger(false);
  });
  useClickOutside(usermenu, () => {
    setShowUserMenu(false);
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

  const socketRef = useRef();

  // Get message from socketRef io
  useEffect(() => {
    socketRef.current = io("ws://localhost:8900");
    socketRef.current.on("getMessage", (data) => {
      const message = {
        sender: data.senderId,
        text: data.text,
        image: data.image,
        status: data.status,
        currentChatId: data.currentChatId,
      };
      setArrivalMessage(message);
      dispatch(
        getNewFriendMessage({
          currentChatId: data?.currentChatId,
          data: message,
        })
      );

      console.log(showChatBox)
      // socketRef.current.emit("messageDelivered", message);
    });

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
      setOnlineUsers(
        user.following.filter((f) => users.some((u) => u.userId === f._id))
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const getFiendChat = (current) => {
    return current.members.find((m) => m._id !== user.id);
  };
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

          {showAllMenu && <AllMenu />}
        </div>
        <div
          className={`circle_icon hover1 ${
            showAllMessenger && "active_header"
          }`}
          ref={messenger}
        >
          <div
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
          />
        </div>
        <div className="circle_icon hover1">
          <Notifications />
          <div className="right_notification">5</div>
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
          />
        ))}
      </div>
    </header>
  );
}
