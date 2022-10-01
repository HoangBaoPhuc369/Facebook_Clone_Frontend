import axios from "axios";
import { useEffect, useState } from "react";

export default function AllMessengerItem({ friendChat, onlineUser }) {
  const [checkOnline, setCheckOnline] = useState(false);

  useEffect(() => {
    setCheckOnline(onlineUser.some((f) => f._id === friendChat._id));
  }, [onlineUser]);

  // console.log(checkOnline);

  return (
    <div className="all_messenger_item hover1">
      <div className="all_messenger_item_chat">
        <img
          src={friendChat?.picture}
          alt=""
          className="all_messenger_item_img"
        />
        <div>
          {checkOnline ? (
            <span className="all_messenger_item_status"></span>
          ) : (
            <span></span>
          )}
        </div>
        <div className="all_messenger_col">
          <span>
            {friendChat?.first_name} {friendChat?.last_name}
          </span>
          <span>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus
            temporibus cumque ad non obcaecati adipisci, quo sequi odio ab
            deleniti, esse perspiciatis amet pariatur quasi natus dolorum labore
            rerum! Quo!
          </span>
        </div>
      </div>
    </div>
  );
}
