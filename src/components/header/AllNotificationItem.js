import Moment from "react-moment";
import { useDispatch } from "react-redux";
import {
  seenNotification,
  selecteNotification,
} from "../../redux/features/notificationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { setPage } from "../../redux/features/pageSlice";

export default function AllNotificationItem({
  user,
  checkReact,
  notification,
  setShowAllNotification,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div
      className="all_notification_item hover1"
      onClick={() => {
        dispatch(
          seenNotification({ userToken: user?.token, nofId: notification?._id })
        );
        dispatch(selecteNotification(notification));
        if (notification.isSystem) {
          navigate("/details-notification/system");
          dispatch(setPage(""));
        } else {
          navigate("/details-notification/post");
        }
        setShowAllNotification(false);
        dispatch(setPage(""));
      }}
    >
      <div className="all_notification_item_chat">
        <div className="all_notification_item_img_wrap">
          {notification.isSystem ? (
            <div
              className="w-14 h-14 flex flex-wrap justify-center content-center bg-yellow-400
            rounded-full mr-2.5 text-white text-2xl"
            >
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
          ) : (
            <img
              src={notification?.from?.picture}
              alt=""
              className="all_notification_item_img"
            />
          )}
          <span className="all_notification_item_status"></span>
          {checkReact(notification.icon) ? (
            <img
              src={`../../../reacts/${notification.icon}.svg`}
              alt=""
              className="all_notification_react"
            />
          ) : notification.isSystem ? (
            <img
              src="../../../icons/logo_fake.png"
              alt=""
              className="all_notification_react"
            />
          ) : (
            <i className={`notification_${notification.icon}_icon`}></i>
          )}
        </div>
        <div className="all_notification_col">
          <span>
            <strong>
              {notification?.from?.first_name} {notification?.from?.last_name}
            </strong>{" "}
            {notification?.text}
          </span>
          <span
            className={
              notification.status !== "seen"
                ? "all_notification-time-await"
                : "all_notification-time"
            }
          >
            <Moment fromNow interval={30}>
              {notification.createdAt}
            </Moment>
          </span>
        </div>
      </div>
      <div className="all_notification_delivered">
        {notification.status !== "seen" ? <div></div> : null}
      </div>
    </div>
  );
}
