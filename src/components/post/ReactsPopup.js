import { useDispatch } from "react-redux";
import { createNotifications } from "../../redux/features/notificationSlice";

const reactsArray = [
  {
    name: "like",
    image: "../../../reacts/like.gif",
  },
  {
    name: "love",
    image: "../../../reacts/love.gif",
  },
  {
    name: "haha",
    image: "../../../reacts/haha.gif",
  },
  {
    name: "wow",
    image: "../../../reacts/wow.gif",
  },
  {
    name: "sad",
    image: "../../../reacts/sad.gif",
  },
  {
    name: "angry",
    image: "../../../reacts/angry.gif",
  },
];

export default function ReactsPopup({
  user,
  postId,
  socketRef,
  postUserId,
  reactHandler,
}) {
  const dispatch = useDispatch();
  const handleSendNotifications = (icon) => {
    if (user?.id !== postUserId) {
      const notification = {
        senderId: user?.id,
        receiverId: postUserId,
        icon: icon,
        text: `reacted to your post: ${icon}`,
      };
      dispatch(createNotifications({props: notification, token: user?.token}));
      socketRef.current.emit("sendNotification", notification);
    }
  };

  return (
    <>
      <div className="toolbox"></div>
      {reactsArray.map((react, i) => (
        <div
          className={`reaction-${react.name}`}
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            reactHandler(react.name);
            handleSendNotifications(react.name);
          }}
        >
          <img src={react.image} alt="" />
          <span className="legend-reaction">
            {react.name.charAt(0).toUpperCase() + react.name.slice(1)}
          </span>
        </div>
      ))}
    </>
  );
}
