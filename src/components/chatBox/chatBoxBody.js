import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import useTyping from "../../hooks/useTyping";
import ChatBoxBottom from "./chatBoxBottom";
import Message from "./Message";
import DotLoader from "./DotLoader";
import { useDispatch } from "react-redux";
import { sendMessageChat } from "../../redux/features/conversationSlice";

export default function ChatBoxBody({
  socket,
  friendChat,
  user,
  setTypingUsers,
  typingUsers,
  currentChat,
  messagesChat,
  scrollBottom,
  color,
}) {
  const scrollTypingRef = useRef();
  const scrollRef = useRef();
  const inputRef = useRef(null);

  const [showTyping, setShowTyping] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [getLastSeenMessage, setGetLastSeenMessage] = useState(null);

  const dispatch = useDispatch();

  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping();

  const checkUsers = (users, user) => {
    // console.log("users", users);
    // console.log("user", user);
    // console.log(
    //   "filter",
    //   users.filter((u) => u !== user)
    // );
    return users.filter((u) => u !== user);
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
    socket?.on("start typing message", (typingInfo) => {
      if (typingInfo.senderId !== socket.id) {
        const user = typingInfo.user;
        setTypingUsers((users) => {
          if (!users.includes(user)) {
            return [...users, user];
          } else {
            return users;
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const lastSeenMessage = messagesChat.filter((m) => m.status === "seen");
    setGetLastSeenMessage(lastSeenMessage[lastSeenMessage.length - 1]?._id);
  }, [messagesChat]);

  useEffect(() => {
    // typingUsers &&
    //   currentChat?.members.some((m) => m._id === typingUsers[0]) &&
    //   setShowTyping(() => [typingUsers]);

    typingUsers &&
      currentChat?.members.some((m) => typingUsers?.some((c) => c === m._id)) &&
      setShowTyping(() => [...typingUsers]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingUsers]);

  const startTypingMessage = () => {
    if (!socket) return;
    socket.emit("start typing message", {
      senderId: socket.id, //socket của người gửi
      receiverId: friendChat._id, // id của người nhận
      user: user.id,
    });
  };

  const stopTypingMessage = () => {
    if (!socket) return;
    socket?.emit("stop typing message", {
      senderId: socket?.id,
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
        socket,
        userToken: user.token,
        currentChatId: currentChat?._id,
      })
    );
    setNewMessage("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesChat, scrollBottom]);
  return (
    <>
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
              {user?.friends?.some((f) => f._id === friendChat._id) ? (
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
              user={user}
              message={message}
              friendChat={friendChat}
              typingUsers={typingUsers}
              messagesChat={messagesChat}
              ownUser={message?.sender === user.id}
              getLastSeenMessage={getLastSeenMessage}
            />
          </div>
        ))}

        {showTyping && showTyping.length > 0
          ? showTyping.map((userId, index) => {
              if (currentChat.members.some((m) => m?._id === userId)) {
                return (
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
                );
              }
              return null;
            })
          : null}

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
    </>
  );
}
