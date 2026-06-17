import { useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function VoiceButton({
    setTranscript,
    }) {
    const {
        transcript: speechText,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        console.log("Speech:", speechText);
        setTranscript(speechText);
    }, [speechText]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Speech recognition not supported.</span>;
    }

    const handleClick = () => {
        console.log("Mic clicked");
        if (listening) {
        SpeechRecognition.stopListening();
        } else {
        resetTranscript();

        SpeechRecognition.startListening({
            continuous: true,
            language: "en-GB",
        });
        }
    };

    return (
        <button
        type="button"
        onClick={handleClick}
        className={`p-2 rounded-full transition
            ${
            listening
                ? "bg-red-100 text-red-600"
                : "bg-primary/10 text-primary"
            }`}
        title={listening ? "Stop Recording" : "Start Recording"}
        >
        <FaMicrophone size={16} />
        </button>
    );
}