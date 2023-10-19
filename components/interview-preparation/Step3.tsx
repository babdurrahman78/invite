"use client";

import Image from "next/image";
import Button from "../common/Button";
import {IStep} from "@/interfaces/common";
import {useState} from "react";

export default function Step3({step, setStep}: IStep) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="h-[550px]">
      <ul className="flex flex-col gap-[20px] text-justify bg-content border border-container rounded-[8px] py-[32px] px-[48px]">
        <li className="flex gap-4">
          <p className="text-primary">1.</p>
          <p>
            Impersonate another person or entity, including but not limited to a
            representative of the Company, or impersonate a representative of
            the individual or entity making the purchase.
          </p>
        </li>
        <li className="flex gap-3">
          <p className="text-primary">2.</p>
          <p>
            {`Uploading that contains elements of ethnicity, religion, race and inter-group ("SARA"), and pornography, including anything that is prohibited by applicable regulations and laws.`}
          </p>
        </li>
        <li className="flex gap-3">
          <p className="text-primary">3.</p>
          <p>
            Upload, submit, send Material that violates patents, trademarks,
            trade secrets, copyrights or other proprietary rights owned by other
            parties.
          </p>
        </li>
        <li className="flex gap-3">
          <p className="text-primary">4.</p>
          <p>
            Providing false information, information that is prohibited under
            applicable law, information that is prohibited from being conveyed
            according to certain agreements.
          </p>
        </li>
        <li className="flex gap-3">
          <p className="text-primary">5.</p>
          <p>
            Obtain or store personal information or data belonging to other
            visitors or users of this Site, and distribute such data to other
            third parties.
          </p>
        </li>
        <li className="flex gap-3">
          <p className="text-primary">6.</p>
          <p>
            Carrying out hacking, cracking, or other attempts to take control of
            the Site.
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
