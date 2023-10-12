'use client'

import Step1 from "@/components/interview-preparation/Step1";
import Step2 from "@/components/interview-preparation/Step2";
import Step3 from "@/components/interview-preparation/Step3";
import Step4 from "@/components/interview-preparation/Step4";
import Step5 from "@/components/interview-preparation/Step5";
import { INTERVIEW_PREPARATION } from "@/constant/interview-preparation";
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

    const renderComponent = (step: number) => {
        if (step + 1 === 1) {
            return <Step1 step={step} setStep={setStep} />
        } else if (step + 1 === 2) {
            return <Step2 step={step} setStep={setStep} />
        } else if (step + 1 === 3) {
            return <Step3 step={step} setStep={setStep} />
        } else if (step + 1 === 4) {
            return <Step4 step={step} setStep={setStep} />
        } else if (step + 1 === 5) {
            return <Step5 step={step} setStep={setStep} />
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

                {
                    renderComponent(step)
                }
                <p className="text-grey bg-container w-full text-center">{`${step + 1} of 5`}</p>
            </div>
        </div>
    )
}