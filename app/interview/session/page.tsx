"use client";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import Image from "next/image";
import Button from "@/components/common/Button";
import { useContext, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { FinishInterviewContext } from "@/components/finishInterviewComponent";
import { useRouter } from "next/navigation";
import { useReactMediaRecorder } from "react-media-recorder";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const finishInterviewContext = useContext(FinishInterviewContext);
  const [isAnswering, setIsAnswering] = useState(false);
  const [index, setIndex] = useState(1);
  const [question, setQuestion] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSubmit, setIsLoadingSubmit] = useState(false);

  // state for answer time
  const [limitTimeAnswer, setLimitTimeAnswer] = useState(0);
  const [progress, setProgress] = useState(0);

  // state for interview duration
  const [count, setCount] = useState(0);
  const [time, setTime] = useState("00:00:00");

  const azureSubscriptionKey = "3cf9ad70a16f4a2b9383e201129b9ef0";
  const azureServiceRegion = "eastus";
  const uuid = useRef<string>("");

  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    screen: true,
    audio: true,
  });

  var initTime = new Date();

  const showTimer = (ms: number) => {
    // const milliseconds = Math.floor((ms % 1000) / 10)
    //   .toString()
    //   .padStart(2, "0");
    const second = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const minute = Math.floor((ms / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    const hour = Math.floor(ms / 1000 / 60 / 60).toString();
    setTime(hour.padStart(2, "0") + ":" + minute + ":" + second);
  };

  useEffect(() => {
    var id = setInterval(() => {
      var left = count + (new Date().getTime() - initTime.getTime());
      setCount(left);
      showTimer(left);
      if (left <= 0) {
        setTime("00:00:00:00");
        clearInterval(id);
      }
    }, 1);
    return () => clearInterval(id);
  }, []);

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

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
    startCamera();
    startRecording();
  }, []);

  const submitAnswer = async (answer: string) => {
    try {
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

  const finishInterview = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        `
      ${KEY.baseUrl}/ChatGPT/Finish?customapikey=${KEY.customapikey}&GUIDSession=${uuid.current}
      `,
        {
          method: "POST",
          body: formData,
        }
      );
    } catch (e) {
      console.log(e);
    } finally {
      router.push("/report/" + uuid.current);
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

  const fetchCapturedScreenURL = async () => {
    if (mediaBlobUrl) {
      const res = await fetch(mediaBlobUrl);
      const blob = await res.blob();

      const file = new File([blob], "screen-recorded");
      return file;
    }
    return;
  };

  const handleCloseInterview = async () => {
    setIsLoadingSubmit(true);
    try {
      stopRecording();
      const file = await fetchCapturedScreenURL();
      router.push("/interview/session/thank");
      if (file) {
        // window.open(mediaBlobUrl!, "_blank")?.focus();
        await finishInterview(file);
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoadingSubmit(false);
  };

  const startAnswer = () => {
    setIsAnswering(true);

    // in ms
    setLimitTimeAnswer(new Date().getTime());
  };

  const stopAnswer = () => {
    setIsLoading(true);
    setIsAnswering(false);
    setProgress(0);
  };

  useEffect(() => {
    if (isAnswering) {
      var id = setInterval(() => {
        const tempProgress = Math.floor(
          ((new Date().getTime() - limitTimeAnswer) / 180000) * 100
        );
        setProgress(tempProgress);
        console.log(tempProgress);
        if (tempProgress === 100) {
          setIsAnswering(false);
          setProgress(0);
          const stopButton = document.getElementById("stopButton");
          stopButton?.click();
        }
      }, 1000);
    }
    return () => clearInterval(id);
  }, [isAnswering]);

  return (
    <div className="mt-[64px] flex flex-col gap-6 ">
      {/* Title */}
      <div className="flex justify-center relative ">
        <p className="text-[28px] leading-[34px] text-primaryDarker text-center font-bold">
          Interview Session
        </p>

        <div
          style={{
            backdropFilter: "blur(4px)",
          }}
          className="absolute flex gap-2 items-center justify-center right-[66px] w-[150px] h-[42px] bg-blackBlur rounded"
        >
          <div className="rounded-full w-4 h-4 bg-danger"></div>
          <p className="font-bold text-white text-center text-[20px]">{time}</p>
        </div>
      </div>
      {/* Main Interview */}
      <div className="flex gap-[27px] justify-center min-[1440px]:px-[66px]">
        {/* Question  */}
        <div
          className={`rounded-lg ${isAnswering ? "w-[40%]" : "w-[50%]"
            } relative flex  h-[422px] bg-content py-[32px] px-[29px]`}
        >
          {!isAnswering && (
            <Image
              className="absolute -left-12 -top-12"
              src={"/vivi.png"}
              alt="vivi.png"
              width={300}
              height={800}
            />
          )}
          <div className={`${!isAnswering && "ml-[200px]"} overflow-auto`}>
            <p className="text-[20px] leading-[34px] text-primaryDarker font-bold">
              {`Question ${index}`}
            </p>
            <p className="mt-[25px]">{isLoading ? `. . .` : question}</p>
          </div>
        </div>

        {/* Video  */}
        <div
          className={`rounded-lg ${isAnswering ? "w-[60%]" : "w-[50%]"
            } flex flex-col items-center gap-6`}
        >
          <div className="relative w-full">
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

            <div className="flex w-full bg-[#696969] items-center h-[5px]">
              <div
                style={{
                  width: `${progress}%`,
                }}
                className={`h-[5px] bg-red-600`}
              ></div>
              {/* <div className="rounded-full w-[10px] -mt-[5px] h-[10px] -ml-[5px] bg-red-600"></div> */}
              <div
                style={{
                  width: `${100 - progress}%`,
                }}
                className={`h-[5px]`}
              ></div>
            </div>
          </div>

          <Button
            type={"primary"}
            label={"Start Answser"}
            width="250px"
            height="44px"
            id={"recordButton"}
            onClick={startAnswer}
            className={`${finishInterviewContext?.isFinish
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
            onClick={stopAnswer}
            className={`${finishInterviewContext?.isFinish
              ? "hidden"
              : isAnswering
                ? "block"
                : "hidden"
              }`}
          />

          <Link href={`/report/${uuid.current}`} target="_blank" className={`${finishInterviewContext?.isFinish ? "block" : "hidden"
            }`}>
            <Button
              type={"danger"}
              label={"Close Interview"}
              width="250px"
              height="44px"
              disabled={loadingSubmit}
              onClick={handleCloseInterview}

            />
          </Link>
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
