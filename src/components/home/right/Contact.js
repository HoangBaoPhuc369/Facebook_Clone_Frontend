import { useDispatch, useSelector } from "react-redux";
import {
  setChatBox,
  setCurrentChatBox,
} from "../../../redux/features/conversationSlice";

export default function Contact({ user, userId }) {
  const { conversations, chatBox } = useSelector((state) => ({
    ...state.messenger,
  }));
  const dispatch = useDispatch();
  const handleOpenChatBox = () => {
    const getCurrentConversation = conversations.find((c) =>
      c.members.some((u) => u._id === userId)
    );

    if (getCurrentConversation !== undefined) {
      if (!chatBox.chatBoxVisible.includes(getCurrentConversation._id)) {
        console.log(getCurrentConversation._id);
        dispatch(setChatBox(getCurrentConversation._id));
      } else {
        dispatch(setCurrentChatBox(getCurrentConversation._id));
      }
    }
  };

  return (
    <div className="contact hover3" onClick={handleOpenChatBox}>
      <div className="contact_img">
        <img src={user.picture} alt="" />
        <div className="circle-online"></div>
      </div>
      <div className="">
        <span>
          {user.first_name} {user.last_name}
        </span>
      </div>
    </div>
  );
}
