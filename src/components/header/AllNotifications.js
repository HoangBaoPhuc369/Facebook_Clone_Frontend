
export default function AllNotifications() {
  return (
    <div className="all_notification">
    <div className="scrollbar all_notification_container">
      <div className="all_notification_header">Notifications</div>
      <div className="all_notification_wrap">
        <div className="all_notification_content">
          <div className="all_notification_group">
            <div className="all_notification_group_header_wrapper">
                <div className="all_notification_group_header">All</div>
                <div className="all_notification_group_header_unread">Unread</div>
            </div>
            <div className="all_notification_group_see_all-wrapper">
                <span className="all_notification_group_early">Earlier</span>
                <span className="all_notification_group_see_all">See all</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
