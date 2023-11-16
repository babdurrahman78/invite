"use client"

import { createContext, useState } from 'react'
import { StatusMessages, useReactMediaRecorder } from 'react-media-recorder'

export const RecordingContext = createContext<{
    startRecording: () => void,
    stopRecording: () => void,
    mediaBlobUrl: string | null,
    status: StatusMessages
} | null>(null)


const RecordingContextComponent: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {

    const { startRecording, stopRecording, mediaBlobUrl, status } = useReactMediaRecorder({
        screen: true,
        audio: true,
        askPermissionOnMount: false,
    });

    return (
        <RecordingContext.Provider value={{
            startRecording,
            stopRecording,
            mediaBlobUrl,
            status
        }}>
            {children}
        </RecordingContext.Provider>
    )
}

export default RecordingContextComponent