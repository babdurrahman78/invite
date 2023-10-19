import Image from "next/image";
import Button from "../common/Button";
import {IStep} from "@/interfaces/common";
import {useState} from "react";

import CheckGreen from "../../public/check-green.png";
import Sync from "../../public/sync.png";

export default function Step4({step, setStep}: IStep): JSX.Element {
  const [check, setCheck] = useState(false);

  return (
    <div className="h-[545px]">
      <div className="w-[866px] bg-content border  border-container rounded-[8px] py-[32px] px-[48px]">
        <div>
          {check ? (
            <div className="m-auto">
              <div className="flex justify-center gap-[32px] border-b py-[10px]">
                <p className="font-bold w-[120px]">Items</p>
                <p className="font-bold w-[256px]">Minimum Requirements</p>
                <p className="font-bold w-[236px]">Your Device</p>
                <p className="font-bold w-[42px]">Status</p>
              </div>
              <div className="flex justify-center gap-[32px] py-[10px]">
                <p className="font-semibold w-[120px]">Browser</p>
                <p className="text-grey w-[256px]">
                  Google Chrome, Microsoft Edge
                </p>
                <p className="font-semibold  w-[256px]">Google Chrome</p>
                <p className=" w-[42px]">
                  <Image
                    src={CheckGreen}
                    alt="check-green.png"
                    width={30}
                    height={30}
                  />
                </p>
              </div>
              <div className="flex justify-center gap-[32px] py-[10px]">
                <p className="font-semibold  w-[120px]">RAM</p>
                <p className="text-grey w-[256px]">4 GB</p>
                <p className="font-semibold  w-[256px]">8 GB</p>
                <p className=" w-[42px]">
                  <Image
                    src={CheckGreen}
                    alt="check-green.png"
                    width={30}
                    height={30}
                  />
                </p>
              </div>
              <div className="flex justify-center gap-[32px] py-[10px]">
                <p className="font-semibold  w-[120px]">Processor</p>
                <p className="text-grey w-[256px]">Core i3 / AMD Ryzen 3</p>
                <p className="font-semibold  w-[256px]">Core i5</p>
                <p className=" w-[42px]">
                  <Image
                    src={CheckGreen}
                    alt="check-green.png"
                    width={30}
                    height={30}
                  />
                </p>
              </div>
              <div className="flex justify-center gap-[32px] py-[10px]">
                <p className="font-semibold  w-[120px]">Microphone</p>
                <p className="text-grey w-[256px]">On</p>
                <p className="font-semibold  w-[256px]">On</p>
                <p className=" w-[42px]">
                  <Image
                    src={CheckGreen}
                    alt="check-green.png"
                    width={30}
                    height={30}
                  />
                </p>
              </div>
              <div className="flex justify-center gap-[32px] py-[10px]">
                <p className="font-semibold w-[120px]">Camera</p>
                <p className="text-grey w-[256px]">On</p>
                <p className="font-semibold  w-[256px]">On</p>
                <p className=" w-[42px]">
                  <Image
                    src={CheckGreen}
                    alt="check-green.png"
                    width={30}
                    height={30}
                  />
                </p>
              </div>
              <div className="w-full flex flex-col items-center">
                <Button
                  type="border-primary"
                  label={
                    <div className="flex items-center justify-center gap-[4px]">
                      <Image src={Sync} alt="sync" width={20} height={20} />
                      <p>Re-run Check</p>
                    </div>
                  }
                  labelColor="primary"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-[20px]">
              <p className="text-center">
                Run the device check, to identify does this device meets the
                minimum system and make sure that you can do the test properly
              </p>
              <Button
                onClick={() => setCheck(true)}
                type="primary"
                label="Run Check"
              />
            </div>
          )}
        </div>
      </div>
      {check && (
        <p className="font-bold mt-[26px] text-center">
          *Please make sure that your device meets all minimum requirements
          before you start interview
        </p>
      )}
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
