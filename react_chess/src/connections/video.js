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

    console.log('PROPS', props)

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
        console.log('RECEIVER ID', receiverID);
        setIsCalling(true);
        const peer = new Peer({
            stream: stream,
            initiator: true,
            trickle: false
        })

        peer.on("signal", data => {
            console.log('SIGNAL EVENT:', data, 'RECEIVER ID:', receiverID)

            socket.emit("callUser", {userToCall: receiverID, signalData: data, from: props.mySocketID})
        })

        peer.on("stream", stream => {
            console.log('STREAM EVENT:', stream)
            if (receiverRef.current) {
                receiverRef.current.srcObject = stream;
            }
        })

        socket.on("callAccepted", signal => {
            console.log('CALL ACCEPTED EVENT:', signal)
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
            stream: stream
        })

        peer.on("signal", data => {
            console.log('SIGNAL EVENT ON CALL ACCEPTED:', data)
            socket.emit("acceptCall", {signal: data, to: caller})
        })

        peer.on("stream", stream => {
            console.log('STREAM EVENT ON CALL ACCEPTED:', stream)
            receiverRef.current.srcObject = stream;
        })

        peer.signal(callerSignal);
    }

    let userVideo;
    let mainView;


    if (stream) {
        if (callAccepted) {
            userVideo = (
                <>
                    <video 
                    ref={receiverRef}
                    playsInline
                    autoPlay
                    muted
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
                />
                <video 
                ref={receiverRef}
                playsInline
                autoPlay
                muted
                />
            </>
        }
    }

    if (callAccepted) {
        mainView = (
            <>
                <video 
                ref={receiverRef}
                playsInline
                muted
                autoPlay
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

        if (!props.opponentSocketID) {
          mainView = <p>Waiting for other player...</p>;
        } else {
            mainView = (
              <>
                <button
                  onClick={() => initializePeer(props.opponentSocketID)}
                  className="button__call"
                >
                  Call {props.opponentUserName}
                </button>
              </>
            );
        }
    }

  return (
    <div id="video-container">
      <div
        style={{
          padding: "2rem",
        }}
        id="video-wrapper"
      >
        {userVideo}
        <div className="video"
        >
          {mainView}
        </div>
      </div>
    </div>
  );
}

export default Video