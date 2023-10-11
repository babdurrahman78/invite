import Image from "next/image";

export default function Step2() {
    return (<div>
        <ol className="flex flex-col gap-[20px] text-justify bg-content border border-container rounded-[8px] py-[32px] px-[48px]" style={{ listStyleType: 'decimal' }}>
            <li className="color-pointer">You hereby give your explicit consent to the Company to utilize your personal data and/or transaction data for the purpose of using the Website, transactions, the Company's business activities, and operational needs, as well as other purposes related to the provision of services on this Website.</li>
            <li className="color-pointer">The Company receives personal data about you as a Site user, which you must complete before using this Site. Personal data includes, but is not limited to, your name, identity card number, residential address, cell phone number, e-mail address, and other related personal information.</li>
            <li>When using services through the Site, you are required to always provide true and accurate information and personal data. Failure or error in providing correct and accurate information and personal data can result in the Company failing to provide the best and most accurate service to you, and this is entirely your responsibility as the provider of the information.</li>
            <li>All information and data that the Company receives from you through this Site will be used by the Company to develop the Company's services, including the Company's marketing services.</li>
        </ol>

        <div className="mt-[24px] flex justify-center items-center gap-[8px]">
            <input type="checkbox" />
            <p className="font-bold">I agree to the use of my personal information</p>
        </div>
    </div>)
}