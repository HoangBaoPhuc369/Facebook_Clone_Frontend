import "./style.css";
import DashboardInformation from "./../../components/Dashboardinformation/Dashboardinformation";
import ReactDom from "react-dom";
import { useEffect } from "react";
import * as webRTCHandler from "../../utils/webRTC/webRTCHandler";
import * as webRTCGroupHandler from "../../utils/webRTC/webRTCGroupCallHandler";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { connectWithWebSocket } from "../../utils/wssConnection/wssConnection";
import GroupCallRoomsListItem from "./GroupCallRoomsListItem";
import GroupCallVideo from "./GroupCallVideo";
import DashboardRoomsFunction from "./DashboardRoomsFunction";
import { io } from "socket.io-client";

export default function VideoCall() {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { remoteStream, localStream, roomSocketId, groupCallStreams } =
    useSelector((state) => ({
      ...state.call,
    }));
  const { groupCallRooms } = useSelector((state) => ({
    ...state.dashboard,
  }));

  // const remoteVideoRef = useRef();

  const { roomId, userId, type } = useParams();
  // const { roomSocket } = useParams();

  const userCall = `${user.first_name} ${user.last_name}`;
  const picture = user.picture;

  // console.log(roomId, userId, type, roomSocket);

  useEffect(() => {
    webRTCHandler.getLocalStream();
    webRTCGroupHandler.connectWithMyPeer();
  }, []);

  // useEffect(() => {
  //   if (type === "caller") {
  //     setTimeout(() => {
  //       webRTCGroupHandler.createNewGroupCall(
  //         roomId,
  //         userId,
  //         userCall,
  //         picture
  //       );
  //     }, 1000);
  //   } else {
  //     console.log("someone is calling");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (type === "receiver") {
  //     setTimeout(() => {
  //       const roomJoin = groupCallRooms.find((room) => room.roomId === roomId);
  //       if (roomJoin) {
  //         webRTCGroupHandler.joinGroupCall(roomJoin.socketId, roomId);
  //       }
  //     }, 1000);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return ReactDom.createPortal(
    <>
      <div className="dashboard_container">
        <div className="dashboard_left_section">
          <div className="dashboard_content_container">
            {/* <DashboardInformation /> */}
            {/* {remoteStream && callState === "CALL_IN_PROGRESS" && (
              )} */}
            {/* <video ref={remoteVideoRef} autoPlay muted></video> */}
            {groupCallStreams.map((stream) => {
              return <GroupCallVideo key={stream.id} stream={stream} />;
            })}
          </div>
          <div className="dashboard_rooms_container">
            <DashboardRoomsFunction localStream={localStream} />
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
}
