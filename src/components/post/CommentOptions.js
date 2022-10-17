import BubbleOptions from "../../svg/BubbleOptions";
import { useState } from "react";
import DeletePostPopUp from "../deletePost";

export default function CommentOptions({
  commentId,
  setIsOpen,
  setActiveComment,
  setShowOptionComment,
}) {
  return (
    <div className="comment_options-form">
      <div className="comment_options-form-wrapper">
        <div
          className="comment_options-update comment-option-item"
          onClick={() => {
            setActiveComment({ id: commentId, type: "editing" });
            setShowOptionComment((prev) => !prev);
          }}
        >
          Edit
        </div>
        <div
          className="comment_options-delete comment-option-item"
          onClick={() => {
            setIsOpen(true);
            setShowOptionComment((prev) => !prev);
            setActiveComment({
              id: commentId,
              type: "deleteComment",
            });
          }}
        >
          Delete
        </div>
        <BubbleOptions color={"var(--bg-primary)"} className={"bubble-top"} />
      </div>
    </div>
  );
}
