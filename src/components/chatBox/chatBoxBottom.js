import AttachFiles from "../../svg/attachFiles";
import FaceEmojis from "../../svg/faceEmoji";
import GifIcon from "../../svg/gif";
import LikeIcon from "../../svg/likeIcon";
import PlusIcon from "../../svg/PlusIcon";
import SentIcon from "../../svg/sentIcon";
import StickerIcon from "../../svg/sticker";

export default function ChatBoxBottom({
  color,
  inputRef,
  newMessage,
  stopTyping,
  startTyping,
  setNewMessage,
  handleSendMessage,
}) {
  return (
    <>
      <div className="ChatBox_message_bottom">
        <div className="ChatBox_message_bottom_plus_icon circle_hover_cover hover1">
          <PlusIcon color={color} />
        </div>
        <div className="ChatBox_message_bottom_wrapper">
          <div className="ChatBox_message_bottom_icons_wrap">
            <div className="ChatBox_message_bottom_icon hover1">
              <AttachFiles color={color} />
            </div>
            <div className="ChatBox_message_bottom_icon hover1">
              <StickerIcon color={color} />
            </div>
            <div className="ChatBox_message_bottom_icon hover1">
              <GifIcon color={color} />
            </div>
          </div>
          <div className="ChatBox_message_bottom_input">
            <input
              placeholder="Aa"
              type="text"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              onKeyPress={startTyping}
              onKeyUp={(e) => {
                stopTyping();
                // handleKeyDown(e);
                if (e.key === "Enter" && e.target.value !== "") {
                  handleSendMessage(e);
                }
              }}
              // onKeyUp={handleSendMessage}
            />

            <div className="face_icon circle_hover_cover hover1">
              <FaceEmojis color={color} />
            </div>
          </div>
        </div>
        <div className="ChatBox_message_bottom_like_icon circle_hover_cover">
          <span className="hover1 like_button" ref={inputRef}>
            {!newMessage ? (
              <span>
                <LikeIcon color={color} />
              </span>
            ) : (
              <span onClick={handleSendMessage}>
                <SentIcon color={color} />
              </span>
            )}
          </span>
        </div>
      </div>
    </>
  );
}
