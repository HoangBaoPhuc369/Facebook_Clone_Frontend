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
import {
  clearMessageSuccess,
  deliveredMessageChat,
  removeChatBoxWaiting,
  seenAllMessageChat,
  seenMessageChat,
  sendMessageChat,
  setCurrentChatBox,
  setDeliveredMessage,
  setSeenMessage,
} from "../../redux/features/conversationSlice";

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
  handleRemoveWaitingMessage,
}) {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { messageSendSuccess, chatBox } = useSelector((state) => ({
    ...state.messenger,
  }));
  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping();
  const [newMessage, setNewMessage] = useState("");
  const [showTyping, setShowTyping] = useState([]);

  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const scrollRef = useRef();
  const scrollTypingRef = useRef();

  //Send message to socket when call api success
  useEffect(() => {
    if (messageSendSuccess) {
      const messages = messagesChat[messagesChat.length - 1];
      const currentChatID = currentChat?._id;
      socket.emit("sendMessage", { messages, currentChatID });
      dispatch(clearMessageSuccess());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageSendSuccess]);

  useEffect(() => {
    if (arrivalMessage?.currentChatID === currentChat?._id) {
      socket?.emit("messageDelivered", {
        message: arrivalMessage?.messages,
        currentChatId: arrivalMessage?.currentChatID,
      });
      dispatch(
        setDeliveredMessage({
          currentChatId: arrivalMessage?.currentChatID,
          messageId: arrivalMessage?.messages._id,
        })
      );
    }

    if (arrivalMessage?.currentChatID === chatBox.currentChatBox) {
      socket?.emit("messageSeen", {
        message: arrivalMessage?.messages,
        currentChatId: arrivalMessage?.currentChatID,
      });

      dispatch(
        setSeenMessage({
          currentChatId: arrivalMessage?.currentChatID,
          messageId: arrivalMessage?.messages._id,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage]);

  useEffect(() => {
    socket?.on("getMessageDelivered", (data) => {
      if (data.currentChatId === currentChat?._id) {
        dispatch(
          deliveredMessageChat({
            userToken: user?.token,
            messageId: data.message?._id,
            currentChatId: data?.currentChatId,
          })
        );
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket?.on("getMessageSeen", (data) => {
      if (data.currentChatId === currentChat?._id) {
        dispatch(
          seenMessageChat({
            userToken: user?.token,
            messageId: data.message?._id,
            currentChatId: data?.currentChatId,
          })
        );
      }
    });

    socket?.on("getMessageSeenAll", (data) => {
      if (data.currentChatId === currentChat?._id) {
        dispatch(
          seenAllMessageChat({
            userToken: user?.token,
            currentChatId: data?.currentChatId,
          })
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUsers = (users, user) => {
    return users.filter((u) => u?.id !== user.id);
  };

  useEffect(() => {
    socket?.on("stop typing message", (typingInfo) => {
      if (typingInfo.senderId !== socket.id) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingUsers]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    cancelTyping();

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
    if (!socket) return;
    socket.emit("start typing message", {
      senderId: socket.id,
      receiverId: friendChat._id,
      user: user.id,
    });
  };

  const stopTypingMessage = () => {
    if (!socket) return;
    socket.emit("stop typing message", {
      senderId: socket.id,
      receiverId: friendChat._id,
      user: user.id,
    });
  };

  useEffect(() => {
    if (isTyping) startTypingMessage();
    else stopTypingMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping]);

  useEffect(() => {
    scrollTypingRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [showTyping]);

  const color =
    chatBox.currentChatBox === currentChat?._id ? "#0084ff" : "var(--bg-fifth)";

  const [getLastSeenMessage, SetGetLastSeenMessage] = useState(null);
  useEffect(() => {
    const lastSeenMessage = messagesChat.filter((m) => m.status === "seen");
    SetGetLastSeenMessage(lastSeenMessage[lastSeenMessage.length - 1]?._id);
  }, [messagesChat]);
  // console.log("render")
  return (
    <>
      <div
        className="chatBox_wrapper"
        onClick={() => {
          dispatch(setCurrentChatBox(currentChat?._id));
          handleRemoveWaitingMessage(
            currentChat?._id,
            friendChat._id,
            user?.token
          );
        }}
      >
        <div className="chatBox_display">
          <ChatBoxHeader
            chatBox={chatBox}
            friendChat={friendChat}
            onlineUser={onlineUser}
            currentChat={currentChat}
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
                  index={i}
                  message={message}
                  friendChat={friendChat}
                  typingUsers={typingUsers}
                  messagesChat={messagesChat}
                  ownUser={message?.sender === user.id}
                  getLastSeenMessage={getLastSeenMessage}
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
            color={color}
            inputRef={inputRef}
            newMessage={newMessage}
            stopTyping={stopTyping}
            startTyping={startTyping}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </>
  );
}
