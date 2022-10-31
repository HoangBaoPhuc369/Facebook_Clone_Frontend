import AllMessengerItem from "./AllMessengerItem";
import { registerPopup } from "../../helpers/displayChatBox";
import { setChatBox } from "../../redux/features/conversationSlice";
import { useDispatch } from "react-redux";

export default function AllMessenger({
  user,
  display,
  onlineUser,
  getFiendChat,
  conversations,
  arrivalMessage,
  setScrollBottom,
  closeArrivalMessage,
  setShowAllMessenger,
  setCloseArrivalMessage,
}) {
  
  const dispatch = useDispatch();
  return (
    <div className="all_messenger" style={{ display: display }}>
      <div className="scrollbar all_messenger_container">
        <div className="all_messenger_header">Chat</div>
        <div className="all_messenger_wrap">
          <div className="all_messenger_content">
            <div className="all_messenger_search">
              <i className="amm_s_ic"></i>
              <input type="text" placeholder="Search Messenger" />
            </div>
            <div className="all_messenger_group">
              <div className="all_messenger_group_header">Inbox</div>
              {conversations?.map((c) => (
                <div key={c._id}>
                  <div
                    onClick={() => {
                      dispatch(setChatBox(c._id));
                      // registerPopup(c._id);
                      setShowAllMessenger(false);
                      setScrollBottom((prev) => !prev);
                    }}
                  >
                    <AllMessengerItem
                      user={user}
                      currentChat={c}
                      onlineUser={onlineUser}
                      messagesChat={c.messages}
                      friendChat={getFiendChat(c)}
                      arrivalMessage={arrivalMessage}
                      closeArrivalMessage={closeArrivalMessage}
                      setCloseArrivalMessage={setCloseArrivalMessage}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="all_messenger_bottom">
        <a href="/" className="messenger_link">
          <span className="messenger_bottom_text">See all in Messenger</span>
        </a>
      </div>
    </div>
  );
}
