'use client'

import React, { useState, useEffect, useRef } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

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

  const { writeFile, exec, readFile, load } = new FFmpeg


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
        video: false,
        audio: true
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

          recorder.onstop = async () => {
            // const audio = new Audio();
            const blob = new Blob(chunks, { type: 'audio/wav' });


            // Create arrayBuffer
            const buf = await blob.arrayBuffer()

            // const sampleRate = readSampleRate(buf);
            // const bitsPerSample = readBitDepth(buf);

            // Define or retrieve new header parameters
            const sampleRate = 8000; // Sample rate in Hz
            const bitsPerSample = 16; // Bits per sample
            const numChannels = 1; // Mono
            const dataSize = blob.size

            // Calculate the size of the existing header
            const headerSize = 44; // Size of the standard WAV header

            // Calculate the byte rate (bytes per second)
            const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;

            // Calculate the total size of the new buffer (header + audio data)
            const totalSize = headerSize + dataSize; // 44 is the size of the RIFF header

            // Create a new buffer to hold the combined data
            // const newBuffer = new ArrayBuffer(totalSize);
            // const view = new DataView(newBuffer);

            const headerBuffer = Buffer.alloc(44);

            // Chunk ID (RIFF identifier)
            headerBuffer.write('RIFF', 0);
            // File size (total file size - 8 bytes)
            headerBuffer.writeUInt32LE(dataSize + 44 - 8, 4);
            // Format (WAVE identifier)
            headerBuffer.write('WAVE', 8);
            // Subchunk1 ID (fmt identifier)
            headerBuffer.write('fmt ', 12);
            // Subchunk1 size (16 for PCM)
            headerBuffer.writeUInt32LE(16, 16);
            // Audio format (1 for PCM)
            headerBuffer.writeUInt16LE(1, 20);
            // Number of channels (1 for mono, 2 for stereo)
            headerBuffer.writeUInt16LE(1, 22);
            // Sample rate (e.g., 44100)
            headerBuffer.writeUInt32LE(sampleRate, 24);
            // Byte rate (SampleRate * NumChannels * BitsPerSample / 8)
            headerBuffer.writeUInt32LE(sampleRate * 1 * 16, 28);
            // Block align (NumChannels * BitsPerSample / 8)
            headerBuffer.writeUInt16LE(1 * 16, 32);
            // Bits per sample (e.g., 16 bits)
            headerBuffer.writeUInt16LE(8, 34);
            // Subchunk2 ID (data identifier)
            headerBuffer.write('data', 36);
            // Subchunk2 size (size of audio data)
            headerBuffer.writeUInt32LE(dataSize, 40);

            const testNewBuffer = Buffer.concat([headerBuffer, Buffer.from(buf)], Buffer.from(buf).length + 44)

            // // Write the RIFF header (first 4 bytes)
            // view.setUint8(0, 'R'.charCodeAt(0));
            // view.setUint8(1, 'I'.charCodeAt(0));
            // view.setUint8(2, 'F'.charCodeAt(0));
            // view.setUint8(3, 'F'.charCodeAt(0));

            // // Write the file size (totalSize - 8) as a little-endian 32-bit integer
            // view.setUint32(4, totalSize - 8, true);

            // // Write the "WAVE" chunk marker (8 bytes)
            // view.setUint8(8, 'W'.charCodeAt(0));
            // view.setUint8(9, 'A'.charCodeAt(0));
            // view.setUint8(10, 'V'.charCodeAt(0));
            // view.setUint8(11, 'E'.charCodeAt(0));
            // view.setUint8(12, 'f'.charCodeAt(0));
            // view.setUint8(13, 'm'.charCodeAt(0));
            // view.setUint8(14, 't'.charCodeAt(0));
            // view.setUint8(15, ' '.charCodeAt(0));

            // // Write the size of the "fmt " subchunk (16 for PCM)
            // view.setUint32(16, 16, true);

            // // Write the audio format (1 for PCM)
            // view.setUint16(20, 1, true);

            // // Write the number of channels (1 for mono)
            // view.setUint16(22, numChannels, true);

            // // Write the sample rate
            // view.setUint32(24, sampleRate, true);

            // // Write the byte rate
            // view.setUint32(28, byteRate, true);

            // // Write the block alignment (number of bytes per sample)
            // view.setUint16(32, (numChannels * bitsPerSample) / 8, true);

            // // Write the bits per sample
            // view.setUint16(34, bitsPerSample, true);

            // // Write the "data" subchunk marker (36-39)
            // view.setUint8(36, 'd'.charCodeAt(0));
            // view.setUint8(37, 'a'.charCodeAt(0));
            // view.setUint8(38, 't'.charCodeAt(0));
            // view.setUint8(39, 'a'.charCodeAt(0));

            // // Write the size of the audio data
            // view.setUint32(40, dataSize, true);

            // // Copy the existing audio data to the new buffer after the header
            // const audioDataView = new DataView(await blob.arrayBuffer());
            // for (let i = 0; i < dataSize; i++) {
            //   view.setUint8(headerSize + i, audioDataView.getUint8(i));
            // }

            // console.log(audioDataView)
            // console.log(view)

            // Once you've written the header and audio data, you can create a Blob
            const modifiedBlob = new Blob([testNewBuffer], { type: 'audio/wav' });

            const wavFile = new File([modifiedBlob], 'testing.wav', { type: 'audio/wav' })

            const blobUrl = URL.createObjectURL(wavFile);

            // Create a download link.
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = 'test.wav';

            downloadLink.click()
            const transcription = await transcribeAudio(wavFile)

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
      console.log(audioFile)
      const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);
      console.log(audioConfig)
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        azureSubscriptionKey,
        azureServiceRegion
      );

      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      recognizer.recognizeOnceAsync((result) => {
        console.log(result)
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          const transcription = result.text;
          console.log(transcription)
          resolve(transcription);
        } else {
          reject('failed');
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
        <button className="toggle-button" onClick={handleTranscription}>
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
