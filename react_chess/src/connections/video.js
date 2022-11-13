import Peer from 'simple-peer';
import "../components/ui/Chessboard.css"

import React, {useState, useEffect, useRef} from 'react';

import { socket } from './socket';

const Video = (props) => {
    const [stream, setStream] = useState();
    const [isCalling, setIsCalling] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callReceived, setCallReceived] = useState(false);
    const [callerSignal, setCallerSignal] = useState(null);
    const [senderVideo, setSenderVideo] = useState(null);
    const [receiverVideo, setReceiverVideo] = useState(null)
    const [caller, setCaller] = useState("");

    const senderRef = useRef();
    const receiverRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
            setStream(stream);
            if (senderRef.current) {
                senderRef.current.srcObject = stream;
            }
        })

        socket.on("callConnected", (data) => {
            setCallReceived(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        })

    }, [senderRef, receiverRef]);

    const initializePeer = (receiverID) => {
        setIsCalling(true);
        const peer = new Peer({
            stream: true,
            trickle: false,
            initiator: true
        })

        peer.on("signal", data => {
            socket.emit("callUser", {userToCall: receiverID, signalData: data, from: props.mySocketID})
        })

        peer.on("stream", stream => {
            if (receiverRef.current) {
                receiverRef.current.srcObject = stream;
            }
        })

        socket.on("callAccepted", signal => {
            setCallAccepted(true);
            peer.signal(signal);
        })
    }

    const acceptCall = () => {
        setIsCalling(false);
        setCallAccepted(true);
        
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: true
        })

        peer.on("signal", data => {
            socket.emit("acceptCall", {signal: data, to: caller})
        })

        peer.on("stream", stream => {
            receiverVideo.current.srcObject = stream;
        })

        peer.signal(callerSignal);
    }

    let userVideo;
    if (stream) {
        if (callAccepted) {
            userVideo = (
                <>
                    <video 
                    ref={receiverRef}
                    playsInline
                    autoPlay
                    muted
                    style={{width: "100%"}}
                    />
                </>
            );
        } else {
            <>
                <video
                ref={senderRef}
                playsInline
                autoPlay
                muted
                style={{width: "100%"}}
                />
                <video 
                ref={receiverRef}
                playsInline
                autoPlay
                muted
                style={{width: "100%"}}
                />
            </>
        }
    }

    let mainView;

    if (callAccepted) {
        mainView = (
            <>
                <video 
                ref={receiverRef}
                playsInline
                muted
                autoPlay
                style={{width: "100%"}}
                />
            </>
        )
    } else if (callReceived) {
        mainView = (
            <>
            <h3>
                {props.opponentUserName} is calling you.
            </h3>
            <button onClick={acceptCall}>
                Accept Call
            </button>
            </>
        )
    } else if (isCalling) {
        mainView = (
            <div>
                <h3>
                    Calling {props.opponentUserName}
                </h3>
            </div>
        )
    } else {
        mainView = (
            <>
                <button onClick={() => initializePeer(props.opponentSocketID)} className="button__call">
                    Call {props.opponentUserName}
                </button>
            </>
        )
    }

  return (
    <div
      style={{
        height: "100%",
        padding: "0 .5rem",
      }}
    >
      {userVideo}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {mainView}
      </div>
    </div>
  );
}

export default Video