import "../style.css";
// import { format } from "timeago.js";

export default function Message({ message, ownUser, friendChat}) {
  return (
    <>
      {ownUser ? (
        <div className="chat-from-user">
          <div className="chat outgoing">
            <div className="details">
              <p>{message?.text}</p>
            </div>
          </div>
          {/* <span className="message-user-createAt">{format(message?.createdAt)}</span> */}
        </div>
      ) : (
        <div className="chat-from-friend">
          <div className="chat incoming">
            <img src={friendChat?.picture} alt="" />
            <div className="details">
              <p>{message?.text}</p>
            </div>
          </div>
          {/* <div className="message-friend-createAt">{format(message?.createdAt)}</div> */}
        </div>
      )}
    </>
  );
}
