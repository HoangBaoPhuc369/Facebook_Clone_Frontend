import "./style.css";
import DashboardInformation from "./../../components/Dashboardinformation/Dashboardinformation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClone,
  faMicrophone,
  faPhone,
  faUserPlus,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import * as webRTCHandler from '../../utils/webRTC/webRTCHandler';
import * as webRTCGroupHandler from '../../utils/webRTC/webRTCGroupCallHandler';
import { useSelector } from 'react-redux';
import { useRef } from "react";

export default function VideoCall({socket}) {
  const { localStream } = useSelector((state) => ({ ...state.call }));
  const localVideoRef = useRef(); 
  useEffect(() => {
    webRTCHandler.getLocalStream(socket);
    webRTCGroupHandler.connectWithMyPeer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (localStream) {
  //     const localVideo = localVideoRef.current;
  //     localVideo.srcObject = localStream;

  //     localVideo.onloadedmetadata = () => {
  //       localVideo.play();
  //     };
  //   }
  // }, [localStream]);

  return (
    <>
      <div className="dashboard_container">
        <div className="dashboard_left_section">
          <div className="dashboard_content_container">
            {/* <DashboardInformation /> */}
            <video autoPlay muted ></video>
          </div>
          <div className="dashboard_rooms_container">
            <div className="dashboard_hidden"></div>

            <div className="dashboard_group_btn">
              <div className="dashboard_group_btn_item">
                <FontAwesomeIcon icon={faClone} />
              </div>
              <div className="dashboard_group_btn_item">
                <FontAwesomeIcon icon={faUserPlus} />
              </div>
              <div className="dashboard_group_btn_item">
                <FontAwesomeIcon icon={faVideo} />
              </div>
              <div className="dashboard_group_btn_item">
                <FontAwesomeIcon icon={faMicrophone} />
              </div>
              <div className="dashboard_group_btn_item btn_call">
                <FontAwesomeIcon icon={faPhone}/>
              </div>
            </div>

            <div className="dashboard_local_video">
              <video ref={localVideoRef} width="300" autoPlay muted></video>
              {/* <video src=""></video> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
