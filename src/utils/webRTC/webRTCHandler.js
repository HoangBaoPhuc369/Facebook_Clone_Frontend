import {
  setCallerUser,
  setCallingDialogVisible,
  setCallRejected,
  setCallState,
  setLocalStream,
  setRemoteStream,
  setRoomSocketId,
} from "../../redux/features/callSlice";
import * as wss from "../wssConnection/wssConnection";
import { store } from "./../../app/store";

const preOfferAnswers = {
  CALL_ACCEPTED: "CALL_ACCEPTED",
  CALL_REJECTED: "CALL_REJECTED",
  CALL_NOT_AVAILABLE: "CALL_NOT_AVAILABLE",
};

let videoConstraints = {
  height: 150, //{ min: 640, ideal: 1920, max: 1920 }
  width: 300, //{ min: 400, ideal: 1080 }
  frameRate: { max: 30 }
};

let audioConstraints = {
 channelCount: 1,
 sampleRate: 48000,
 sampleSize: 16,
 volume: 1,
 latency: 0.003,
 echoCancellation: true,
 noiseSuppression: true,
 autoGainControl: true,
};

const defaultConstrains = { audio: audioConstraints, video: videoConstraints };

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};

let connectedUserSocketId;
let peerConnection;
let dataChannel;

export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstrains)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      // store.dispatch(setCallState("CALL_AVAILABLE"));
      createPeerConnection();
    })
    .catch((err) => {
      console.log(
        "error occured when trying to get an access to get local stream"
      );
      console.log(err);
    });
};

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);

  const localStream = store.getState().call.localStream;

  for (const track of localStream.getTracks()) {
    peerConnection.addTrack(track, localStream);
  }

  peerConnection.ontrack = ({ streams: [stream] }) => {
    store.dispatch(setRemoteStream(stream));
  };

  peerConnection.onicecandidate = (event) => {
    console.log("geeting candidates from stun server");
    if (event.candidate) {
      const data = ({
        candidate: event.candidate,
        socketId: connectedUserSocketId,
      })

      wss.sendWebRTCCandidate(data);
    }
  };

  peerConnection.onconnectionstatechange = (event) => {
    if (peerConnection.connectionState === "connected") {
      console.log("succesfully connected with other peer");
    }
  };
};

// export const callToOtherUser = (socketId, userId, userCall, picture) => {
//   connectedUserSocketId = socketId;
//   store.dispatch(setCallState("CALL_IN_PROGRESS")); 
//   store.dispatch(setCallingDialogVisible(true));
//   wss.sendPreOffer({
//     callee: userId,
//     caller: {
//       username: userCall,
//       picture,
//     },
//   });
// };

// export const handlePreOffer = (data) => {
//   if (checkIfCallIsPossible()) {
//     store.dispatch(setConnectedUserSocketId(data.callerSocketId));
//     const userCaller = {
//       username: data.callerUsername,
//       picture: data.callerPicture,
//     };
//     store.dispatch(setCallerUser(userCaller));
//     store.dispatch(setCallState("CALL_REQUESTED"));
//   } else {
//     wss.sendPreOfferAnswer({
//       callerSocketId: data.callerSocketId,
//       answer: preOfferAnswers.CALL_NOT_AVAILABLE,
//     });
//   }
// };

export const handlePreOfferInParent = (data) => {
  if (checkIfCallIsPossible()) {
    const userCaller = {
      userId: data.callerUserId,
      username: data.callerUsername,
      picture: data.callerPicture,
      roomId: data.roomId,
    };
    store.dispatch(setCallerUser(userCaller));
    store.dispatch(setCallState("CALL_REQUESTED"));
  } else {
  }
};

// export const acceptIncomingCallRequest = (connectedUserSocketId) => {
//   wss.sendPreOfferAnswer({
//     callerSocketId: connectedUserSocketId,
//     answer: preOfferAnswers.CALL_ACCEPTED,
//   });

//   store.dispatch(setCallState("CALL_IN_PROGRESS"));
// };

