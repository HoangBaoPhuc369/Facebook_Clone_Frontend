import { closePopup } from "../../helpers/displayChatBox";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ArrowDown2 from "../../svg/arrowDown2";
import MiniMize from "../../svg/miniMize";
import PhoneCall from "../../svg/phoneCall";
import VideoCall from "../../svg/videoCall";
import XClose from "../../svg/xClose";
import { removeChatBox } from "../../redux/features/conversationSlice";

export default function ChatBoxHeader({
  friendChat,
  currentChat,
  onlineUser,
  color,
  arrivalMessage,
  chatBox,
}) {
  const [checkOnline, setCheckOnline] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setCheckOnline(onlineUser?.some((f) => f._id === friendChat._id));
  }, [onlineUser]);

  const setColorNewMessage =
    arrivalMessage?.currentChatID !== chatBox.currentChatBox &&
    arrivalMessage?.status !== "seen"
      ? "blue-background"
      : "";
  const setColorIcon =
    arrivalMessage?.currentChatID !== chatBox.currentChatBox &&
    arrivalMessage?.status !== "seen" && arrivalMessage?.currentChatBox === currentChat?._id
      ? "#fff"
      : chatBox.currentChatBox === currentChat?._id
      ? "#0084ff"
      : "var(--bg-fifth)";
  return (
    <>
      <div className={`ChatBox_header ${setColorNewMessage}`}>
        <div className="ChatBox_header_left">
          <div className="ChatBox_header_left_pad">
            <img src={friendChat?.picture} alt="" />
            <span
              className={checkOnline ? "ChatBox_header_left_circle" : ""}
            ></span>
            <div className="ChatBox_header_left_wrapper">
              <span className="ChatBox_header_left_username">
                {friendChat?.first_name} {friendChat?.last_name}
              </span>
              <br />
              <span className="ChatBox_header_left_status">
                {checkOnline ? "Active now" : ""}
              </span>
            </div>
            <div className="ChatBox_header_left_arrow_down">
              <ArrowDown2 color={setColorIcon} />
            </div>
          </div>
        </div>
        <div className="ChatBox_header_right">
          <span className="ChatBox_header_right_item hover3">
            <PhoneCall color={setColorIcon} />
          </span>
          <span className="ChatBox_header_right_item hover3">
            <VideoCall color={setColorIcon} />
          </span>
          <span className="ChatBox_header_right_item hover3">
            <MiniMize color={setColorIcon} />
          </span>
          <span
            className="ChatBox_header_right_item hover3"
            onClick={() => {
              // closePopup(currentChat?._id);
              dispatch(removeChatBox(currentChat?._id));
            }}
          >
            <XClose color={setColorIcon} />
          </span>
        </div>
      </div>
    </>
  );
}
