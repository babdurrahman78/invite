'use client'

import React, { useState, useEffect, useRef } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';


export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [microphoneOn, setMicrophoneOn] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  // const [recordedChunks, setRecordedChunks] = useState<any>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<any>()
  const [transcribedAudio, setTranscribedAudio] = useState<string | null>(null);


  const toggleCamera = () => {
    setCameraOn(!cameraOn);
  };

  const toggleMicrophone = () => {
    setMicrophoneOn(!microphoneOn);
  };

  const toggleRecording = () => {
    if (recording) {
      mediaRecorder?.stop();
    } else {
      const constraints: MediaStreamConstraints = {
        video: cameraOn,
        audio: microphoneOn,
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);

          const chunks: Blob[] = [];
          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };

          recorder.onstop = () => {
            const audio = new Audio();
            const blob = new Blob(chunks, { type: 'audio/wav' });
            // const url = URL.createObjectURL(blob);
            audio.src = window.URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);; // Use the same audio URL
            downloadLink.download = 'audio.wav'; // Specify the filename
            console.log('test')
            downloadLink.click()
            // setAudioUrl(url);
            setRecordedAudio(blob)
            // setRecordedChunks(blob); // Set recorded audio in state
          };

          recorder.start();
        })
        .catch((error) => {
          console.error('Error accessing camera and microphone:', error);
        });
    }
    setRecording(!recording);
  };

  useEffect(() => {
    const constraints: MediaStreamConstraints = {
      video: cameraOn,
    };

    if (cameraOn) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    } else {
      // Release the media stream when turning off the camera
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    }
  }, [cameraOn]);

  const azureSubscriptionKey = "3cf9ad70a16f4a2b9383e201129b9ef0";
  const azureServiceRegion = "eastus";

  async function transcribeAudio(audioFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);

      const speechConfig = sdk.SpeechConfig.fromSubscription(
        azureSubscriptionKey,
        azureServiceRegion
      );

      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizeOnceAsync((result) => {
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          const transcription = result.text;
          resolve(transcription);
        } else {
          reject('Speech recognition failed');
        }
      });
    });
  }

  const handleTranscription = async () => {
    try {
      const transcription = await transcribeAudio(recordedAudio);
      setTranscribedAudio(transcription); // Set transcribed audio in state
      console.log('Transcription:', transcription);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
    console.log('test')
  };

  useEffect(() => {
    if (!microphoneOn) {
      // Release the media stream when turning off the microphone
      const stream = audioRef.current?.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        if (audioRef.current) {
          audioRef.current.srcObject = null;
        }
      }
    }
  }, [microphoneOn]);

  return (
    <div>
      <h1>Camera and Microphone Access</h1>
      <div className="button-container">
        <button className={`toggle-button ${cameraOn ? 'active' : ''}`} onClick={toggleCamera}>
          {cameraOn ? 'Stop Camera' : 'Start Camera'}
        </button>
        <button className={`toggle-button ${microphoneOn ? 'active' : ''}`} onClick={toggleMicrophone}>
          {microphoneOn ? 'Stop Microphone' : 'Start Microphone'}
        </button>
        <button className={`toggle-button ${recording ? 'active' : ''}`} onClick={toggleRecording}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button className="toggle-button" onClick={handleTranscription} disabled={!recordedAudio}>
          Transcribe Audio
        </button>
      </div>
      {audioUrl && (
        <div>
          <h2>Recorded Audio</h2>
          <audio controls ref={audioRef} src={audioUrl} />
        </div>
      )}
      <div className="transcription">
        <h3>Transcribed Audio</h3>
        <p>{transcribedAudio}</p>
      </div>
      <div>
        <h2>Live Video</h2>
        <video autoPlay playsInline muted ref={videoRef} />
      </div>
    </div>
  );
}
