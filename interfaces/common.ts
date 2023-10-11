import { Dispatch, SetStateAction } from "react"

export interface IStep {
    step: number,
    setStep: Dispatch<SetStateAction<number>>
}``