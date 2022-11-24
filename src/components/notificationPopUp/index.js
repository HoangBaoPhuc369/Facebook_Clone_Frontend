import "./style.css";
import React from "react";
import ReactDom from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setCallState } from "../../redux/features/callSlice";
export default function NotificationPopUp({
  userId,
  username,
  picture,
  roomId,
  roomSocket,
}) {
  const dispatch = useDispatch();

  const handleOpenVideoCall = () => {
    const w = 1280;
    const h = 720;
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : // eslint-disable-next-line no-restricted-globals
        screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : // eslint-disable-next-line no-restricted-globals
        screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;

    const type = "joiner";
    const videoCallWindow = window.open(
      `http://localhost:3001/video-call/?roomId=${roomId}&type=${type}`,
      "Video Call",
      `
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left},
      scrollbars=no, 
      status=no, 
      resizable=no
      `
    );
    videoCallWindow.focus();
    dispatch(setCallState("CALL_AVAILABLE"));
  };

  const handleClose = () => {
    dispatch(setCallState("CALL_AVAILABLE"));
  };

  return ReactDom.createPortal(
    <>
      <div className="call-box_form">
        <div className="call-box_container ">
          <div className="call_small_circle" onClick={handleClose}>
            <i className="exit_icon"></i>
          </div>
          <div className="call-picture">
            <img src={picture} alt="" />
          </div>
          <div className="call-information">
            <div className="call-text">{username} is calling you</div>
            <span className="call-sub-text">
              The call will start as soon as you accept
            </span>
          </div>

          <div className="call-box-btn-group">
            <div className="call-box-btn-item ">
              <div className="call-box-btn-wrap call-decline">
                <FontAwesomeIcon icon={faXmark} />
              </div>
              <span>Decline</span>
            </div>
            <div className="call-box-btn-item ">
              <div
                className="call-box-btn-wrap call-accept"
                onClick={handleOpenVideoCall}
              >
                <FontAwesomeIcon icon={faVideo} />
              </div>
              <span>Accept</span>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
}
