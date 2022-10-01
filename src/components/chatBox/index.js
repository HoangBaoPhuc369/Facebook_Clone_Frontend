import "./style.css";
import ArrowDown2 from "../../svg/arrowDown2";
import AttachFiles from "../../svg/attachFiles";
import FaceEmojis from "../../svg/faceEmoji";
import GifIcon from "../../svg/gif";
import LikeIcon from "../../svg/likeIcon";
import MiniMize from "../../svg/miniMize";
import PhoneCall from "../../svg/phoneCall";
import PlusIcon from "../../svg/PlusIcon";
import StickerIcon from "../../svg/sticker";
import VideoCall from "../../svg/videoCall";
import XClose from "../../svg/xClose";
import SenIcon from "../../svg/sentIcon";
import Message from "./Message";
import { closePopup } from "../../helpers/displayChatBox";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import useTyping from "../../hooks/useTyping";

export default function Chatbox({
  socket,
  friendChat,
  messagesChat,
  currentChat,
  arrivalMessage,
  typingUsers,
  setTypingUsers,
}) {
  const { user } = useSelector((user) => ({ ...user }));
  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(messagesChat);
  const [showTyping, setShowTyping] = useState([])

  const inputRef = useRef(null);
  const scrollRef = useRef();
  const scrollTypingRef = useRef();

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.some((m) => m._id === arrivalMessage?.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  const checkUsers = (users, user) => {
    return users.filter((u) => u?.id !== user.id);
  }

  useEffect(() => {
    socket.current.on("stop typing message", (typingInfo) => {
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

  const handleSendLikeIcon = () => {};

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    
  }, [currentChat, messages]);


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
      <div
        className="chatbox_wrapper"
        id={currentChat?._id}
        // onClick={() => {
        //   setColor((prev) => !prev);
        // }}
      >
        <div className="chatbox_display">
          <div className="chatbox_header">
            <div className="chatbox_header_left">
              <div className="chatbox_header_left_pad">
                <img src={friendChat?.picture} alt="" />
                <span className="chatbox_header_left_circle"></span>
                <div className="chatbox_header_left_wrapper">
                  <span className="chatbox_header_left_username">
                    {friendChat?.first_name} {friendChat?.last_name}
                  </span>
                  <br />
                  <span className="chatbox_header_left_status">Active now</span>
                </div>
                <div className="chatbox_header_left_arrow_down">
                  <ArrowDown2 color="#0084ff" />
                </div>
              </div>
            </div>
            <div className="chatbox_header_right">
              <span className="chatbox_header_right_item hover3">
                <PhoneCall color="#0084ff" />
              </span>
              <span className="chatbox_header_right_item hover3">
                <VideoCall color="#0084ff" />
              </span>
              <span className="chatbox_header_right_item hover3">
                <MiniMize color="#0084ff" />
              </span>
              <span
                className="chatbox_header_right_item hover3"
                onClick={() => {
                  closePopup(currentChat?._id);
                }}
              >
                <XClose color="#0084ff" />
              </span>
            </div>
          </div>
          <div className="chatbox_container">
            {messages?.map((message, i) => (
              <div key={i} ref={scrollRef}>
                <Message
                  message={message}
                  ownUser={message?.sender == user.id}
                  friendChat={friendChat}
                  typingUsers={typingUsers}
                />
              </div>
            ))}

            {showTyping.map((userId, index) => (
              <div key={messages.length + index} ref={scrollTypingRef} className="chat-typing">
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
          </div>
          <div className="chatbox_message_bottom">
            <div className="chatbox_message_bottom_plus_icon circle_hover_cover hover1">
              <PlusIcon color="#0084ff" />
            </div>
            <div className="chatbox_message_bottom_wrapper">
              <div className="chatbox_message_bottom_icons_wrap">
                <div className="chatbox_message_bottom_icon hover1">
                  <AttachFiles color="#0084ff" />
                </div>
                <div className="chatbox_message_bottom_icon hover1">
                  <StickerIcon color="#0084ff" />
                </div>
                <div className="chatbox_message_bottom_icon hover1">
                  <GifIcon color="#0084ff" />
                </div>
              </div>
              <div className="chatbox_message_bottom_input">
                <input
                  placeholder="Aa"
                  type="text"
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                  onKeyPress={startTyping}
                  onKeyUp={stopTyping}
                />

                <div className="face_icon circle_hover_cover hover1">
                  <FaceEmojis color="#0084ff" />
                </div>
              </div>
            </div>
            <div className="chatbox_message_bottom_like_icon circle_hover_cover">
              <span className="hover1 like_button" ref={inputRef}>
                {!newMessage ? (
                  <span onClick={handleSendLikeIcon}>
                    <LikeIcon color="#0084ff" />
                  </span>
                ) : (
                  <span onClick={handleSendMessage}>
                    <SenIcon color="#0084ff" />
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
