import { closePopup } from "../../helpers/displayChatBox";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArrowDown2 from "../../svg/arrowDown2";
import MiniMize from "../../svg/miniMize";
import PhoneCall from "../../svg/phoneCall";
import VideoCall from "../../svg/videoCall";
import XClose from "../../svg/xClose";
import { removeChatBox } from "../../redux/features/conversationSlice";
import { callToOtherUser } from "../../utils/webRTC/webRTCHandler";
import { getCallUser } from "../../redux/features/callSlice";
import { sendPreOffer } from "../../utils/wssConnection/wssConnectionInParent";

export default function ChatBoxHeader({
  user,
  socket,
  friendChat,
  currentChat,
  onlineUser,
  chatBox,
}) {
  const [checkOnline, setCheckOnline] = useState(false);
  const { callState } = useSelector((state) => ({ ...state.call }));
  const { activeUsers } = useSelector((state) => ({ ...state.dashboard }));
  const dispatch = useDispatch();

  useEffect(() => {
    setCheckOnline(onlineUser?.some((f) => f._id === friendChat._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineUser]);

  const checkWaitingChatBox = chatBox.chatBoxWaiting?.includes(
    currentChat?._id
  );
  const setColorNewMessage = checkWaitingChatBox ? "blue-background" : "";
  const setColorIcon = checkWaitingChatBox
    ? "#fff"
    : chatBox.currentChatBox === currentChat?._id
    ? "#0084ff"
    : "var(--bg-fifth)";

  const openVideoCallWindow = () => {
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

    const userCall = currentChat.members.find((u) => u._id === friendChat._id);
    // if (activeUser) {
    // }
    console.log(userCall);
    const roomId = currentChat?._id;
    const type = "host";
    const username =  `${user.first_name} ${user.last_name}`
    const videoCallWindow = window.open(
      `http://localhost:3001/?roomId=${roomId}&username=${username}&type=${type}`, 
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

    const data = {
      senderId: user.id,
      receiveId: userCall._id,
      username: username,
      picture: user.picture,
      roomId: roomId,
    }
    socket.emit('call-other', data);
  };
  const handleCallPressed = () => {
    // dispatch(getCallUser(activeUser));
    openVideoCallWindow();
    // callToOtherUser(activeUser, user, socket);
  };

  return (
    <>
      <div className={`ChatBox_header ${setColorNewMessage}`}>
        <div
          className={`ChatBox_header_left ${
            checkWaitingChatBox ? "hover-blue" : "hover-grey"
          }`}
        >
          <div className="ChatBox_header_left_pad">
            <img src={friendChat?.picture} alt="" />
            <span
              className={checkOnline ? "ChatBox_header_left_circle" : ""}
            ></span>
            <div className="ChatBox_header_left_wrapper">
              <span
                className={`ChatBox_header_left_username ${
                  checkWaitingChatBox ? "primary-color" : ""
                }`}
              >
                {friendChat?.first_name} {friendChat?.last_name}
              </span>
              <br />
              <span
                className={`ChatBox_header_left_status ${
                  checkWaitingChatBox ? "primary-color" : ""
                }`}
              >
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
          <span
            className="ChatBox_header_right_item hover3"
            onClick={handleCallPressed}
          >
            <VideoCall color={setColorIcon} />
          </span>
          <span className="ChatBox_header_right_item hover3">
            <MiniMize color={setColorIcon} />
          </span>
          <span
            className="ChatBox_header_right_item hover3"
            onClick={(e) => {
              e.stopPropagation();
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
