import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { useMediaQuery } from "react-responsive";
import PostShare from "../post/PostShare";
export default function EmojiPickerBackgrounds({
  text,
  user,
  setText,
  type2,
  background,
  post,
}) {
  const textRef = useRef(null);
  const bgRef = useRef(null);

  const sm = useMediaQuery({
    query: "(max-width:550px)",
  });

  return (
    <div className="h-auto max-h-[310px] overflow-y-scroll pb-5">
      <div className="flex_center flex-1" ref={bgRef}>
        <textarea
          ref={textRef}
          maxLength="250"
          value={text}
          placeholder={`What's on your mind, ${user.first_name}`}
          className={`post_input_share focus:ring-0 ${type2 ? "input2" : ""} ${
            sm && !background && "l0"
          }`}
          onChange={(e) => setText(e.target.value)}
          style={{
            paddingTop: `${
              background
                ? Math.abs(textRef.current.value.length * 0.1 - 32)
                : "0"
            }%`,
          }}
        ></textarea>
      </div>

      <div className="px-[17px] w-full">
        <div
          className=" rounded-lg 
        border-[1px] border-solid border-[#CED0D4]"
        >
          <PostShare user={user} post={post} />
        </div>
      </div>
    </div>
  );
}
