import React from "react";

function StoryIcon(props) {
  return (
    <svg
      width={props.width}
      height={props.width}
      fill="currentColor"
      className={props.className}
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M457 368.832a.5.5 0 00.883.323l1.12-1.332a.876.876 0 01.679-.323h3.522a2.793 2.793 0 002.796-2.784v-10.931a2.793 2.793 0 00-2.796-2.785h-3.454a2.75 2.75 0 00-2.75 2.75v15.082zm-1.5 0a.5.5 0 01-.883.323l-1.12-1.332a.876.876 0 00-.679-.323h-3.522a2.793 2.793 0 01-2.796-2.784v-10.931a2.793 2.793 0 012.796-2.785h3.454a2.75 2.75 0 012.75 2.75v15.082z"
        transform="translate(-446 -350)"
      ></path>
    </svg>
  );
}

export default StoryIcon;