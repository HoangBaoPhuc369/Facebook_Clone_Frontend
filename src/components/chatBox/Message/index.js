import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "../style.css";
// import { format } from "timeago.js";

export default function Message({
  index,
  user,
  message,
  ownUser,
  friendChat,
  messagesChat,
  getLastSeenMessage,
}) {
  const checkSeenMessage = message?._id === getLastSeenMessage;

  const checkLastMsg =
    user?.id === messagesChat[messagesChat.length - 1]?.sender;

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
              {checkLastMsg ? (
                <>
                  {checkSeenMessage ? (
                    <img src={friendChat?.picture} alt="" />
                  ) : message?.status === "delivered" ? (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="delivered"
                    />
                  ) : message?.status === "unseen" ? (
                    <FontAwesomeIcon icon={faCheckCircle} />
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <div className="message-group-received">
            <div>
              {checkMessageBottomExits ? (
                <img
                  src={friendChat?.picture}
                  className="appearance-none prose"
                  style={{ width: "28px", height: "28px" }}
                  alt=""
                />
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
          <div className="message-receive-status">
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
