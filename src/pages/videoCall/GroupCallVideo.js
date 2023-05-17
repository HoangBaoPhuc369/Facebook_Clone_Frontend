import { useRef, useEffect } from "react";

export default function GroupCallVideo({ stream }) {
  const videoRef = useRef();

  useEffect(() => {
    const remoteGroupCallVideo = videoRef.current;
    remoteGroupCallVideo.srcObject = stream;
    remoteGroupCallVideo.onloadedmetadata = () => {
      remoteGroupCallVideo.play();
    };
  }, [stream]);

  return <video ref={videoRef} autoPlay muted />;
}
