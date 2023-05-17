import React from "react";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from "../RemoteVideoView/RemoteVideoView";
import CallRejectedDialog from "../CallRejectedDialog/CallRejectedDialog";
import IncomingCallDialog from "../IncomingCallDialog/IncomingCallDialog";
import CallingDialog from "../CallingDialog/CallingDialog";
import ConversationButtons from "../ConversationButtons/ConversationButtons";

const DirectCall = () => {
  return (
    <>
      <LocalVideoView />
      {/* {remoteStream && callState === callStates.CALL_IN_PROGRESS && }
      {callRejected.rejetced && <CallRejectedDialog
        reason={callRejected.reason}
        hideCallRejectedDialog={hideCallRejectedDialog}
                                />}
      {callState === callStates.CALL_REQUESTED && <IncomingCallDialog callerUsername={callerUsername} />}
      {callingDialogVisible && <CallingDialog />}
      {remoteStream && callState === callStates.CALL_IN_PROGRESS && <ConversationButtons {...props} />}
      {remoteStream && callState === callStates.CALL_IN_PROGRESS && <Messenger message={message} setDirectCallMessage={setDirectCallMessage} />} */}
      <RemoteVideoView />
      <CallRejectedDialog />
      <IncomingCallDialog />
      <CallingDialog />
      <ConversationButtons />

    </>
  );
};

export default DirectCall;
