import React from "react";

function LockIcon(props) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      width={props.width}
      height={props.width}
      className={props.className}
    >
      <defs>
        <path d="M0 947.5 222 947.5 222 0 0 0z" />
      </defs>
      <g fillRule="evenodd" transform="translate(-444 -204)">
        <g transform="translate(354 144)">
          <path
            fillRule="nonzero"
            d="M112.5 72.5c0 5.8-4.7 10.5-10.5 10.5s-10.5-4.7-10.5-10.5S96.2 62 102 62s10.5 4.7 10.5 10.5zm-1.5 0a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9z"
          />
          <path
            fillRule="nonzero"
            d="m96.72 68.28 6.5 6.5a.75.75 0 1 0 1.06-1.06l-6.5-6.5a.75.75 0 0 0-1.06 1.06z"
          />
          <path d="M103.5 72.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.25-11h-3.5a.752.752 0 0 1-.75-.75c0-.413.338-.75.75-.75h3.5c.412 0 .75.337.75.75s-.338.75-.75.75" />
          <mask>
            <use xlinkHref="#a" />
          </mask>
          <path mask="url(#b)" d="M101 63 103 63 103 61 101 61z" />
          <path
            d="m111.016 65.96-2.475-2.476a.752.752 0 0 1 0-1.06.752.752 0 0 1 1.06 0l2.475 2.474a.752.752 0 0 1 0-1.061.752.752 0 0 1-1.06 0"
            mask="url(#b)"
          />
          <path
            mask="url(#b)"
            d="M109.425 66.49 108.01 65.075 109.425 63.661 110.839 65.075z"
          />
        </g>
      </g>
    </svg>
  );
}

export default LockIcon;
