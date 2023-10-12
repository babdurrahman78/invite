import Image from "next/image";
import Button from "../common/Button";
import { IStep } from "@/interfaces/common";
import React, { useEffect, useRef, useState } from 'react';


export default function Step5(
    { step, setStep }: IStep
): JSX.Element {

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [permissionState, setPermissionState] = useState<PermissionState | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing the camera:', error);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        let audioContext: AudioContext | null = null;
        let analyser: AnalyserNode | null = null;
        let canvasContext: CanvasRenderingContext2D | null = null;

        if (canvas) {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            const canvasCtx = canvas.getContext('2d');
            if (canvasCtx) {
                canvasContext = canvasCtx;
            }

            const initAudio = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const audioSource = audioContext?.createMediaStreamSource(stream);
                    let bufferLength: any
                    if (analyser) {
                        audioSource?.connect(analyser);

                        analyser.fftSize = 256;
                        bufferLength = analyser.frequencyBinCount;
                    }
                    const dataArray = new Uint8Array(bufferLength);

                    const draw = () => {
                        analyser?.getByteTimeDomainData(dataArray);

                        if (canvasContext) {
                            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                            canvasContext.lineWidth = 2;
                            canvasContext.strokeStyle = '#FFFFFF';
                            canvasContext.beginPath();

                            const sliceWidth = (canvas.width * 1.0) / bufferLength;
                            let x = 0;

                            for (let i = 0; i < bufferLength; i++) {
                                const v = dataArray[i] / 128.0;
                                const y = (v * canvas.height) / 2;

                                if (i === 0) {
                                    canvasContext.moveTo(x, y);
                                } else {
                                    canvasContext.lineTo(x, y);
                                }

                                x += sliceWidth;
                            }

                            canvasContext.lineTo(canvas.width, canvas.height / 2);
                            canvasContext.stroke();
                        }

                        requestAnimationFrame(draw);
                    };

                    draw();
                } catch (error) {
                    console.error('Error accessing the microphone:', error);
                }
            };

            initAudio();
        }

        return () => {
            if (audioContext) {
                audioContext.close().then(() => {
                    console.log('Audio context closed.');
                });
            }
        };
    }, []);

    useEffect(() => {
        // navigator.permissions.query({ name: 'camera' as PermissionName }).then((permissionStatus) => {
        //     setPermissionState(permissionStatus.state);
        //     permissionStatus.onchange = () => {
        //         console.log(permissionStatus)
        //         setPermissionState(permissionStatus.state);
        //         if (permissionStatus.state === 'granted') {
        //             startCamera(); // Call startCamera when permission is granted.
        //         }
        //     };
        // });

        startCamera();
    }, []);


    return (

        <div className="h-[545px]">

            <div className="w-[866px] h-[433px] relative bg-black rounded-[8px]">
                {(
                    <video
                        style={{ width: '100%', height: '433px' }}
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                    />

                )}

                <div style={{
                    borderRadius: "4px",
                    background: "rgba(7, 7, 8, 0.40)",
                    backdropFilter: "blur(4px)",
                }} className="p-4 h-[74px] absolute bottom-[16px] left-[150px] right-[150px] rounded-[4px]">
                    <div className="flex gap-6 items-center">
                        <Button type="primary" label="Mic Test" />
                        <canvas ref={canvasRef} width={400} height={50}></canvas>
                    </div>
                </div>
            </div>

            <div className="flex justify-between w-full mt-[24px]">
                <Button onClick={() => setStep(step - 1)} type="ghost" labelColor="grey" label={<div className="flex items-center justify-center gap-[4px]">
                    <Image src={'/previous.png'} alt="previous" width={20} height={20} />
                    <p>Previous</p>
                </div>} />
                <Button width="278px" height="44px" onClick={() => setStep(step + 1)} type="primary" label={<div className="flex items-center justify-center gap-[4px]">
                    <p>Start the Interview Session</p>
                </div>} />
            </div>

        </div>
    )
}