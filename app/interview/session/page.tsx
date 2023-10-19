"use client";

import Button from "@/components/common/Button";
import {useEffect, useRef} from "react";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
    // navigator.permissions.query({ name: 'camera' as PermissionName }).then((permissionStatus) => {
    //     setPermissionState(permissionStatus.state);
    //     permissionStatus.onchange = () => {
    //         console.log(permissionStatus)
    //         setPermissionState(permissionStatus.state);
    //         if (permissionStatus.state === 'granted') {
    //             startCamera(); // Call startCamera when permission is granted.
    //         }
    //     };
    // });

    startCamera();
  }, []);

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
            {`Question 1`}
          </p>
          <p className="mt-[25px]">
            Great, I’ll call you John. John, could you tell me about the time
            when you were a Developer at Astra Graphia Digital? what kind of
            project do you handle?
          </p>
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
          />
        </div>
      </div>
    </div>
  );
}
