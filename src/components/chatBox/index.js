import "./style.css";
import { useSelector } from "react-redux";
import { useEffect} from "react";
import ChatBoxHeader from "./chatBoxHeader";
import { useDispatch } from "react-redux";
import {
  clearMessageSuccess,
  deliveredMessageChat,
  seenAllMessageChat,
  seenMessageChat,
  setCurrentChatBox,
  setDeliveredMessage,
  setSeenMessage,
} from "../../redux/features/conversationSlice";
import ChatBoxBody from "./chatBoxBody";

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

  const dispatch = useDispatch();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
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

  const color =
    chatBox.currentChatBox === currentChat?._id ? "#0084ff" : "var(--bg-fifth)";

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
            user={user}
            socket={socket}
            chatBox={chatBox}
            friendChat={friendChat}
            onlineUser={onlineUser}
            currentChat={currentChat}
          />

          <ChatBoxBody
            socket={socket}
            friendChat={friendChat}
            user={user}
            setTypingUsers={setTypingUsers}
            typingUsers={typingUsers}
            currentChat={currentChat}
            messagesChat={messagesChat}
            scrollBottom={scrollBottom}
            color={color}
          />
        </div>
      </div>
    </>
  );
}
