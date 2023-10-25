"use client";

import {useEffect, useState} from "react";

const KEY = {
  baseUrl: "https://jardinespocapi.azurewebsites.net",
  customapikey: "774620",
};

export default function Page({params}: {params: {id: string}}) {
  const [summary, setSummary] = useState("");
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(
          `${KEY.baseUrl}/ChatGPT/Summary?customapikey=${KEY.customapikey}&GUIDSession=${params.id}`
        );
        const data = await res.json();
        console.log(data);
        setSummary(data.gptSummary);
        setRecommendation(data.gptRecommendation);
      } catch (e) {
        console.log(e);
      }
    };

    init();
  }, []);
  return (
    <div className="min-[1440px]:w-[1440px] min-[1000px]:w-full max-h-[780px] flex flex-col justify-center items-center">
      <p className="text-[28px] mb-[72px] leading-[34px] text-primaryDarker text-center font-bold mt-[9px]">
        Interview HR - Report
      </p>

      <div className="flex w-full px-[21px] gap-[27px] justify-center">
        {/* Video  */}
        <div className="rounded-[10px] w-3/5 bg-[#E8E8E8] py-[23px] px-[16px]">
          <p className="text-[16px]">
            <span className="font-bold">Name:</span>
            &nbsp;{"Bilal"}
          </p>
          <p className="text-[16px]">
            <span className="font-bold">Position:</span>
            &nbsp;{"Frontend Developer"}
          </p>
          <p className="text-[16px]">
            <span className="font-bold">Category:</span>
            &nbsp;{"4A"}
          </p>
          <video
            style={{
              transform: "scaleX(-1)",
              width: "100%",
              objectFit: "fill",
              height: "422px",
              margin: 0,
            }}
            // ref={videoRef}
            autoPlay
            playsInline
            muted
          />
        </div>

        {/* Summary  */}
        <div className="rounded-[10px] flex flex-col gap-[16px] w-2/5">
          <div
            style={{
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset, 0px 4px 4px 0px rgba(0, 0, 0, 25)",
            }}
            className="p-[16px] rounded-[10px] max-h-[300px] overflow-auto bg-white"
          >
            <p className="text-[20px] mb-2 font-bold">Summary</p>
            <p>{summary}</p>
          </div>

          <div
            style={{
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset, 0px 4px 4px 0px rgba(0, 0, 0, 25)",
            }}
            className="p-[16px] rounded-[10px] bg-white"
          >
            <p className="font-bold">Conclusion:</p>
            <p>{recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
