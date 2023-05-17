import * as ReactDOM from 'react-dom';
import ArrowDown2 from "../svg/arrowDown2";
import AttachFiles from "../svg/attachFiles";
import FaceEmojis from "../svg/faceEmoji";
import GifIcon from "../svg/gif";
import LikeIcon from "../svg/likeIcon";
import MiniMize from "../svg/miniMize";
import PhoneCall from "../svg/phoneCall";
import PlusIcon from "../svg/PlusIcon";
import StickerIcon from "../svg/sticker";
import VideoCall from "../svg/videoCall";
import XClose from "../svg/xClose";



//this function can remove a array element.
Array.remove = function (array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

//this variable represents the total number of popups can be displayed according to the viewport width
var total_popups = 0;

//arrays of popups ids
var popups = [];

//this is used to close a popup
export function closePopup(id) {
  for (var iii = 0; iii < popups.length; iii++) {
    if (id == popups[iii]) {
      Array.remove(popups, iii);
      document.getElementById(id).style.display = "none";
      calculate_popups();
      return;
    }
  }
}

//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups() {
  // var right = 220;

  var iii = 0;
  for (iii; iii < popups.length; iii++) {
    if (popups[iii] != undefined) {
      var element = document.getElementById(popups[iii]);
      element.style.display = "block";
    }
  }

  if (popups.length > 3) {
    for (var jjj = 0; jjj < popups.length - total_popups; jjj++) {
      var element = document.getElementById(popups[jjj]);
      element.style.display = "none";
    }
  }
}

//creates markup for a new popup. Adds the id to popups array.
export function registerPopup(id) {
  for (var iii = 0; iii < popups.length; iii++) {
    //already registered. Bring it to front.
    if (id == popups[iii]) {
      Array.remove(popups, iii);

      popups.push(id);

      calculate_popups();

      return;
    }
  }

  if (id !== undefined) {
    popups.push(id);
    calculate_popups();
  } else if (id === undefined) {
    console.log("id is undefined");
  }
}

//calculate the total number of popups suitable and then populate the toatal_popups variable.
function calculate_popups() {
  var width = window.innerWidth;
  if (width < 540) {
    total_popups = 0;
  } else {
    width = width - 98;
    //320 is width of a single popup box
    total_popups = parseInt(width / 520);
  }

  display_popups();
}
//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);



// Test commit issue again and again