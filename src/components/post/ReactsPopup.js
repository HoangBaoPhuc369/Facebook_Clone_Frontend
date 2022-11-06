const reactsArray = [
  {
    name: "like",
    image: "../../../reacts/like.gif",
  },
  {
    name: "love",
    image: "../../../reacts/love.gif",
  },
  {
    name: "haha",
    image: "../../../reacts/haha.gif",
  },
  {
    name: "wow",
    image: "../../../reacts/wow.gif",
  },
  {
    name: "sad",
    image: "../../../reacts/sad.gif",
  },
  {
    name: "angry",
    image: "../../../reacts/angry.gif",
  },
];

export default function ReactsPopup({ visible, setVisible, reactHandler }) {
  return (
    <>
      {/* {visible && (
        // <div
        //   classNameName="reacts_popup"
        //   onMouseOver={() => {
        //     setTimeout(() => {
        //       setVisible(true);
        //     }, 500);
        //   }}
        //   onMouseLeave={() => {
        //     setTimeout(() => {
        //       setVisible(false);
        //     }, 500);
        //   }}
        // >
        //   {reactsArray.map((react, i) => (
        //     <div
        //       classNameName="react"
        //       key={i}
        //       onClick={() => reactHandler(react.name)}
        //     >
        //       <img src={react.image} alt="" />
        //     </div>
        //   ))}
        // </div>
      )} */}
        <input type="checkbox" id="like" className="field-reactions" />
        <h3 className="text-desc">
          Press space and after tab key to navigation
        </h3>
        <label htmlFor="like" className="label-reactions">
          Like
        </label>
        <div className="toolbox"></div>
        <label className="overlay" htmlFor="like"></label>

        {reactsArray.map((react, i) => (
          <div className={`reaction-${react.name}`} key={i}>
            <img src={react.image} alt="" />
            <span className="legend-reaction">
              {react.name.charAt(0).toUpperCase() + react.name.slice(1)}
            </span>
          </div>
        ))}
    </>
  );
}
