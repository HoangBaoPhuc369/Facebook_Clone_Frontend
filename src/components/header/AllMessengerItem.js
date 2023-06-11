import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  // const [messages, setMessages] = useState(messagesChat);

  useEffect(() => {
    setCheckOnline(onlineUser?.some((f) => f._id === friendChat._id));
  }, [onlineUser]);

  const getNewMessage = messagesChat[messagesChat.length - 1];

  console.log();

  const checkNewMessage = () => {
    if (
      getNewMessage?.sender !== user.id &&
      getNewMessage?.status !== "seen" &&
      getNewMessage !== undefined
    ) {
      handleRemoveWaitingMessage(currentChat?._id, friendChat._id, user?.token);
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
          ) : getNewMessage?.status === "delivered" &&
            getNewMessage !== undefined ? (
            <span className="all_messenger-arrival-message font-medium blue-text-status">
              {getNewMessage?.text}
            </span>
          ) : (
            <span className="all_messenger-arrival-message">
              {getNewMessage?.text}
            </span>
          )}
        </div>
        <div className="all_messenger-arrival-message">
          {getNewMessage?.status === "delivered" &&
          getNewMessage?.sender !== user.id ? (
            <div className="all_messenger-arrival-message-status"></div>
          ) : getNewMessage?.status === "seen" ? (
            <img
              src={friendChat?.picture}
              className="absolute right-[7px] top-[43%] 
          rounded-full object-cover"
              alt="friend status"
            />
          ) : getNewMessage?.status === "unseen" &&
            getNewMessage?.sender === user.id ? (
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="absolute w-3 h-3 right-[7px] top-[43%] 
          status-sent-msg text-gray-400"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
