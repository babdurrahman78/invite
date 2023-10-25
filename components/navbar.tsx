"use client";
import Image from "next/image";
import {useContext} from "react";
import {FinishInterviewContext} from "./finishInterviewComponent";

export default function Navbar() {
  const finishInterviewContext = useContext(FinishInterviewContext);
  return (
    <nav className="h-[64px] w-full justify-between flex px-[65px] py-[16px] bg-content">
      <Image
        className=""
        src={"/astra-logo.png"}
        alt="astra-logo.png"
        width={150}
        height={32}
        onClick={() => finishInterviewContext?.setIsFinish(true)}
      />
      <div className="flex gap-[8px] items-center">
        <Image src={"/avatar.png"} alt="avatar.png" width={40} height={40} />
        <p>John Doe</p>
      </div>
    </nav>
  );
}
