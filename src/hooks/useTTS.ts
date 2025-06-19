export const useTTS = () => {
  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;

      // 이전 음성 중단
      synth.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ko-KR"; // 언어: 한국어
      utter.rate = 1.0;      // 속도
      utter.pitch = 1.0;     // 높낮이
      utter.volume = 1.0;    // 볼륨 (0~1)

      synth.speak(utter);
    } else {
      console.warn("Web Speech API is not supported in this browser.");
    }
  };

  return { speak };
};
