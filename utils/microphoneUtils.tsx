import * as sdk from "microsoft-cognitiveservices-speech-sdk";

// export const handleUserQuery = (value: string) => {
//   let chatMessage = {
//     role: "user",
//     content: value,
//   };
// };

export const microphone = async (
  startText: string,
  stopText: string,
  microphoneBtn: HTMLButtonElement,
  speechRecognizer: sdk.SpeechRecognizer,
  onRecognized: (value: string) => void
) => {
  let result: string = "";
  const audioPlayer: HTMLAudioElement = document.getElementById(
    "audioPlayer"
  ) as HTMLAudioElement;

  // Check if the microphone button shows the start state
  if (microphoneBtn.innerHTML === startText) {
    if (audioPlayer) {
      audioPlayer.play();
    }

    microphoneBtn.disabled = true;

    // Start listening and accumulate recognized speech
    speechRecognizer.recognized = async (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        let userQuery = e.result.text.trim();
        if (userQuery === "") {
          return;
        }

        console.log(userQuery);
        onRecognized(userQuery);
      }
    };

    // Start continuous recognition
    speechRecognizer.startContinuousRecognitionAsync(
      () => {
        microphoneBtn.innerHTML = stopText;
        microphoneBtn.disabled = false;
      },
      err => {
        console.log("Failed to start continuous recognition:", err);
        microphoneBtn.disabled = false;
      }
    );
  } else {
    // Stop recognition
    microphoneBtn.disabled = true;

    speechRecognizer.stopContinuousRecognitionAsync(
      async () => {
        microphoneBtn.innerHTML = startText;
        microphoneBtn.disabled = false;
      },
      err => {
        console.log("Failed to stop continuous recognition:", err);
        microphoneBtn.disabled = false;
      }
    );
  }
};
