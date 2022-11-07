import { useSelector } from "react-redux";
import AllNotificationItem from "./AllNotificationItem";

export default function AllNotifications({ user, setShowAllNotification }) {
  const { notification } = useSelector((state) => ({ ...state.notification }));

  const reactNotifications = ["like", "love", "haha", "wow", "sad", "angry"];
  const checkReact = (icon) => {
    return reactNotifications.includes(icon);
  };

  return (
    <div className="all_notification">
      <div className="scrollbar all_notification_container">
        <div className="all_notification_header">Notifications</div>
        <div className="all_notification_wrap">
          <div className="all_notification_content">
            <div className="all_notification_group">
              <div className="all_notification_group_header_wrapper">
                <div className="all_notification_group_header">All</div>
                <div className="all_notification_group_header_unread">
                  Unread
                </div>
              </div>
              <div className="all_notification_group_see_all-wrapper">
                <span className="all_notification_group_early">New</span>
                <span className="all_notification_group_see_all">See all</span>
              </div>
              {notification
                ? notification?.map((n) => (
                    <div key={n._id}>
                      <AllNotificationItem
                        user={user}
                        notification={n}
                        checkReact={checkReact}
                        setShowAllNotification={setShowAllNotification}
                      />
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
