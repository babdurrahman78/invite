"use client";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import Button from "@/components/common/Button";
import {useEffect, useRef, useState} from "react";

const ENV = {
  baseUrl: "https://jardinespocapi.azurewebsites.net",
  customapikey: "774620",
  GUIDSession: "09aa7f05-e219-4a6f-9679-db1e07a71082",
  GUISession: "09aa7f05-e219-4a6f-9679-db1e07a71082",
};

export default function Page() {
  const [isAnswering, setIsAnswering] = useState(false);
  const [index, setIndex] = useState(1);
  const [question, setQuestion] = useState<string>();

  const azureSubscriptionKey = "3cf9ad70a16f4a2b9383e201129b9ef0";
  const azureServiceRegion = "eastus";

  const videoRef = useRef<HTMLVideoElement | null>(null);

  async function transcribeAudio(audioFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(audioFile);
      const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);
      console.log(audioConfig);
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        azureSubscriptionKey,
        azureServiceRegion
      );
      speechConfig.speechRecognitionLanguage = "id-ID";

      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      recognizer.recognizeOnceAsync(result => {
        console.log(result);
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          const transcription = result.text;
          console.log(transcription);
          resolve(transcription);
        } else {
          reject("failed");
        }
      });
    });
  }

  const handleTranscription = async (file: File) => {
    try {
      const transcription = await transcribeAudio(file);
      console.log("Transcription:", transcription);
      return transcription;
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(
          `${ENV.baseUrl}/ChatGPT/Start?customapikey=${ENV.customapikey}&GUIDSession=${ENV.GUIDSession}`
        );
        const data = await res.json();
        setQuestion(data.gptInitialResponse);
      } catch (e) {
        console.log(e);
      }
    };
    init();
  }, []);

  const submitAnswer = async (answer: string) => {
    try {
      const res = await fetch(
        `${ENV.baseUrl}/ChatGPT/Chat?customapikey=${ENV.customapikey}&GUIDSession=${ENV.GUISession}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            intervieweeAnswer: answer,
          }),
        }
      );
      const data = await res.json();
      setQuestion(data.gptNextQuestion);
      setIndex(index + 1);
    } catch (e) {
      console.log(e);
    }
    // setQuestion(data.gptInitialResponse);
  };

  const transcribe = async () => {
    const audioLink = document.getElementsByTagName("audio")[0];
    if (audioLink) {
      const link = document.createElement("a");
      link.href = audioLink.src;

      const res = await fetch(audioLink.src);
      const blob = await res.blob();

      const file = new File([blob], "test.wav");
      const transcription = await handleTranscription(file);
      await submitAnswer(transcription || "");
    }
  };

  return (
    <div className="mt-[64px] flex flex-col gap-6">
      {/* Title */}
      <div className="flex justify-center relative">
        <p className="text-[28px] leading-[34px] text-primaryDarker text-center font-bold">
          Interview Session
        </p>

        <div
          style={{
            backdropFilter: "blur(4px)",
          }}
          className="absolute flex gap-2 items-center justify-center right-5 w-[150px] h-[42px] bg-blackBlur rounded"
        >
          <div className="rounded-full w-4 h-4 bg-danger"></div>
          <p className="font-bold text-white text-center text-[20px]">
            00:00:06
          </p>
        </div>
      </div>
      {/* Main Interview */}
      <div className="flex gap-[27px] justify-center">
        {/* Question  */}
        <div className="rounded-lg xl:w-[642px] lg:w-[500px] h-[422px] bg-content py-[32px] px-[29px]">
          <p className="text-[20px]  leading-[34px] text-primaryDarker font-bold">
            {`Question ${index}`}
          </p>
          <p className="mt-[25px]">{question}</p>
        </div>

        {/* Question  */}
        <div className="rounded-lg flex flex-col items-center gap-6 xl:w-[642px] lg:w-[500px]">
          <video
            style={{
              transform: "scaleX(-1)",
              width: "100%",
              objectFit: "fill",
              height: "422px",
              margin: 0,
            }}
            ref={videoRef}
            autoPlay
            playsInline
            muted
          />

          <Button
            type={"primary"}
            label={"Start Answser"}
            width="250px"
            height="44px"
            id={"recordButton"}
            onClick={() => setIsAnswering(true)}
            className={`${!isAnswering ? "block" : "hidden"}`}
          />

          <Button
            type={"danger"}
            label={"Answer Complete"}
            width="250px"
            height="44px"
            id="stopButton"
            onClick={() => setIsAnswering(false)}
            className={`${isAnswering ? "block" : "hidden"}`}
          />
        </div>
      </div>
      {/* <button id="recordButton">Start Recording</button> */}
      {/* <button id="stopButton">Stop Recording</button>
      <button>Download Recording</button>
    <button onClick={transcribe}>Download audio</button> */}
      <button className="hidden" id="transcribe" onClick={transcribe}>
        Transcribe
      </button>{" "}
      <ol className="hidden" id="recordingsList"></ol>
    </div>
  );
}
