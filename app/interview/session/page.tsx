"use client";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import Image from "next/image";
import Button from "@/components/common/Button";
import {useContext, useEffect, useRef, useState} from "react";
import Script from "next/script";
import {FinishInterviewContext} from "@/components/finishInterviewComponent";
import {useRouter} from "next/navigation";

export default function Page() {
  const router = useRouter();
  const finishInterviewContext = useContext(FinishInterviewContext);
  const [isAnswering, setIsAnswering] = useState(false);
  const [index, setIndex] = useState(1);
  const [question, setQuestion] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const azureSubscriptionKey = "3cf9ad70a16f4a2b9383e201129b9ef0";
  const azureServiceRegion = "eastus";
  const uuid = useRef<string>("");

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const KEY = {
    baseUrl: "https://jardinespocapi.azurewebsites.net",
    customapikey: "774620",
  };
  async function transcribeAudio(audioFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(audioFile);
      const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);
      console.log(audioConfig);
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        azureSubscriptionKey,
        azureServiceRegion
      );

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

  function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        uuid.current = uuidv4();
        const res = await fetch(
          `${KEY.baseUrl}/ChatGPT/Start?customapikey=${KEY.customapikey}&GUIDSession=${uuid.current}`
        );
        const data = await res.json();
        setQuestion(data.gptInitialResponse);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const submitAnswer = async (answer: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${KEY.baseUrl}/ChatGPT/Chat?customapikey=${KEY.customapikey}&GUIDSession=${uuid.current}`,
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
    } finally {
      setIsLoading(false);
    }
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
            {"00:00:06"}
          </p>
        </div>
      </div>
      {/* Main Interview */}
      <div className="flex gap-[27px] justify-center">
        {/* Question  */}
        <div className="rounded-lg relative flex xl:w-[642px] lg:w-[500px] h-[422px] bg-content py-[32px] px-[29px]">
          <Image
            className="absolute -le"
            src={"/vivi.png"}
            alt="vivi.png"
            width={300}
            height={800}
          />
          <div>
            <p className="text-[20px]  leading-[34px] text-primaryDarker font-bold">
              {`Question ${index}`}
            </p>
            <p className="mt-[25px]">{isLoading ? `. . .` : question}</p>
          </div>
        </div>

        {/* Video  */}
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
            className={`${
              finishInterviewContext?.isFinish
                ? "hidden"
                : !isAnswering
                ? "block"
                : "hidden"
            }`}
          />

          <Button
            type={"danger"}
            label={"Answer Complete"}
            width="250px"
            height="44px"
            id="stopButton"
            onClick={() => setIsAnswering(false)}
            className={`${
              finishInterviewContext?.isFinish
                ? "hidden"
                : isAnswering
                ? "block"
                : "hidden"
            }`}
          />

          <Button
            type={"danger"}
            label={"Close Interview"}
            width="250px"
            height="44px"
            onClick={() => {
              router.push("/report/" + uuid.current);
            }}
            className={`${
              finishInterviewContext?.isFinish ? "block" : "hidden"
            }`}
          />
        </div>
      </div>
      <button className="hidden" id="transcribe" onClick={transcribe}>
        Transcribe
      </button>{" "}
      <ol className="hidden" id="recordingsList"></ol>
      <Script src="/recorder.js" async />
      <Script src="/enabler.js" />
    </div>
  );
}
