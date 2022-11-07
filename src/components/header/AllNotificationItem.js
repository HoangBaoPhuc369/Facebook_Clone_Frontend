import Moment from "react-moment";
import { useDispatch } from "react-redux";
import { seenNotification } from "../../redux/features/notificationSlice";

export default function AllNotificationItem({
  user,
  notification,
  checkReact,
  setShowAllNotification,
}) {
  const dispatch = useDispatch();

  return (
    <div
      className="all_notification_item hover1"
      onClick={() => {
        dispatch(
          seenNotification({ userToken: user?.token, nofId: notification?._id })
        );
        // setShowAllNotification((prev) => !prev);
      }}
    >
      <div className="all_notification_item_chat">
        <div className="all_notification_item_img_wrap">
          <img
            src={notification.from.picture}
            alt=""
            className="all_notification_item_img"
          />
          <span className="all_notification_item_status"></span>
          {checkReact(notification.icon) ? (
            <img
              src={`../../../reacts/${notification.icon}.svg`}
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
              {notification.from.first_name} {notification.from.last_name}
            </strong>{" "}
            {notification.text}
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
