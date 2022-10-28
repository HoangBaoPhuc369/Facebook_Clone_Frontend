import "./style.css";
import Message from "./Message";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import useTyping from "../../hooks/useTyping";
import ChatBoxHeader from "./chatBoxHeader";
import ChatBoxBottom from "./chatBoxBottom";

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
  const { user } = useSelector((user) => ({ ...user }));
  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(messagesChat);
  const [showTyping, setShowTyping] = useState([]);

  const inputRef = useRef(null);
  const scrollRef = useRef();
  const scrollTypingRef = useRef();

  useEffect(() => {
    arrivalMessage &&
      currentChat?._id === arrivalMessage.currentChatId &&
      currentChat?.members.some((m) => m._id === arrivalMessage?.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

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

    const message = {
      text: newMessage,
      user: friendChat?._id,
    };

    socket.current.emit("sendMessage", {
      senderId: user.id,
      receiverId: friendChat._id,
      currentChatId: currentChat?._id,
      text: newMessage,
    });

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/chat/message`,
        message,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setMessages([...res.data.messages]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, scrollBottom]);

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
      <div className="ChatBox_wrapper" id={currentChat?._id}>
        <div className="ChatBox_display">
          <ChatBoxHeader
            friendChat={friendChat}
            currentChat={currentChat}
            onlineUser={onlineUser}
          />

          <div className="ChatBox_container">
            {messages?.map((message, i) => (
              <div key={i}>
                <Message
                  message={message}
                  ownUser={message?.sender == user.id}
                  friendChat={friendChat}
                  typingUsers={typingUsers}
                />
              </div>
            ))}

            {showTyping.map((userId, index) => (
              <div
                key={messages.length + index}
                ref={scrollTypingRef}
                className="chat-typing"
              >
                <img
                  src={friendChat?.picture}
                  className="chat-typing-img"
                  alt=""
                />
                <div className="details">
                  <BeatLoader />
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
