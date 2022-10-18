import BubbleOptions from "../../svg/BubbleOptions";
import { useState } from "react";
import DeletePostPopUp from "../deletePost";

export default function CommentOptions({
  user,
  comment,
  setIsOpen,
  setActiveComment,
  setShowOptionComment,
}) {
  const canAction = user?.id === comment.commentBy?._id;

  return (
    <div className="comment_options-form">
      <div className="comment_options-form-wrapper">
        {!canAction && (
          <>
            <div className="comment-option-item">Hide comment</div>
            <div className="comment-option-item">Report comment</div>
          </>
        )}

        {canAction && (
          <>
            <div
              className="comment_options-update comment-option-item"
              onClick={() => {
                setActiveComment({ id: comment?._id, type: "editing" });
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
                  id: comment?._id,
                  type: "deleteComment",
                });
              }}
            >
              Delete
            </div>
          </>
        )}
        <BubbleOptions color={"var(--bg-primary)"} className={"bubble-top"} />
      </div>
    </div>
  );
}
