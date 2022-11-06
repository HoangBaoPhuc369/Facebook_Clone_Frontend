import { useDispatch, useSelector } from "react-redux";
import { setChatBox } from "../../../redux/features/conversationSlice";

export default function Contact({ user, userId }) {
  const { conversations } = useSelector((state) => ({
    ...state.messenger,
  }));
  const dispatch = useDispatch();
  const handleOpenChatBox = () => {
    const getCurrentConversation = conversations.find((c) =>
      c.members.some((u) => u._id === userId)
    );
    dispatch(setChatBox(getCurrentConversation._id));
  };

  return (
    <div className="contact hover3" onClick={handleOpenChatBox}>
      <div className="contact_img">
        <img src={user.picture} alt="" />
        <div className="circle-online"></div>
      </div>
      <span>
        {user.first_name} {user.last_name}
      </span>
    </div>
  );
}
