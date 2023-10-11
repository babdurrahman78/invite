'use client'

import Button from "@/components/common/Button";
import { INTERVIEW_PREPARATION } from "@/constant/interview-preparation";
import Image from "next/image";
import { useState } from 'react'

export default function page() {

    const [step, setStep] = useState(0)

    const isWelcomeExist = (step: number) => {
        if (INTERVIEW_PREPARATION[step]?.welcome) {
            return (
                <p className="text-[28px] leading-[34px] text-primaryDarker text-center font-bold" >{INTERVIEW_PREPARATION[step]?.welcome} <br /> {INTERVIEW_PREPARATION[1].title}</p>
            )
        } else {
            return <p className="text-[28px] leading-[34px] text-primaryDarker text-center font-bold" >{INTERVIEW_PREPARATION[step].title}</p>
        }
    }
    return (
        <div className="w-full flex flex-col justify-center">
            <div className={`w-full grid grid-cols-5 gap-[2px]`}>
                <div className={`h-[8px] ${step + 1 >= 1 ? 'bg-primary' : 'bg-step'} `}></div>
                <div className={`h-[8px] ${step + 1 >= 2 ? 'bg-primary' : 'bg-step'} `}></div>
                <div className={`h-[8px]  ${step + 1 >= 3 ? 'bg-primary' : 'bg-step'}`}></div>
                <div className={`h-[8px]  ${step + 1 >= 4 ? 'bg-primary' : 'bg-step'}`}></div>
                <div className={`h-[8px]  ${step + 1 >= 5 ? 'bg-primary' : 'bg-step'}`}></div>
            </div>
            <div className="flex flex-col w-[866px] mt-[64px] m-auto items-center">
                <div className="mb-[24px]">
                    {isWelcomeExist(step)}
                </div>
                {INTERVIEW_PREPARATION[step].component({ step, setStep })}

            </div>
        </div>
    )
}