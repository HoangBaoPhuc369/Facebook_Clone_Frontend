import { clearGroupCallData, setCallState, setGroupCallActive, setGroupCallStreams } from "../../redux/features/callSlice";
import { store } from "./../../app/store";
import { Peer } from "peerjs";
import * as wss from '../wssConnection/wssConnection';


let myPeer;
let myPeerId;
let groupCallRoomId;
let groupCallHost = false;

export const connectWithMyPeer = () => {
  myPeer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "8900",
  });

  myPeer.on("open", (id) => {
    console.log("succesfully connected with peer server");
    myPeerId = id;
  });

  myPeer.on("call", (call) => {
    call.answer(store.getState().call.localStream);
    call.on("stream", (incomingStream) => {
      const streams = store.getState().call.groupCallStreams;
      const stream = streams.find((stream) => stream.id === incomingStream.id);

      if (!stream) {
        addVideoStream(incomingStream);
      }
    });
  });
};

export const createNewGroupCall = (roomId, userId, userCall, picture) => {
  groupCallHost = true;
  wss.registerGroupCall({
    userId,
    username: userCall,
    picture,
    roomId,
    peerId: myPeerId,
  });

  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState("CALL_IN_PROGRESS"));
};

export const joinGroupCall = (hostSocketId, roomId) => {
  const localStream = store.getState().call.localStream;
  groupCallRoomId = roomId;

  wss.userWantsToJoinGroupCall({
    peerId: myPeerId,
    hostSocketId,
    roomId,
    localStreamId: localStream.id
  });

  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState("CALL_IN_PROGRESS"));
};

export const connectToNewUser = (data) => {
  const localStream = store.getState().call.localStream;

  const call = myPeer.call(data.peerId, localStream);

  call.on("stream", (incomingStream) => {
    const streams = store.getState().call.groupCallStreams;
    const stream = streams.find((stream) => stream.id === incomingStream.id);

    if (!stream) {
      addVideoStream(incomingStream);
    }
  });
};

const addVideoStream = (incomingStream) => {
  store.dispatch(setGroupCallStreams(incomingStream));
};

export const clearGroupData = () => {
  groupCallRoomId = null;
  groupCallHost = null;
  store.dispatch(clearGroupCallData());
  myPeer.destroy();
  connectWithMyPeer();

  const localStream = store.getState().call.localStream;
  localStream.getVideoTracks()[0].enabled = true;
  localStream.getAudioTracks()[0].enabled = true;
};

// if group call is active return roomId if not return false
export const checkActiveGroupCall = () => {
  if (store.getState().call.groupCallActive) {
    return groupCallRoomId;
  } else {
    return false;
  }
};
