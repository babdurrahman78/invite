import Image from "next/image";
import { ChangeEvent, useState } from "react";

export default function Login() {

    const [password, setPassword] = useState('');
    const [maskedPassword, setMaskedPassword] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPassword(value);
        console.log(value)
        setMaskedPassword('*'.repeat(value.length));
    };

    return (
        <div className="flex">
            <Image src={'/astra-bg.svg'} alt="astra-bg" width={930} height={780} />
            <div className="bg-content w-[510px] pt-[48px] px-[24px]">
                <Image src={'/astra-logo.png'} alt="astra-logo.png" width={143.75} height={40} />

                {/* Form  */}
                <div className="mt-[128px] flex flex-col gap-[48px]">
                    <p className="font-bold px-[100px] text-[#083F78] text-[28px] text-center leading-[34px]">Welcome to Interview Session</p>
                    <div className="m-auto w-[300px]">
                        <p className="text-center">Please enter your interview code:</p>
                        <input type="text" value={maskedPassword}
                            onChange={handleChange} className="px-[24px] tracking-[10px] font-bold text-[20px] w-full border border-[var(--neutral-20, #E0E6EB)] text-center rounded-[4px] py-[16px] mt-[8px] bg-container" />
                    </div>
                    <div className="w-[300px] m-auto">
                        <input type="submit" value={"Log in"} className="w-full text-center m-auto py-[12px] rounded-[4px] bg-primary text-white" />
                        <p className="text-center mt-[16px]">Having trouble logging in? <span className="font-bold text-primary">Contact us</span></p>
                    </div>
                    <p className="mt-[132px] text-center">© PT Astra International Tbk 2023</p>
                </div>
            </div>
        </div>
    )
}