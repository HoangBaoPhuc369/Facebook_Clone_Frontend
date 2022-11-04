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
  return (
    <>
      {ownUser ? (
        <div className="message-group-sent">
          <div className="message-sent">
            <div className="message-sent-text">{message?.text}</div>
            <div className="message-sent-status">
              {message?._id === getLastSeenMessage ? (
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
              <img src={friendChat?.picture} alt="" />
            </div>
            <div>
              <div className="message-received">
                <div className="message-received-text">{message?.text}</div>
              </div>
            </div>
          </div>
          <div className="message-sent-status">
            {message?._id === getLastSeenMessage ||
            message?.status === "delivered" ? (
              <img src={friendChat?.picture} alt="" />
            ) : null}
          </div>
        </div>
      )}
      {/* <div className="message-friend-createAt">{format(message?.createdAt)}</div> */}
    </>
  );
}
