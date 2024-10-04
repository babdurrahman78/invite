"use client";

import {getAvatarSynthesizer} from "@/utils/avatarUtils";
import {microphone} from "@/utils/microphoneUtils";
import {getSpeechRecognizer} from "@/utils/speechUtils";
import {setupWebRTC} from "@/utils/webRTC";
import {useRef, useState} from "react";

interface IMessage {
  role: "system" | "user" | "assisstant";
  content: string;
}

export default function Page() {
  const startBtn = useRef<HTMLButtonElement>(null);
  const microphoneBtn = useRef<HTMLButtonElement>(null);
  const remoteVideo = useRef<HTMLDivElement>(null);
  const speechRecognizer = getSpeechRecognizer();
  const avatarSynthesizer = getAvatarSynthesizer();

  const [message, setMessage] = useState<IMessage[]>([]);
  const [contMsg, setContMsg] = useState("");

  const startSession = () => {
    const xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      `https://southeastasia.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`
    );
    xhr.setRequestHeader(
      "Ocp-Apim-Subscription-Key",
      "0bd46896daad4c1a887dd833048f4d67"
    );
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === 4) {
        const responseData = JSON.parse(xhr.responseText);
        const iceServerUrl = responseData.Urls[0];
        const iceServerUsername = responseData.Username;
        const iceServerCredential = responseData.Password;
        setupWebRTC(
          iceServerUrl,
          iceServerUsername,
          iceServerCredential,
          startBtn.current!,
          remoteVideo.current!
        );
      }
    });
    xhr.send();
  };

  const handleMessage = (
    content: string,
    role: "user" | "assisstant" | "system"
  ) => {
    const _message = message;

    const newMessage: IMessage = {
      role,
      content,
    };

    console.log(newMessage);
    setMessage([..._message, newMessage]);
  };

  console.log(contMsg);

  const handleContMsg = (value: string) => {
    setContMsg(cntMsg => cntMsg + " " + value);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[500px] items-center bg-primary px-5 py-5 h-[500px] flex flex-col justify-between">
        <div id="remoteVideo" ref={remoteVideo}></div>
        <div className="flex gap-3 ">
          <button
            className="bg-green-500 disabled:bg-gray-300 text-white p-3"
            id="startSession"
            ref={startBtn}
            onClick={startSession}
          >
            Open Avatar Session
          </button>

          <button
            className="bg-green-500 disabled:bg-gray-300 text-white p-3"
            id="startSession"
            ref={microphoneBtn}
            onClick={() => {
              microphone(
                "Start Microphone",
                "Stop Microphone",
                microphoneBtn.current!,
                speechRecognizer,
                // value => handleMessage(value, "user")
                value => {
                  handleContMsg(value);
                }
              );
            }}
          >
            Start Microphone
          </button>
          {/* <button id="microphone" onclick="window.microphone()" disabled>Start Microphone</button> */}
        </div>
      </div>
    </div>
  );
}
