import "./style.css";
import Message from "./Message";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useTyping from "../../hooks/useTyping";
import ChatBoxHeader from "./chatBoxHeader";
import ChatBoxBottom from "./chatBoxBottom";
import DotLoader from "./DotLoader";
import { useDispatch } from "react-redux";
import { sendMessageChat } from "../../redux/features/conversationSlice";

export default function ChatBox({
  socket,
  friendChat,
  messagesChat,
  currentChat,
  arrivalMessage,
  typingUsers,
  setTypingUsers,
  onlineUser,
  scrollBottom,
}) {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(messagesChat);
  const [showTyping, setShowTyping] = useState([]);

  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const scrollRef = useRef();
  const scrollTypingRef = useRef();

  // console.log("messagesChat", messagesChat);

  useEffect(() => {
    const checkFiendChat = currentChat?.members.some(
      (m) => m._id === arrivalMessage?.sender
    );
    if (arrivalMessage) {
      if (currentChat?._id === arrivalMessage.currentChatId && checkFiendChat) {
        setMessages((prev) => [...prev, arrivalMessage]);
      }
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    // console.log(arrivalMessage);
    socket.current.emit("messageDelivered", arrivalMessage);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage]);

  useEffect(() => {
    socket.current.on("getMessageDelivered", (message) => {
      if (message.currentChatId === currentChat?._id) {
        const id = messagesChat[messagesChat.length]?._id;
        console.log("response", message);
        console.log("messagesChat", messagesChat)
        console.log("messageId", messagesChat[messagesChat.length -1])
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUsers = (users, user) => {
    return users.filter((u) => u?.id !== user.id);
  };

  useEffect(() => {
    socket.current?.on("stop typing message", (typingInfo) => {
      if (typingInfo.senderId !== socket.current.id) {
        const user = typingInfo.user;
        setTypingUsers((users) => checkUsers(users, user));
        setShowTyping((users) => checkUsers(users, user));
      }
    });
  }, []);

  useEffect(() => {
    typingUsers &&
      currentChat?.members.some((m) => m._id === typingUsers[0]) &&
      setShowTyping(() => [typingUsers]);
  }, [typingUsers]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    cancelTyping();

    socket.current.emit("sendMessage", {
      senderId: user.id,
      receiverId: friendChat._id,
      currentChatId: currentChat?._id,
      text: newMessage,
      image: "",
      status: "delivered",
    });

    const message = {
      text: newMessage,
      user: friendChat?._id,
      image: "",
    };

    dispatch(
      sendMessageChat({
        message,
        userToken: user.token,
        currentChatId: currentChat?._id,
      })
    );
    setNewMessage("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesChat, scrollBottom]);

  const startTypingMessage = () => {
    if (!socket.current) return;
    socket.current.emit("start typing message", {
      senderId: socket.current.id,
      receiverId: friendChat._id,
      user: user.id,
    });
  };

  const stopTypingMessage = () => {
    if (!socket.current) return;
    socket.current.emit("stop typing message", {
      senderId: socket.current.id,
      receiverId: friendChat._id,
      user: user.id,
    });
  };

  useEffect(() => {
    if (isTyping) startTypingMessage();
    else stopTypingMessage();
  }, [isTyping]);

  useEffect(() => {
    scrollTypingRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [showTyping]);

  return (
    <>
      <div className="chatBox_wrapper">
        <div className="chatBox_display">
          <ChatBoxHeader
            friendChat={friendChat}
            currentChat={currentChat}
            onlineUser={onlineUser}
          />

          <div className="chatBox_container">
            <div className="chatBox_information-wrapper">
              <div className="chatBox_information">
                <div className="chatBox_information-avatar-wrap">
                  <img
                    src={friendChat?.picture}
                    className="chatBox_information-avatar"
                    alt=""
                  />
                </div>
                <div className="chatBox_information-name">
                  <span>
                    {friendChat?.first_name} {friendChat?.last_name}
                  </span>
                </div>
                <div className="chatBox_information-about">
                  <span>Facebook</span>
                </div>
                <div className="chatBox_information-about">
                  {user.following.some((f) => f._id === friendChat._id) ? (
                    <span>You're friends on Facebook</span>
                  ) : (
                    <span>You're not friends on Facebook</span>
                  )}
                </div>
                <div className="chatBox_information-about">
                  <span>New Facebook Account</span>
                </div>
              </div>
            </div>

            {messagesChat?.map((message, i) => (
              <div key={i}>
                <Message
                  message={message}
                  ownUser={message?.sender === user.id}
                  friendChat={friendChat}
                  typingUsers={typingUsers}
                />
              </div>
            ))}

            {showTyping.map((userId, index) => (
              <div
                key={messagesChat.length + index}
                ref={scrollTypingRef}
                className="chat-typing"
              >
                <img
                  src={friendChat?.picture}
                  className="chat-typing-img"
                  alt=""
                />
                <div className="details">
                  <DotLoader />
                </div>
              </div>
            ))}
            <div className="chatBox-scroll" ref={scrollRef}></div>
          </div>

          <ChatBoxBottom
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            startTyping={startTyping}
            stopTyping={stopTyping}
            inputRef={inputRef}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </>
  );
}
