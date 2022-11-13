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

export default function VideoCall() {
  return (
    <>
      <div className="dashboard_container background_main_color">
        <div className="dashboard_left_section">
          <div className="dashboard_content_container">
            {/* <DirectCall />
            <GroupCall /> */}
            {/* {callState !== callStates.CALL_IN_PROGRESS && (
            )} */}
            <DashboardInformation />
          </div>
          <div className="dashboard_rooms_container background_secondary_color">
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
          </div>
        </div>
      </div>
    </>
  );
}