// export const rejectIncomingCallRequest = () => {
//   wss.sendPreOfferAnswer({
//     callerSocketId: connectedUserSocketId,
//     answer: preOfferAnswers.CALL_REJECTED
//   });
//   resetCallData();
// };

// export const handlePreOfferAnswer = (data) => {
//   store.dispatch(setCallingDialogVisible(false));
//   if (data.answer === preOfferAnswers.CALL_ACCEPTED) {
//     sendOffer();
//   } else {
//     let rejectionReason;
//     if (data.answer === preOfferAnswers.CALL_NOT_AVAILABLE) {
//       rejectionReason = 'Callee is not able to pick up the call right now';
//     } else {
//       rejectionReason = 'Call rejected by the callee';
//     }
//     store.dispatch(setCallRejected({
//       rejected: true,
//       reason: rejectionReason
//     }));

//     resetCallData();
//   }
// };

// const sendOffer = async () => {
//   const offer = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(offer);
//   wss.sendWebRTCOffer({
//     calleeSocketId: connectedUserSocketId,
//     offer: offer
//   });
// };

// export const handleOffer = async (data) => {
//   await peerConnection.setRemoteDescription(data.offer);
//   const answer = await peerConnection.createAnswer();
//   await peerConnection.setLocalDescription(answer);
//   wss.sendWebRTCAnswer({
//     callerSocketId: data.callerSocketId,
//     answer: answer
//   });
// };

// export const handleAnswer = async (data) => {
//   await peerConnection.setRemoteDescription(data.answer);
// };

export const handleCandidate = async (data) => {
  try {
    console.log('adding ice candidates');
    await peerConnection.addIceCandidate(data.candidate);
  } catch (err) {
    console.error('error occured when trying to add received ice candidate', err);
  }
};

export const checkIfCallIsPossible = () => {
  if (store.getState().call.callState !== "CALL_AVAILABLE") {
    return false;
  } else {
    return true;
  }
};

// let screenSharingStream;

// export const switchForScreenSharingStream = async () => {
//   if (!store.getState().call.screenSharingActive) {
//     try {
//       screenSharingStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//       store.dispatch(setScreenSharingActive(true));
//       const senders = peerConnection.getSenders();
//       const sender = senders.find(sender => sender.track.kind === screenSharingStream.getVideoTracks()[0].kind);
//       sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
//     } catch (err) {
//       console.error('error occured when trying to get screen sharing stream', err);
//     }
//   } else {
//     const localStream = store.getState().call.localStream;
//     const senders = peerConnection.getSenders();
//     const sender = senders.find(sender => sender.track.kind === localStream.getVideoTracks()[0].kind);
//     sender.replaceTrack(localStream.getVideoTracks()[0]);
//     store.dispatch(setScreenSharingActive(false));
//     screenSharingStream.getTracks().forEach(track => track.stop());
//   }
// };

// export const handleUserHangedUp = () => {
//   resetCallDataAfterHangUp();
// };

// export const hangUp = () => {
//   wss.sendUserHangedUp({
//     connectedUserSocketId: connectedUserSocketId
//   });

//   resetCallDataAfterHangUp();
// };

// const resetCallDataAfterHangUp = () => {
//   peerConnection.close();
//   peerConnection = null;
//   createPeerConnection();
//   resetCallData();

//   const localStream = store.getState().call.localStream;
//   localStream.getVideoTracks()[0].enabled = true;
//   localStream.getAudioTracks()[0].enabled = true;

//   if (store.getState().call.screenSharingActive) {
//     screenSharingStream.getTracks().forEach(track => {
//       track.stop();
//     });
//   }

//   store.dispatch(resetCallDataState());
// };

// export const resetCallData = () => {
//   connectedUserSocketId = null;
//   store.dispatch(setCallState("CALL_AVAILABLE"));
// };

// export const sendMessageUsingDataChannel = (message) => {
//   dataChannel.send(message);
// };
