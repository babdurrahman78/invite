import Image from "next/image";

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col max-w-[1440px] max-h-[780px] items-center">
      <nav className="h-[64px] w-full justify-between flex px-[65px] py-[16px] bg-content">
        <Image
          className=""
          src={"/astra-logo.png"}
          alt="astra-logo.png"
          width={150}
          height={32}
        />
        <div className="flex gap-[8px] items-center">
          <Image src={"/avatar.png"} alt="avatar.png" width={40} height={40} />
          <p>John Doe</p>
        </div>
      </nav>
      <div className="bg-container w-full h-[780px]">{children}</div>
    </div>
  );
}
