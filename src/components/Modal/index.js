import React from "react";
import ReactDom from "react-dom";
import { deleteComment } from "../../functions/post";
import { deleteCommentInProfile } from "../../redux/features/profileSlice";
import { deleteCommentInFeed } from "../../redux/features/postSlice";
import "./style.css";

export default function ModalCustom({
  open,
  title,
  footer,
  onClose,
  children,
}) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div className="blur-background">
        <div className="absolute z-[999999]">
          <div className="modal_form">
            <div className="modal_header">
              <div className="small_circle" onClick={onClose}>
                <i className="exit_icon"></i>
              </div>
              <span>{title}</span>
            </div>
            <div className="modal_container">{children}</div>
  
            {footer && <div className="modal_footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
}
