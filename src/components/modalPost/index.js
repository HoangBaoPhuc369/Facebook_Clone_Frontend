import React from "react";
import ReactDom from "react-dom";
import "./style.css";

export default function ModalPost({ open, title, onClose, children }) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div className="blur-background">
        <div className="absolute z-[999999]">
          <div className="modal_post_form">
            <div className="modal_post_header">
              <div className="small_circle" onClick={onClose}>
                <i className="exit_icon"></i>
              </div>
              <span>{title}</span>
            </div>
            <div className="modal_post_container">{children}</div>
            <div className="modal_post_footer"></div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
}
