import { useRef } from "react";
import { useEffect, useState } from "react";

export default function AllMessengerItem({
  user,
  friendChat,
  currentChat,
  onlineUser,
  messagesChat,
  arrivalMessage,
}) {
  const [checkOnline, setCheckOnline] = useState(false);
  const [messages, setMessages] = useState(messagesChat);

  // const arrivalRef = useRef(null);

  useEffect(() => {
    setCheckOnline(onlineUser?.some((f) => f._id === friendChat._id));
  }, [onlineUser]);

  const getArrivalMessage = (id) => {
    document.getElementById(`arrival-message` + id)?.classList.add("all_messenger-arrival-message");
  };

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?._id === arrivalMessage.currentChatId &&
      currentChat?.members.some((m) => m._id === arrivalMessage?.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
      getArrivalMessage(currentChat?._id);
    }
  }, [arrivalMessage, currentChat]);

  return (
    <div
      className="all_messenger_item hover1"
      // onClick={() => handleCloseArrivalMessage(currentChat?._id)}
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

          {messages &&
          messages.length > 0 &&
          messages[messages.length - 1].sender === user.id ? (
            <span>You: {messages[messages.length - 1].text}</span>
          ) : (
            <span
              className="arrival-message"
            >
              {messages[messages.length - 1]?.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
