import { useRef } from "react";
import { useEffect, useState } from "react";

export default function AllMessengerItem({
  user,
  friendChat,
  currentChat,
  onlineUser,
  messagesChat,
  arrivalMessage,
  handleRemoveWaitingMessage,
}) {
  const [checkOnline, setCheckOnline] = useState(false);
  const [messages, setMessages] = useState(messagesChat);

  useEffect(() => {
    setCheckOnline(onlineUser?.some((f) => f._id === friendChat._id));
  }, [onlineUser]);

  const getNewMessage = messagesChat[messagesChat.length - 1];

  const checkNewMessage = () => {
    if(getNewMessage?.sender !== user.id &&
    getNewMessage?.status !== "seen" &&
    getNewMessage !== undefined) {
      handleRemoveWaitingMessage(
        currentChat?._id,
        friendChat._id,
        user?.token
      )
    }
      
  };

  return (
    <div
      className="all_messenger_item hover1"
      onClick={() => {
        checkNewMessage();
      }}
    >
      <div className="all_messenger_item_chat">
        <img
          src={friendChat?.picture}
          alt=""
          className="all_messenger_item_img"
        />
        <div>
          {checkOnline ? (
            <span className="all_messenger_item_status"></span>
          ) : (
            <span></span>
          )}
        </div>
        <div className="all_messenger_col">
          <span>
            {friendChat?.first_name} {friendChat?.last_name}
          </span>
          {getNewMessage?.sender === user.id ? (
            <span>You: {getNewMessage?.text}</span>
          ) : getNewMessage?.status !== "seen" &&
            getNewMessage !== undefined ? (
            <span className="all_messenger-arrival-message">
              {getNewMessage?.text}
            </span>
          ) : (
            <span>{getNewMessage?.text}</span>
          )}
        </div>
        {/* all_messenger-arrival-message */}
      </div>
    </div>
  );
}
