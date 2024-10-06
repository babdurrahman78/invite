import {IMessage} from "@/interfaces/common";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const openAIEndpoint = "https://invitejardinesopenai.openai.azure.com";
const openAIApiKey = "fef64bc2a111491f8a71550bd1ac7fcf";
const openAIDeploymentName = "invite1";
const sentenceLevelPunctuations = [
  ".",
  "?",
  "!",
  ":",
  ";",
  "。",
  "？",
  "！",
  "：",
  "；",
];

// Do HTML encoding on given text
function htmlEncode(text: string) {
  const entityMap: any = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
  };

  return String(text).replace(/[&<>"'\/]/g, match => entityMap[match]);
}

const speak = (
  text: string,
  isSpeaking: boolean,
  spokenTextQueue: string[],
  avatarSynthesizer: sdk.AvatarSynthesizer,
  onSpeaking: (value: string) => void
) => {
  if (isSpeaking) {
    spokenTextQueue.push(text);
    return;
  }

  //   console.log("spoken text :", text);

  speakNext(text, isSpeaking, avatarSynthesizer, spokenTextQueue, onSpeaking);
};

const speakNext = (
  text: string,
  isSpeaking: boolean,
  avatarSynthesizer: sdk.AvatarSynthesizer,
  spokenTextQueue: string[],
  onSpeaking: (value: string) => void
) => {
  const ttsVoice = "en-US-AvaMultilingualNeural";
  let ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'><voice name='${ttsVoice}'><mstts:ttsembedding><mstts:leadingsilence-exact value='0'/>${htmlEncode(
    text
  )}</mstts:ttsembedding></voice></speak>`;

  isSpeaking = true;
  avatarSynthesizer
    .speakSsmlAsync(ssml)
    .then(result => {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log(
          `Speech synthesized to speaker for text [ ${text} ]. Result ID: ${result.resultId}`
        );
        onSpeaking(text + " ");
      } else {
        console.log(
          `Error occurred while speaking the SSML. Result ID: ${result.resultId}`
        );
      }

      if (spokenTextQueue.length > 0) {
        speakNext(
          spokenTextQueue.shift()!,
          isSpeaking,
          avatarSynthesizer,
          spokenTextQueue,
          onSpeaking
        );
      } else {
        isSpeaking = false;
      }
    })
    .catch(error => {
      console.log(`Error occurred while speaking the SSML: [ ${error} ]`);

      if (spokenTextQueue.length > 0) {
        speakNext(
          spokenTextQueue.shift()!,
          isSpeaking,
          avatarSynthesizer,
          spokenTextQueue,
          onSpeaking
        );
      } else {
        isSpeaking = false;
      }
    });
};

export const submitMsg = async (
  messages: IMessage[],
  avatarSynthesizer: sdk.AvatarSynthesizer,
  onSpeaking: (value: string) => void
) => {
  const spokenTextQueue: string[] = [];
  let isSpeaking = false;

  let url =
    "{AOAIEndpoint}/openai/deployments/{AOAIDeployment}/chat/completions?api-version=2023-06-01-preview"
      .replace("{AOAIEndpoint}", openAIEndpoint)
      .replace("{AOAIDeployment}", openAIDeploymentName);
  let body = JSON.stringify({
    messages: messages,
    stream: true,
  });

  const byodDocRegex = new RegExp(/\[doc(\d+)\]/g);

  let toolContent = "";
  let assistantReply = "";
  let spokenSentence = "";

  fetch(url, {
    method: "POST",
    headers: {
      "api-key": openAIApiKey,
      "Content-Type": "application/json",
    },
    body,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(
          `Chat API response status: ${response.status} ${response.statusText}`
        );
      }

      const reader = response.body?.getReader();

      function read(previousChunkString: string = ""): any {
        return reader?.read().then(({value, done}) => {
          // Check if there is still data to read
          if (done) {
            // Stream complete
            return;
          }

          // Process the chunk of data (value)
          let chunkString = new TextDecoder().decode(value, {stream: true});
          if (previousChunkString !== "") {
            // Concatenate the previous chunk string in case it is incomplete
            chunkString = previousChunkString + chunkString;
          }

          if (
            !chunkString.endsWith("}\n\n") &&
            !chunkString.endsWith("[DONE]\n\n")
          ) {
            // This is a incomplete chunk, read the next chunk
            return read(chunkString);
          }

          chunkString.split("\n\n").forEach(line => {
            try {
              if (line.startsWith("data:") && !line.endsWith("[DONE]")) {
                const responseJson = JSON.parse(line.substring(5).trim());

                console.log(responseJson);

                let responseToken = undefined;

                responseToken = responseJson.choices[0].delta.content;
                //   responseToken = responseJson.choices[0].delta.content;

                if (responseToken !== undefined && responseToken !== null) {
                  assistantReply += responseToken; // build up the assistant message

                  if (responseToken === "\n" || responseToken === "\n\n") {
                    speak(
                      spokenSentence.trim(),
                      isSpeaking,
                      spokenTextQueue,
                      avatarSynthesizer,
                      onSpeaking
                    );
                    spokenSentence = "";
                  } else {
                    responseToken = responseToken.replace(/\n/g, "");
                    spokenSentence += responseToken; // build up the spoken sentence

                    if (
                      responseToken.length === 1 ||
                      responseToken.length === 2
                    ) {
                      for (
                        let i = 0;
                        i < sentenceLevelPunctuations.length;
                        ++i
                      ) {
                        let sentenceLevelPunctuation =
                          sentenceLevelPunctuations[i];
                        if (
                          responseToken.startsWith(sentenceLevelPunctuation)
                        ) {
                          speak(
                            spokenSentence.trim(),
                            isSpeaking,
                            spokenTextQueue,
                            avatarSynthesizer,
                            onSpeaking
                          );
                          spokenSentence = "";
                          break;
                        }
                      }
                    }
                  }
                }
              }
            } catch (error) {
              console.log(
                `Error occurred while parsing the response: ${error}`
              );
            }
          });

          return read();
        });
      }

      return read();
    })
    .then(() => {
      if (spokenSentence !== "") {
        speak(
          spokenSentence.trim(),
          isSpeaking,
          spokenTextQueue,
          avatarSynthesizer,
          onSpeaking
        );
        spokenSentence = "";
      }
    });
};

export {openAIApiKey, openAIDeploymentName, openAIEndpoint};
