import { useRef } from "react";
import AttachFiles from "../../svg/attachFiles";
import FaceEmojis from "../../svg/faceEmoji";
import GifIcon from "../../svg/gif";
import LikeIcon from "../../svg/likeIcon";
import PlusIcon from "../../svg/PlusIcon";
import SentIcon from "../../svg/sentIcon";
import StickerIcon from "../../svg/sticker";
import { useEffect } from "react";

export default function ChatBoxBottom({
  color,
  inputRef,
  newMessage,
  stopTyping,
  startTyping,
  setNewMessage,
  handleSendMessage,
}) {
  const textRef = useRef(null);

  const adjustTextareaHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  return (
    <>
      <div className="ChatBox_message_bottom">
        <div className="ChatBox_message_bottom_plus_icon circle_hover_cover hover1">
          <PlusIcon color={color} />
        </div>
        <div className="ChatBox_message_bottom_wrapper">
          {!newMessage ? (
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
          ) : null}
          <div className="ChatBox_message_bottom_input">
            <textarea
              placeholder="Aa"
              type="text"
              rows="1"
              ref={textRef}
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              onKeyPress={startTyping}
              className="focus:ring-0 appearance-none p-0 
              bg-transparent resize-none px-3 border-none w-full 
              max-h-[20vh] overflow-y-auto scrollbar"
              onKeyUp={(e) => {
                stopTyping();
                if (e.key === "Enter" && e.target.value !== "") {
                  handleSendMessage(e);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
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
