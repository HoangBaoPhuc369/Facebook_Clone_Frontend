import { useEffect, useRef, useState } from "react";
import AllMessengerItem from "./AllMessengerItem";
import ChatBox from "../chatBox";
import { createPortal } from "react-dom";
import { registerPopup } from "../../helpers/displayChatBox";
import { io } from "socket.io-client";

export default function AllMessenger({
  user,
  setShowAllMessenger,
  display,
  onlineUser,
  setOnlineUsers,
  conversations,
}) {
  const [typingUsers, setTypingUsers] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [closeArrivalMessage, setCloseArrivalMessage] = useState(false);

  const socketRef = useRef();

  // Get message from socketRef io
  useEffect(() => {
    socketRef.current = io("ws://localhost:8900");
    socketRef.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        currentChatId: data?.currentChatId,
        createdAt: new Date(Date.now()),
      });
      // setCloseArrivalMessage(true);
    });

    socketRef.current.on("start typing message", (typingInfo) => {
      if (typingInfo.senderId !== socketRef.current.id) {
        const user = typingInfo.user;
        setTypingUsers((users) => [...users, user]);
      }
    });
  }, []);

  useEffect(() => {
    socketRef.current.emit("addUser", user.id);
    socketRef.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.following.filter((f) => users.some((u) => u.userId === f._id))
      );
    });
  }, [user]);

  const getFiendChat = (current) => {
    return current.members.find((m) => m._id !== user.id);
  };

  return (
    <div className="all_messenger" style={{ display: display }}>
      <div className="scrollbar all_messenger_container">
        <div className="all_messenger_header">Chat</div>
        <div className="all_messenger_wrap">
          <div className="all_messenger_content">
            <div className="all_messenger_search">
              <i className="amm_s_ic"></i>
              <input type="text" placeholder="Search Messenger" />
            </div>
            <div className="all_messenger_group">
              <div className="all_messenger_group_header">Inbox</div>
              {conversations?.map((c) => (
                <div key={c._id}>
                  <div
                    onClick={() => {
                      registerPopup(c._id);
                      setShowAllMessenger(false);
                      // setCloseArrivalMessage(true);
                    }}
                  >
                    <AllMessengerItem
                      user={user}
                      currentChat={c}
                      onlineUser={onlineUser}
                      messagesChat={c.messages}
                      friendChat={getFiendChat(c)}
                      arrivalMessage={arrivalMessage}
                      closeArrivalMessage={closeArrivalMessage}
                      setCloseArrivalMessage={setCloseArrivalMessage}
                    />
                  </div>
                  {createPortal(
                    <ChatBox
                      onlineUser={onlineUser}
                      friendChat={getFiendChat(c)}
                      messagesChat={c.messages}
                      currentChat={c}
                      arrivalMessage={arrivalMessage}
                      socket={socketRef}
                      typingUsers={typingUsers}
                      setTypingUsers={setTypingUsers}
                    />,
                    document.getElementById("wrapper")
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="all_messenger_bottom">
        <a href="/" className="messenger_link">
          <span className="messenger_bottom_text">See all in Messenger</span>
        </a>
      </div>
    </div>
  );
}
