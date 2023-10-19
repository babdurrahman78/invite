"use client";

import Image from "next/image";
import Button from "../common/Button";
import {IStep} from "@/interfaces/common";
import {useState} from "react";

export default function Step2({step, setStep}: IStep) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="h-[550px]">
      <ul className="flex flex-col gap-[20px] text-justify bg-content border border-container rounded-[8px] py-[32px] px-[48px]">
        <li className="flex gap-4">
          <p className="text-primary">1.</p>
          <p>
            {
              "You hereby give your explicit consent to the Company to utilize your personal data and/or transaction data for the purpose of using the Website, transactions, the Company's business activities, and operational needs, as well as other purposes related to the provision of services on this Website."
            }
          </p>
        </li>
        <li className="flex gap-3">
          <p className="text-primary">2.</p>
          <p>
            The Company receives personal data about you as a Site user, which
            you must complete before using this Site. Personal data includes,
            but is not limited to, your name, identity card number, residential
            address, cell phone number, e-mail address, and other related
            personal information.
          </p>
        </li>
        <li className="flex gap-3">
          <p className="text-primary">3.</p>
          <p>
            When using services through the Site, you are required to always
            provide true and accurate information and personal data. Failure or
            error in providing correct and accurate information and personal
            data can result in the Company failing to provide the best and most
            accurate service to you, and this is entirely your responsibility as
            the provider of the information.
          </p>
        </li>
        <li className="flex gap-3">
          <p className="text-primary">4.</p>
          <p>
            {
              "All information and data that the Company receives from you through this Site will be used by the Company to develop the Company's services, including the Company's marketing services."
            }
          </p>
        </li>
      </ul>

      <div className="mt-[24px] flex justify-center items-center gap-[8px]">
        <input type="checkbox" onClick={() => setChecked(!checked)} />
        <p className="font-bold">
          I agree to the use of my personal information
        </p>
      </div>
      <div className="flex justify-between w-full mt-[24px]">
        <Button
          onClick={() => setStep(step - 1)}
          type="ghost"
          labelColor="grey"
          label={
            <div className="flex items-center justify-center gap-[4px]">
              <Image
                src={"/previous.png"}
                alt="previous"
                width={20}
                height={20}
              />
              <p>Previous</p>
            </div>
          }
        />
        <Button
          onClick={() => setStep(step + 1)}
          type="primary"
          disabled={!checked}
          label={
            <div className="flex items-center justify-center gap-[4px]">
              <p>Next</p>
              <Image src={"/next.png"} alt="next" width={20} height={20} />
            </div>
          }
        />
      </div>
    </div>
  );
}
