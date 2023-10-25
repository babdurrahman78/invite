"use client";
import FinishInterviewContextComponent from "@/components/finishInterviewComponent";
import Navbar from "@/components/navbar";
export default function layout({children}: {children: React.ReactNode}) {
  return (
    <FinishInterviewContextComponent>
      <div className="flex flex-col max-w-[1440px] max-h-[780px] items-center">
        <Navbar />
        <div className="bg-container w-full h-[780px]">{children}</div>
      </div>
    </FinishInterviewContextComponent>
  );
}
