import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "../style.css";
// import { format } from "timeago.js";

export default function Message({
  index,
  message,
  ownUser,
  friendChat,
  messagesChat,
  getLastSeenMessage,
}) {
  // console.log(messagesChat[index + 1] === undefined)
  //&&
  // messagesChat[index + 1] &&
  // messagesChat[index + 1]?._id === undefined ?
  const checkSeenMessage = message?._id === getLastSeenMessage;
  const checkMessageBottomExits =
    messagesChat[index + 1]?.sender !== message?.sender;
  const checkChildrenLeft = 
    messagesChat[index - 1]?.sender !== message?.sender &&
    messagesChat[index + 1]?.sender === message?.sender
      ? "message-received_first-child"
      : messagesChat[index - 1]?.sender === message?.sender &&
        messagesChat[index + 1]?.sender === message?.sender
      ? "message-received_mid-child"
      : messagesChat[index - 1]?.sender === message?.sender &&
        messagesChat[index + 1]?.sender !== message?.sender
      ? "message-received_last-child"
      : "message-received_normal";

      const checkChildrenRight = 
    messagesChat[index - 1]?.sender !== message?.sender &&
    messagesChat[index + 1]?.sender === message?.sender
      ? "message-sent_first-child"
      : messagesChat[index - 1]?.sender === message?.sender &&
        messagesChat[index + 1]?.sender === message?.sender
      ? "message-sent_mid-child"
      : messagesChat[index - 1]?.sender === message?.sender &&
        messagesChat[index + 1]?.sender !== message?.sender
      ? "message-sent_last-child"
      : "message-sent_normal";
  return (
    <>
      {ownUser ? (
        <div className="message-group-sent">
          <div className={`message-sent ${checkChildrenRight}`}>
            <div className="message-sent-text">{message?.text}</div>
            <div className="message-sent-status">
              {checkSeenMessage ? (
                <img src={friendChat?.picture} alt="" />
              ) : message?.status === "delivered" ? (
                <FontAwesomeIcon icon={faCircleCheck} className="delivered" />
              ) : message?.status === "unseen" ? (
                <FontAwesomeIcon icon={faCheckCircle} />
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <div className="message-group-received">
            <div>
              {checkMessageBottomExits ? (
                <img src={friendChat?.picture} alt="" />
              ) : (
                <div className="message-group-received_no-image"></div>
              )}
              {/* <img src={friendChat?.picture} alt="" /> */}
            </div>
            <div>
              <div className={`message-received ${checkChildrenLeft}`}>
                <div className="message-received-text">{message?.text}</div>
              </div>
            </div>
          </div>
          <div className="message-sent-status">
            {checkMessageBottomExits &&
            (checkSeenMessage || message?.status === "delivered") ? (
              <img src={friendChat?.picture} alt="" />
            ) : null}
          </div>
        </div>
      )}
      {/* <div className="message-friend-createAt">{format(message?.createdAt)}</div> */}
    </>
  );
}
