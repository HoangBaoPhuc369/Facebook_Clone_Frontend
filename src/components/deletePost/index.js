import React from "react";
import ReactDom from "react-dom";
import { deleteComment } from "../../functions/post";
import "./style.css";

export default function DeletePostPopUp({
  open,
  props,
  onClose,
  children,
  setComments,
}) {
  if (!open) return null;

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
    </>,
    document.getElementById("modal")
  );
}
