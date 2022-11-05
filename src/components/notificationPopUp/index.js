import "./style.css";
import React from "react";
import ReactDom from "react-dom";
import { deleteComment } from "../../functions/post";

export default function NotificationPopUp({
  open,
  props,
  onClose,
  children,
  setComments,
}) {
  // if (!open) return null;

  const handleDeleteComment = async () => {
    const response = await deleteComment(props);
    if (response.status === "ok") {
      setComments(response.data);
      onClose();
    } else {
      console.log("Something went wrong");
    }
  };

  return ReactDom.createPortal(
    <>
      <div className="notification-box_form">
        <div className="notification-box_header">
          <div className="small_circle" onClick={onClose}>
            <i className="exit_icon"></i>
          </div>
          <span>New notification</span>
        </div>

        <div className="notification-box_container">
          <div className="notification-picture">
            <img src={children} alt="" />
            <i className="notification_comment_icon"></i>
          </div>
          <div className="notification-information">
            <div className="notification-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
            <span className="notification-time">a few second ago</span>
          </div>
          <div className="notification-status">
            <div className="notification-status_circle"></div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
}
