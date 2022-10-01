import { useEffect, useRef, useState } from "react";
import { useChatBox } from "../../context/ChatBoxContex";
import AllMessengerItem from "./AllMessengerItem";
import axios from "axios";
import Chatbox from "../chatBox";
import { createPortal } from "react-dom";
import { registerPopup } from "../../helpers/displayChatBox";
import { io } from "socket.io-client";

export default function AllMessenger({
  user,
  setShowAllMessenger,
  display,
  setOnlineUsers,
  conversations,
  // setGetConversationId,
}) {
  const [typingUsers, setTypingUsers] = useState([]);
  // const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const [onlineUser, setOnlineUsers] = useState([]);

  const socketRef = useRef();

  // //Get conversation
  // useEffect(() => {
  //   const getConversations = async () => {
  //     try {
  //       const res = await axios.put(
  //         `${process.env.REACT_APP_BACKEND_URL}/chat/conversations`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${user.token}`,
  //           },
  //         }
  //       );
  //       setConversations(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getConversations();
  // }, []);

  // Get message from socketRef io
  useEffect(() => {
    socketRef.current = io("ws://localhost:8900");
    socketRef.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: new Date(Date.now()),
      });
    });

    socketRef.current.on("start typing message", (typingInfo) => {
      if (typingInfo.senderId !== socketRef.current.id) {
        const user = typingInfo.user;
        setTypingUsers((users) => [...users, user]);
      }
      console.log(`start typing message id currentId: ` + socketRef.current.id);
      console.log(
        `get typing from socket id currentId: ` + typingInfo.senderId
      );
      console.log(`typinginfo: ` + typingInfo.user);
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
              {conversations.map((c) => (
                <div key={c._id}>
                  <div
                    onClick={() => {
                      registerPopup(c._id);
                      setShowAllMessenger(false);

                    }}
                  >
                    <AllMessengerItem
                      friendChat={c.members.find((m) => m._id !== user.id)}
                    />
                  </div>
                  {createPortal(
                    <Chatbox
                      friendChat={c.members.find((m) => m._id !== user.id)}
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
