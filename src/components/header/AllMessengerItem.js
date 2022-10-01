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

  useEffect(() => {
    setCheckOnline(onlineUser.some((f) => f._id === friendChat._id));
  }, [onlineUser]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.some((m) => m._id === arrivalMessage?.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  console.log(messages[messages.length - 1].text);

  return (
    <div className="all_messenger_item hover1">
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
          <span>
            {messages &&
            messages.length > 0 &&
            messages[messages.length - 1].sender == user.id
              ? "You: " + messages[messages.length - 1].text
              : messages[messages.length - 1].text}
          </span>
        </div>
      </div>
    </div>
  );
}
