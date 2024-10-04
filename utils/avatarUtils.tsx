import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import {getSpeechSynthesizer} from "./speechUtils";

export const getAvatarSynthesizer = () => {
  const videoFormat = new sdk.AvatarVideoFormat();
  const avatarConfig = new sdk.AvatarConfig(
    "lisa",
    "casual-sitting",
    videoFormat
  );

  const speechSynthesizerConfig = getSpeechSynthesizer();

  const avatarSynthesizer = new sdk.AvatarSynthesizer(
    speechSynthesizerConfig,
    avatarConfig
  );

  return avatarSynthesizer;
};
