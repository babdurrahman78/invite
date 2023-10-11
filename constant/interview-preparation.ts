import Step1 from "@/components/interview-preparation/Step1";
import Step2 from "@/components/interview-preparation/Step2";

export const INTERVIEW_PREPARATION = [
    {
        welcome: 'Hi, Heri Tapiheru!',
        title: `Welcome to Interactive Video Interview Engine`,
        component: Step1
    },
    {
        welcome: null,
        title: 'Personal Information Permission',
        component: Step2
    }
]
