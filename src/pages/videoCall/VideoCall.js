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
import { createPortal } from "react-dom";

export default function VideoCall() {
  return (
    <>
      <div className="dashboard_container">
        <div className="dashboard_left_section">
          <div className="dashboard_content_container">
            {/* <DashboardInformation /> */}
            <video src=""></video>
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
              <video src=""></video>
              {/* <video src=""></video> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
