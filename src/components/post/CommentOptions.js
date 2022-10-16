import BubbleOptions from "../../svg/BubbleOptions";
import { useState } from "react";
import DeletePostPopUp from "../deletePost";

export default function CommentOptions() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="comment_options-form">
      <div className="comment_options-form-wrapper">
        <div className="comment_options-update comment-option-item">Edit</div>
        <div
          className="comment_options-delete comment-option-item"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Delete
        </div>
        <BubbleOptions color={"var(--bg-primary)"} className={"bubble-top"} />
      </div>

      <DeletePostPopUp open={isOpen} onClose={() => setIsOpen(false)}>
        Are you sure you want to delete this comment?
      </DeletePostPopUp>
    </div>
  );
}
