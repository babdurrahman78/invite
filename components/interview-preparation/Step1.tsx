import Image from "next/image";
import Button from "../common/Button";
import { Dispatch, SetStateAction } from "react";
import { IStep } from "@/interfaces/common";

export default function Step1(
    { step, setStep }: IStep
): JSX.Element {
    return (
        <div>
            <div className="bg-content border border-container rounded-[8px] py-[32px] px-[48px]">
                <div className="flex flex-col gap-[20px]">
                    <p>At this stage, you will be interviewed by an Artificial Intelligence named Vivi. The interview will be conducted interactively, where your spoken responses will be recorded and responded to by Vivi in text format.</p>
                    <div className="flex gap-4 items-center">
                        <Image src={'/check.png'} alt="check.png" width={26} height={26} />
                        <p>Please ensure that you have a stable internet connection 📶 and are in a quiet environment 🤫.</p>
                    </div>
                    <div>
                        <div className="flex gap-4 items-center">
                            <Image src={'/check.png'} alt="check.png" width={26} height={26} />
                            <p>Please make sure you are using a browser and device with the following specifications:</p>
                        </div>
                        <ol className="ml-20" style={{ listStyleType: "lower-alpha" }}>
                            <li>Google Chrome / Microsoft Edge</li>
                            <li>RAM 4GB</li>
                            <li>Processor: Core i3 or AMD Ryzen 3 (or equivalent)</li>
                            <li>Microphone</li>
                            <li>Camera</li>
                        </ol>

                    </div>

                    <p>This will help ensure a smooth interview experience.</p>
                </div>
            </div>
            <div className="flex justify-between w-full mt-[24px]">
                <Button onClick={() => setStep(step - 1)} type="ghost" labelColor="grey" label={<div className="flex items-center justify-center gap-[4px]">
                    <Image src={'/previous.png'} alt="previous" width={20} height={20} />
                    <p>Previous</p>
                </div>} />
                <Button onClick={() => setStep(step + 1)} type="primary" label={<div className="flex items-center justify-center gap-[4px]">
                    <p>Next</p>
                    <Image src={'/next.png'} alt="next" width={20} height={20} />
                </div>} />
            </div>
            <p className="text-grey mt-[60px] bg-container w-full text-center">{`${step + 1} of 5`}</p>
        </div>
    )
}