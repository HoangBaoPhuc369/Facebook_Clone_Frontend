import Moment from "react-moment";

export default function AllNotificationItem({
  notification,
  checkReact,
  setShowAllNotification,
}) {
  return (
    <div
      className="all_notification_item hover1"
      onClick={() => {
        setShowAllNotification(prev => !prev);
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
          <span>{notification.text}</span>
          <span className="all_notification-time">
            <Moment fromNow interval={30}>
              {notification.createdAt}
            </Moment>
          </span>
        </div>
      </div>
      <div className="all_notification_delivered">
        {notification.status === "seen" ? <div></div> : null}
      </div>
    </div>
  );
}
