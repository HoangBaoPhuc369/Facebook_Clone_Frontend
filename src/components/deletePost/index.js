import React from "react";
import ReactDom from "react-dom";
import { deleteComment } from "../../functions/post";
import { deleteCommentInProfile } from "../../redux/features/profileSlice";
import { deleteCommentInFeed } from "../../redux/features/postSlice";
import "./style.css";
import { deleteCommentInDetails } from "../../redux/features/notificationSlice";

export default function DeletePostPopUp({
  open,
  props,
  postId,
  onClose,
  profile,
  details,
  dispatch,
  children,
}) {
  if (!open) return null;

  const handleDeleteComment = async () => {
    const response = await deleteComment(props);
    if (response.status === "ok") {
      if (profile) {
        dispatch(
          deleteCommentInProfile({
            postId,
            comments: response.data,
          })
        );
      } else if (details) {
        dispatch(
          deleteCommentInDetails({
            comments: response.data,
          })
        );
      } else {
        dispatch(
          deleteCommentInFeed({
            postId,
            comments: response.data,
          })
        );
      }
      onClose();
    } else {
      console.log("Something went wrong");
    }
  };

  return ReactDom.createPortal(
    <>
      <div className="blur-background">
        <div className="absolute z-[999999]">
          <div className="box_form">
            <div className="box_header">
              <div className="small_circle" onClick={onClose}>
                <i className="exit_icon"></i>
              </div>
              <span>Delete comment</span>
            </div>
            <div className="box_container">{children}</div>
            <div className="box_footer">
              <button
                className="box_action"
                onClick={() => {
                  handleDeleteComment();
                }}
              >
                Delete
              </button>
              <button className="box_cancel" onClick={onClose}>
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
}
