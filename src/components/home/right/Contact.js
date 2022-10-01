import { registerPopup } from "../../../helpers/displayChatBox";

export default function Contact({ user, conversations, userId }) {

  const handleOpenChatBox = () => {
    const getCurrentConversation = conversations.find((c) => c.members.some((u) => u._id === userId));
    registerPopup(getCurrentConversation._id);
  }

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
