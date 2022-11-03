import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../style.css";
// import { format } from "timeago.js";

export default function Message({
  message,
  ownUser,
  friendChat,
  messagesChat,
}) {
  
  return (
    <>
      {ownUser ? (
        <div className="message-group-sent">
          <div className="message-sent">
            <div className="message-sent-text">{message?.text}</div>
            <div className="message-sent-status">
              {message?.status === "delivered" ? (
                <FontAwesomeIcon icon={faCircleCheck} className="delivered" />
              ) : message?.status === "seen" ? (
                <img src={friendChat?.picture} alt="" />
              ) : (
                <FontAwesomeIcon icon={faCheckCircle} />
              )}
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
            <img src={friendChat?.picture} alt="" />
          </div>
        </div>
      )}
      {/* <div className="message-friend-createAt">{format(message?.createdAt)}</div> */}
    </>
  );
}
