import Button from "../common/Button";
import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { RecordingContext } from "../recordingContext";



export default function Step6() {
    const [isRecording, setIsRecording] = useState(false);
    const recrodingContext = useContext(RecordingContext)


    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            recrodingContext?.startRecording();
        } else {
            recrodingContext?.stopRecording();
        }
    };

    useEffect(() => {
        setIsRecording(recrodingContext?.status === "recording")
    }, [recrodingContext?.status])

    return (
        <div className="h-[545px]">
            <div className="w-[866px] flex flex-col gap-5 py-8 px-12 rounded-lg bg-content border border-container">
                <p>
                    We highly value your privacy. During the interview process, we require your formal consent for full-screen recording, strictly for review and assessment by our Human Resources team. Should you choose not to permit screen recording, we regret to inform you that it will not be possible to proceed with the interview session. If you consent to the screen recording, please follow these steps:
                </p>

                <ol className="list-decimal ml-10">
                    <li>{`Mark the "checkbox" indicated below to signify your authorization`}</li>
                    <li>
                        {`Upon receiving a pop-up message requesting permission, choose "Entire Screen" to enable full-screen recording.`}
                    </li>
                    <li>{`Click the "Share" button.`}</li>
                    <li>{`Proceed to click "Start the Interview Session" to commence your interview.`}
                    </li>
                </ol>

                <div className="flex gap-2 m-auto">
                    <input type="checkbox" checked={recrodingContext?.status === "recording"}
                        onChange={handleCheckboxChange} />
                    <p>{`I allow full-screen recording of my interview for review and assessment purposes`}</p>
                </div>


            </div>

            <div className="flex justify-center w-full mt-[24px]">
                <Link href={"/interview/session"}>
                    <Button
                        type="primary"
                        disabled={!isRecording}
                        label={
                            <div className="flex items-center justify-center gap-[4px]">
                                <p>Start Now</p>
                            </div>
                        }
                    />
                </Link>
            </div>
        </div>
    )
}