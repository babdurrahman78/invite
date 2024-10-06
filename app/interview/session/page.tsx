"use client";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import Button from "@/components/common/Button";
import {useContext, useEffect, useRef, useState} from "react";
import Script from "next/script";
import {FinishInterviewContext} from "@/components/finishInterviewComponent";
import {useRouter} from "next/navigation";
import {useReactMediaRecorder} from "react-media-recorder";
import Link from "next/link";
import {RecordingContext} from "@/components/recordingContext";
import {setupWebRTC} from "@/utils/webRTC";
import Image from "next/image";
import {getAvatarSynthesizer} from "@/utils/avatarUtils";
import {microphone} from "@/utils/microphoneUtils";
import {IMessage} from "@/interfaces/common";
import {getSpeechRecognizer} from "@/utils/speechUtils";
import {submitMsg} from "@/utils/openAIUtils";

export default function Page() {
  const router = useRouter();
  const finishInterviewContext = useContext(FinishInterviewContext);
  // const recrodingContext = useContext(RecordingContext);
  const [isAnswering, setIsAnswering] = useState(false);
  const [index, setIndex] = useState(1);
  const [question, setQuestion] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<"RECORDING" | "IDLE">(
    "IDLE"
  );
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // state for answer time
  const [limitTimeAnswer, setLimitTimeAnswer] = useState(0);
  const [progress, setProgress] = useState(0);

  // state for interview duration
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);

  const azureSubscriptionKey = "3cf9ad70a16f4a2b9383e201129b9ef0";
  const azureServiceRegion = "eastus";
  const uuid = useRef<string>("");

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const KEY = {
    baseUrl: "https://jardinespocapi.azurewebsites.net",
    customapikey: "774620",
  };
  // async function transcribeAudio(audioFile: File): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);
  //     const speechConfig = sdk.SpeechConfig.fromSubscription(
  //       azureSubscriptionKey,
  //       azureServiceRegion
  //     );

  //     const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  //     recognizer.recognizeOnceAsync(result => {
  //       if (result.reason === sdk.ResultReason.RecognizedSpeech) {
  //         const transcription = result.text;
  //         console.log(transcription);
  //         resolve(transcription);
  //       } else {
  //         reject("failed");
  //       }
  //     });
  //   });
  // }

  // const handleTranscription = async (file: File) => {
  //   try {
  //     const transcription = await transcribeAudio(file);
  //     console.log("Transcription:", transcription);
  //     return transcription;
  //   } catch (error) {
  //     console.error("Error transcribing audio:", error);
  //   }
  // };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const stopDisplayingCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null); // Clear the camera stream from the state
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
    // init();
    startCamera();
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
    }
  };

  // const transcribe = async () => {
  //   const audioLink = document.getElementsByTagName("audio")[0];
  //   if (audioLink) {
  //     const link = document.createElement("a");
  //     link.href = audioLink.src;

  //     const res = await fetch(audioLink.src);
  //     const blob = await res.blob();

  //     const file = new File([blob], "test.wav");
  //     const transcription = await handleTranscription(file);
  //     if (!!transcription) {
  //       await submitAnswer(transcription);
  //     } else {
  //       setIsLoading(false);
  //       setQuestion(
  //         "Sorry John, I didn't quite catch that. Would you like me to repeat the question?"
  //       );
  //     }
  //   }
  // };

  // const fetchCapturedScreenURL = async () => {
  //   if (recrodingContext?.mediaBlobUrl) {
  //     const res = await fetch(recrodingContext.mediaBlobUrl);
  //     const blob = await res.blob();

  //     const file = new File([blob], "screen-recorded");
  //     return file;
  //   }
  //   return;
  // };

  // const handleCloseInterview = async () => {
  //   setIsLoadingSubmit(true);
  //   try {
  //     const file = await fetchCapturedScreenURL();
  //     setIsClosed(true);
  //     if (file) {
  //       await finishInterview(file);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   setIsLoadingSubmit(false);
  //   stopDisplayingCamera();
  // };

  // useEffect(() => {
  //   if (finishInterviewContext?.isFinish) {
  //     recrodingContext?.stopRecording();
  //   }
  // }, [finishInterviewContext?.isFinish]);

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
          new Date().getTime() / 1000 - limitTimeAnswer / 1000
        );
        setProgress(tempProgress);
        console.log(tempProgress);

        if (tempProgress === 180) {
          setIsAnswering(false);
          setProgress(0);
          const stopButton = document.getElementById("stopButton");
          stopButton?.click();
        }
      }, 1000);
    }
    return () => clearInterval(id);
  }, [isAnswering]);

  // new speech service implementation
  const startBtn = useRef<HTMLButtonElement>(null);
  const microphoneBtn = useRef<HTMLButtonElement>(null);
  const remoteVideo = useRef<HTMLDivElement>(null);
  const speechRecognizer = useRef<sdk.SpeechRecognizer | null>(null);
  const avatarSynthesizer = useRef<sdk.AvatarSynthesizer | null>(null);

  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    avatarSynthesizer.current = getAvatarSynthesizer();
    speechRecognizer.current = getSpeechRecognizer();
  }, []);

  useEffect(() => {
    if (sessionStarted) {
      handleSubmitMessage(message);
    }
  }, [sessionStarted]);

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
          remoteVideo.current!,
          avatarSynthesizer.current!
        );
      }
    });
    xhr.send();

    setSessionStarted(true);
  };

  useEffect(() => {
    if (remoteVideo.current) {
      // startSession();
    }
  }, [remoteVideo.current]);

  const [message, setMessage] = useState<IMessage[]>([
    {
      role: "system",
      content:
        "You are an HR interviewer named Vivi who will introduce yourself then ask interviewee to introduce himself",
    },
  ]);

  const [contMsg, setContMsg] = useState("");
  const [contMsgAI, setContMsgAI] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSubmitMessage = (message: IMessage[]) => {
    submitMsg(
      message,
      avatarSynthesizer.current!,
      value => setContMsgAI(prev => prev + value)
      // messages => {
      //   setMessage([...messages]);
      // }
    );
  };

  const handleMessage = (
    content: string,
    role: "user" | "assistant" | "system"
  ) => {
    const _message = message;

    const newMessage: IMessage = {
      role,
      content,
    };

    handleSubmitMessage([..._message, newMessage]);
    setMessage([..._message, newMessage]);

    // reset spoken message from user
    setContMsg("");
  };

  const handleContMsg = (value: string) => {
    setContMsg(prev => prev + value + " ");
  };

  useEffect(() => {
    console.log(contMsg);
  }, [contMsg]);

  const handleMicrophone = () => {
    if (!!contMsgAI) {
      // push assistant message to history chat
      let assistantMessage: IMessage = {
        role: "assistant",
        content: contMsgAI,
      };
      setMessage([...message, assistantMessage]);
    }

    setContMsgAI("");

    microphone(
      "Start Answer",
      "Stop Answer",
      microphoneBtn.current!,
      speechRecognizer.current!,
      // value => handleMessage(value, "user")
      value => {
        handleContMsg(value);
      },
      () => handleMessage(contMsg, "user")
    );
  };

  return (
    <div>
      <div
        className={`mt-8 flex flex-col gap-6 ${isClosed ? "hidden" : "block"}`}
      >
        {/* Title */}
        {/* <div className="flex justify-center relative ">
          <p className="text-[28px] leading-[34px] text-primaryDarker text-center font-bold">
            Interview Session
          </p>

          <div
            style={{
              backdropFilter: "blur(4px)",
            }}
            className="absolute flex gap-2 items-center justify-center right-[66px] w-[100px] h-[42px] bg-blackBlur rounded"
          >
            <div className="rounded-full w-4 h-4 bg-danger"></div>
            <p className="font-bold text-white text-center text-[20px]">{"REC"}</p>
          </div>
        </div> */}
        {/* Main Interview */}
        <div className="flex gap-6 justify-center px-16">
          {/* Question  */}
          <div
            id="remoteVideo"
            ref={remoteVideo}
            className={`rounded-[12px] overflow-hidden w-[50%] flex  h-[362px] bg-content`}
          >
            {/* {!isAnswering && (
              <Image
                className="absolute -left-12 -top-12"
                src={"/vivi.png"}
                alt="vivi.png"
                width={300}
                height={800}
              />
            )} */}
            {/* <div className={`${!isAnswering && "ml-[200px]"} overflow-auto`}>
              <p className="text-[20px] leading-[34px] text-primaryDarker font-bold">
                {`Question ${index}`}
              </p>
              <p className="mt-[25px]">{isLoading ? `. . .` : question}</p>
            </div> */}
          </div>

          {/* Video  */}
          <div
            className={`w-[50%]
             flex flex-col items-center gap-6`}
          >
            <div className="relative w-full">
              <video
                className="rounded-[12px]"
                style={{
                  transform: "scaleX(-1)",
                  width: "100%",
                  objectFit: "fill",
                  height: "362px",
                  margin: 0,
                }}
                ref={videoRef}
                autoPlay
                playsInline
                muted
              />
            </div>

            <Button
              type={"danger"}
              label={`Answer Complete (${180 - progress})`}
              width="250px"
              height="44px"
              id="stopButton"
              onClick={stopAnswer}
              className={`${
                finishInterviewContext?.isFinish
                  ? "hidden"
                  : isAnswering
                  ? "block"
                  : "hidden"
              }`}
            />

            <Link href={`/report/${uuid.current}`} target="_blank">
              <Button
                type={"danger"}
                label={"Close Interview"}
                width="250px"
                height="44px"
                disabled={loadingSubmit}
                // onClick={handleCloseInterview}
                className={`${
                  finishInterviewContext?.isFinish ? "block" : "hidden"
                }`}
              />
            </Link>
          </div>
        </div>
        {/* Subtitle */}
        <div className="px-16 h-[186px]">
          <div className="rounded-lg h-full bg-content border-[#E0E6EB] border px-6 py-3">
            <header className="flex gap-[5.33px] pb-4 border-b border-[#E0E6EB]">
              <Image src={"/cc.svg"} alt="cc" width={13} height={12} />
              <p className="font-bold text-sm">Subtitle</p>
            </header>

            <main className="mt-4 h-[100px] flex flex-col gap-4 scrollbar-hide overflow-auto">
              {message.map((item, index) => {
                return (
                  item.role !== "system" && (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="size-6 rounded-full border-[1.2px] border-[#E0E6EB]">
                        <Image
                          src={
                            item.role === "user"
                              ? "/avatar.png"
                              : "/vivi-subtitle.png"
                          }
                          alt={item.role}
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#535353] text-sm font-normal leading-[16.8px]">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  )
                );
              })}
              {/* AI reply typing animation */}
              {!!contMsgAI && (
                <div key={index} className="flex gap-2 items-start">
                  <div className="size-6  rounded-full border-[1.2px] border-[#E0E6EB]">
                    <Image
                      src={"/vivi-subtitle.png"}
                      alt={"assistant"}
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#535353] text-sm font-normal leading-[16.8px]">
                      {contMsgAI}
                    </p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
        {/* footer */}
        <div className="mt-6 flex justify-between px-16">
          <div>
            <div
              style={{
                backdropFilter: "blur(4px)",
              }}
              className="flex gap-2 items-center justify-center w-[100px] h-[42px] bg-blackBlur rounded"
            >
              <div className="rounded-full w-4 h-4 bg-danger"></div>
              <p className="font-bold text-white text-center text-[20px]">
                {"REC"}
              </p>
            </div>
            <p className="text-[#083F78] font-bold text-xl leading-[34px]">
              Interview Session
            </p>
          </div>

          <button
            onClick={() => {
              startSession();
            }}
            className="w-[203px] gap-[8.17px] disabled:bg-gray-300 text-white h-[42px] rounded-[4px] flex justify-center items-center bg-[#1870F0]"
          >
            <p className="font-bold text-base leading-[22px]">Start Session</p>
          </button>

          <button
            onClick={() => {
              handleMicrophone();
            }}
            ref={microphoneBtn}
            className="w-[203px] gap-[8.17px] disabled:bg-gray-300 text-white h-[42px] rounded-[4px] flex justify-center items-center bg-[#1870F0]"
          >
            <Image src={"/microphone.svg"} alt="mic" width={12} height={16} />
            <p className="font-bold text-base leading-[22px]">Start Answer</p>
          </button>

          <div className="w-[48px] flex flex-col items-center h-[72px]">
            <button className="size-12 rounded-[4px] flex justify-center items-center bg-[#E0E6EB] mb-1">
              <Image src={"/door.svg"} alt="door" width={24} height={24} />
            </button>
            <p className="font-normal text-[#6D7C88] text-sm">Leave</p>
          </div>
          {/* <Button
            type={"primary"}
            label={"Start Answser"}
            width="203px"
            height="42px"
            id={"recordButton"}
            onClick={startSession}
            className={`font-bold ${
              finishInterviewContext?.isFinish
                ? "hidden"
                : !isAnswering
                ? "block"
                : "hidden"
            }`}
          /> */}
        </div>
        {/* <button className="hidden" id="transcribe" onClick={transcribe}>
          Transcribe
        </button>{" "} */}
      </div>
      <div
        className={`flex flex-col items-center pt-[195px] ${
          isClosed ? "block" : "hidden"
        }`}
      >
        <p className="font-bold text-[36px] text-primaryDarker mb-[42px]">
          Thank you for joining the interview session!
        </p>

        <div
          style={{
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            backgroundColor: "rgba(217, 217, 217, 0.35)",
          }}
          className="w-[685px] h-[176px] rounded-[20px] p-[25px]"
        >
          <p className="text-[22px] text-center">
            {
              "We truly appreciate your participation, and we're delighted to have had the chance to get to know you. We hope this opportunity opens doors to a successful career within our company. See you in the future!"
            }
          </p>
        </div>
      </div>
      <ol className="hidden" id="recordingsList"></ol>
      {/* <Script src="/recorder.js" async />
      <Script src="/enabler.js" /> */}
    </div>
  );
}
