import React from "react";
import ReactDom from "react-dom";
import "./style.css";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "50px",
  zIndex: 1000,
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  zIndex: 1000,
};

export default function DeletePostPopUp({ open, children, onClose }) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div className="blur">
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
                // postSubmit();
              }}
            >
              Delete
            </button>
            <button
              className="box_cancle"
              onClick={() => {
                // postSubmit();
              }}
            >
              Cancle
            </button>
            {/* <span>Cancle</span> */}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
}
