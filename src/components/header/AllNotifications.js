import AllNotificationItem from "./AllNotificationItem";

export default function AllNotifications({ user, setShowAllNotification }) {
  const fakeNotifications = [
    {
      _id: "63676945bde500ae984e1729",
      user: "63257f88b5763f7ea4401b16",
      from: {
        _id: "63257d515b888dcf66525601",
        first_name: "luan",
        last_name: "nguyen",
        username: "luannguyen_MrFyC2iag",
        picture:
          "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
      },
      icon: "post",
      text: "Luan da chia se bai post voi ban",
      status: "unseen",
      createdAt: "2022-11-06T07:59:01.297Z",
    },
    {
      _id: "63676929bde500ae984e1725",
      user: "63257f88b5763f7ea4401b16",
      from: {
        _id: "63257d515b888dcf66525601",
        first_name: "luan",
        last_name: "nguyen",
        username: "luannguyen_MrFyC2iag",
        picture:
          "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
      },
      icon: "comment",
      text: "Luan da comment bai Post cua ban",
      status: "unseen",
      createdAt: "2022-11-06T07:58:33.769Z",
    },
    {
      _id: "63676911bde500ae984e1721",
      user: "63257f88b5763f7ea4401b16",
      from: {
        _id: "63257d515b888dcf66525601",
        first_name: "luan",
        last_name: "nguyen",
        username: "luannguyen_MrFyC2iag",
        picture:
          "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
      },
      icon: "friend",
      text: "Luan da chap nhan loi moi ket ban",
      status: "unseen",
      createdAt: "2022-11-06T07:58:09.885Z",
    },
    {
      _id: "636760165d19edf84b19b30d",
      user: "63257f88b5763f7ea4401b16",
      from: {
        _id: "63257d515b888dcf66525601",
        first_name: "luan",
        last_name: "nguyen",
        username: "luannguyen_MrFyC2iag",
        picture:
          "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
      },
      icon: "wow",
      text: "Luan vua moi wow bai post cua ban",
      status: "unseen",
      createdAt: "2022-11-06T07:19:50.871Z",
    },
    {
      _id: "636735679b9a5a0fc380d1e7",
      user: "63257f88b5763f7ea4401b16",
      from: {
        _id: "63257d515b888dcf66525601",
        first_name: "luan",
        last_name: "nguyen",
        username: "luannguyen_MrFyC2iag",
        picture:
          "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
      },
      icon: "haha",
      text: "Luan vua moi haha bai post cua ban",
      status: "seen",
      createdAt: "2022-11-06T04:17:43.734Z",
    },
    {
      _id: "6367354d9b9a5a0fc380d1e3",
      user: "63257f88b5763f7ea4401b16",
      from: {
        _id: "63257d515b888dcf66525601",
        first_name: "luan",
        last_name: "nguyen",
        username: "luannguyen_MrFyC2iag",
        picture:
          "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
      },
      icon: "angry",
      text: "Luan vua moi angry bai post cua ban",
      status: "unseen",
      createdAt: "2022-11-06T04:17:17.844Z",
    },
    {
      _id: "6367354d9b9a5a0fc380d1df",
      user: "63257f88b5763f7ea4401b16",
      from: {
        _id: "63257d515b888dcf66525601",
        first_name: "luan",
        last_name: "nguyen",
        username: "luannguyen_MrFyC2iag",
        picture:
          "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
      },
      icon: "angry",
      text: "Luan vua moi angry bai post cua ban",
      status: "unseen",
      createdAt: "2022-11-06T04:17:17.013Z",
    },
    {
      _id: "636735429b9a5a0fc380d1db",
      user: "63257f88b5763f7ea4401b16",
      from: {
        _id: "63257d515b888dcf66525601",
        first_name: "luan",
        last_name: "nguyen",
        username: "luannguyen_MrFyC2iag",
        picture:
          "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
      },
      icon: "sad",
      text: "Luan vua moi sad bai post cua ban",
      status: "seen",
      createdAt: "2022-11-06T04:17:06.723Z",
    },
    {
      _id: "636735409b9a5a0fc380d1d7",
      user: "63257f88b5763f7ea4401b16",
      from: {
        _id: "63257d515b888dcf66525601",
        first_name: "luan",
        last_name: "nguyen",
        username: "luannguyen_MrFyC2iag",
        picture:
          "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
      },
      icon: "sad",
      text: "Luan vua moi sad bai post cua ban",
      status: "unseen",
      createdAt: "2022-11-06T04:17:04.898Z",
    },
    {
      _id: "636735369b9a5a0fc380d1d3",
      user: "63257f88b5763f7ea4401b16",
      from: {
        _id: "63257d515b888dcf66525601",
        first_name: "luan",
        last_name: "nguyen",
        username: "luannguyen_MrFyC2iag",
        picture:
          "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
      },
      icon: "like",
      text: "Luan vua moi like bai post cua ban",
      status: "unseen",
      createdAt: "2022-11-06T04:16:54.405Z",
    },
  ];
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
              {fakeNotifications?.map((n) => (
                <div key={n._id}>
                  <AllNotificationItem
                    notification={n}
                    checkReact={checkReact}
                    setShowAllNotification={setShowAllNotification}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
