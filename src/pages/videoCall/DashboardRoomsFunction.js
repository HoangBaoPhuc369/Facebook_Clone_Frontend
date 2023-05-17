import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClone,
  faMicrophone,
  faPhone,
  faUserPlus,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useRef } from "react";

export default function DashboardRoomsFunction({ localStream }) {

    const localVideoRef = useRef();
    useEffect(() => {
        if (localStream) {
          const localVideo = localVideoRef.current;
          localVideo.srcObject = localStream;
    
          localVideo.onloadedmetadata = () => {
            localVideo.play();
          };
        }
      }, [localStream]);

  return (
    <>
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
          <FontAwesomeIcon icon={faPhone} />
        </div>
      </div>

      <div className="dashboard_local_video">
        <video ref={localVideoRef} autoPlay muted></video>
        {/* <video src=""></video> */}
      </div>
    </>
  );
}
