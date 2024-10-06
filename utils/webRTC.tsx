import {getAvatarSynthesizer} from "./avatarUtils";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export const setupWebRTC = (
  iceServerUrl: any,
  iceServerUsername: any,
  iceServerCredential: any,
  // startButton: HTMLButtonElement,
  remoteVideo: HTMLDivElement
) => {
  const avatarSynthesizer = getAvatarSynthesizer();
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [iceServerUrl],
        username: iceServerUsername,
        credential: iceServerCredential,
      },
    ],
  });

  // disable start button on start session
  // startButton.disabled = true;

  peerConnection.ontrack = e => {
    if (e.track.kind === "audio") {
      let audioElement = document.createElement("audio");
      audioElement.id = "audioPlayer";
      audioElement.srcObject = e.streams[0];
      audioElement.autoplay = true;

      audioElement.onplaying = () => {
        console.log(`WebRTC ${e.track.kind} channel connected.`);
      };

      // Clean up existing audio element if there is any
      //   const remoteVideoDiv = document.getElementById("remoteVideo");

      const remoteVideoDiv = remoteVideo;

      if (remoteVideoDiv) {
        Array.from(remoteVideoDiv.childNodes).forEach(child => {
          if ((child as HTMLElement).localName === e.track.kind) {
            remoteVideoDiv.removeChild(child);
          }
        });
        remoteVideoDiv.appendChild(audioElement);
      }
    }

    if (e.track.kind === "video") {
      let videoElement = document.createElement("video");
      videoElement.id = "videoPlayer";
      videoElement.srcObject = e.streams[0];
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.style.height = "100%";

      videoElement.onplaying = () => {
        // const remoteVideoDiv = document.getElementById("remoteVideo");
        const remoteVideoDiv = remoteVideo;
        if (remoteVideoDiv) {
          Array.from(remoteVideoDiv.childNodes).forEach(child => {
            if ((child as HTMLElement).localName === e.track.kind) {
              remoteVideoDiv.removeChild(child);
            }
          });

          remoteVideoDiv.appendChild(videoElement);
          console.log(`WebRTC ${e.track.kind} channel connected.`);
        }
      };
    }
  };

  // Listen to data channel, to get the event from the server
  peerConnection.addEventListener("datachannel", event => {
    const dataChannel = event.channel;
    dataChannel.onmessage = e => {
      console.log(
        "[" + new Date().toISOString() + "] WebRTC event received: " + e.data
      );
    };
  });

  // This is a workaround to make sure the data channel listening is working by creating a data channel from the client side
  const c = peerConnection.createDataChannel("eventChannel");

  // Make necessary update to the web page when the connection state changes
  peerConnection.oniceconnectionstatechange = e => {
    console.log("WebRTC status: " + peerConnection.iceConnectionState);
    if (peerConnection.iceConnectionState === "disconnected") {
      // handle idle
    }
  };

  // Offer to receive 1 audio, and 1 video track
  peerConnection.addTransceiver("video", {direction: "sendrecv"});
  peerConnection.addTransceiver("audio", {direction: "sendrecv"});

  avatarSynthesizer
    .startAvatarAsync(peerConnection)
    .then(r => {
      if (r.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log(
          "[" +
            new Date().toISOString() +
            "] Avatar started. Result ID: " +
            r.resultId
        );
      } else {
        console.log(
          "[" +
            new Date().toISOString() +
            "] Unable to start avatar. Result ID: " +
            r.resultId
        );
        if (r.reason === sdk.ResultReason.Canceled) {
          let cancellationDetails = sdk.CancellationDetails.fromResult(
            r as any
          );
          if (cancellationDetails.reason === sdk.CancellationReason.Error) {
            console.log(cancellationDetails.errorDetails);
          }

          console.log(
            "Unable to start avatar: " + cancellationDetails.errorDetails
          );
        }

        // startButton.disabled = true;
      }
    })
    .catch(error => {
      console.log(
        "[" +
          new Date().toISOString() +
          "] Avatar failed to start. Error: " +
          error
      );

      // startButton.disabled = true;
    });
};
