import { useEffect, useRef } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function VoiceButton({
  onLiveTranscript,
  onFinalTranscript,
}) {
  const lastProcessedRef = useRef("");

  const {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    onLiveTranscript?.(transcript);
  }, [transcript, onLiveTranscript]);

  useEffect(() => {
    if (
      finalTranscript &&
      finalTranscript !== lastProcessedRef.current
    ) {
      lastProcessedRef.current = finalTranscript;

      onFinalTranscript?.(finalTranscript);

      resetTranscript();
    }
  }, [finalTranscript, onFinalTranscript, resetTranscript]);

  const handleClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      lastProcessedRef.current = "";
      resetTranscript();

      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
        language: "en-US",
      });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative cursor-pointer group"
    >
      {listening ? (
        <FaMicrophone className="text-red-500" />
      ) : (
        <FaMicrophone className="text-primary" />
      )}

      <span
        className="
          absolute bottom-full left-1/2 ml-2
          -translate-x-1/2
          whitespace-nowrap
          rounded bg-gray-800 px-2 py-1
          text-xs text-white
          opacity-0 transition-opacity
          group-hover:opacity-100
          pointer-events-none
        "
      >
        {listening ? "Stop Recording" : "Start Voice Input"}
      </span>
    </button>
  );
}