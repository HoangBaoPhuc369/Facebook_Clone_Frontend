import AttachFiles from "../../svg/attachFiles";
import FaceEmojis from "../../svg/faceEmoji";
import GifIcon from "../../svg/gif";
import LikeIcon from "../../svg/likeIcon";
import PlusIcon from "../../svg/PlusIcon";
import SentIcon from "../../svg/sentIcon";
import StickerIcon from "../../svg/sticker";

export default function ChatBoxBottom({
  newMessage,
  setNewMessage,
  startTyping,
  stopTyping,
  inputRef,
  handleSendMessage,
}) {
  return (
    <>
      <div className="ChatBox_message_bottom">
        <div className="ChatBox_message_bottom_plus_icon circle_hover_cover hover1">
          <PlusIcon color="#0084ff" />
        </div>
        <div className="ChatBox_message_bottom_wrapper">
          <div className="ChatBox_message_bottom_icons_wrap">
            <div className="ChatBox_message_bottom_icon hover1">
              <AttachFiles color="#0084ff" />
            </div>
            <div className="ChatBox_message_bottom_icon hover1">
              <StickerIcon color="#0084ff" />
            </div>
            <div className="ChatBox_message_bottom_icon hover1">
              <GifIcon color="#0084ff" />
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
              <FaceEmojis color="#0084ff" />
            </div>
          </div>
        </div>
        <div className="ChatBox_message_bottom_like_icon circle_hover_cover">
          <span className="hover1 like_button" ref={inputRef}>
            {!newMessage ? (
              <span>
                <LikeIcon color="#0084ff" />
              </span>
            ) : (
              <span onClick={handleSendMessage}>
                <SentIcon color="#0084ff" />
              </span>
            )}
          </span>
        </div>
      </div>
    </>
  );
}
