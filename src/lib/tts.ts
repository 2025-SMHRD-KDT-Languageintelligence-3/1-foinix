
'use client';

interface SpeakOptions {
  lang?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  voiceURI?: string; // Allow specifying a voice by its URI
}

/**
 * Speaks the given text using the browser's SpeechSynthesis API.
 * @param text The text to speak.
 * @param options Optional configuration for language, pitch, rate, volume, and voice.
 */
export async function speak(text: string, options?: SpeakOptions): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('SpeechSynthesis API is not available in this browser.');
    // Consider using a toast notification for user feedback
    // toast({ title: "TTS Error", description: "Speech synthesis is not supported in this browser.", variant: "destructive" });
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel(); // Cancel current speech to avoid overlap
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Apply general options
  if (options) {
    if (options.lang) utterance.lang = options.lang;
    if (options.pitch !== undefined) utterance.pitch = options.pitch; // Range 0 to 2
    if (options.rate !== undefined) utterance.rate = options.rate;   // Range 0.1 to 10
    if (options.volume !== undefined) utterance.volume = options.volume; // Range 0 to 1
  } else {
    // Default language based on current document language if not specified
    utterance.lang = typeof document !== 'undefined' ? document.documentElement.lang || 'ko-KR' : 'ko-KR';
  }

  // Apply specific voice if requested and available
  if (options?.voiceURI) {
    const voices = await getVoices();
    const selectedVoice = voices.find(voice => voice.voiceURI === options.voiceURI);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      // Ensure the language of the utterance matches the voice's language if specified by the voice
      if (selectedVoice.lang) {
        utterance.lang = selectedVoice.lang;
      }
    } else {
      console.warn(`Voice URI "${options.voiceURI}" not found. Using default voice for lang "${utterance.lang}".`);
    }
  }


  return new Promise((resolve, reject) => {
    utterance.onend = () => {
      resolve();
    };
    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      // toast({ title: "TTS Error", description: `Could not speak: ${event.error}`, variant: "destructive" });
      reject(event.error);
    };
    
    // Ensure voices are loaded before speaking, especially if a specific voice might be set.
    // This handles cases where getVoices() might be asynchronous initially.
    const trySpeak = () => {
        if (options?.voiceURI && !utterance.voice) { // If a voice was requested but not set yet
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(voice => voice.voiceURI === options.voiceURI);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                if (selectedVoice.lang) utterance.lang = selectedVoice.lang;
            }
        }
        window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
            trySpeak();
            window.speechSynthesis.onvoiceschanged = null; // Remove listener after voices are loaded
        };
    } else {
        trySpeak();
    }
  });
}

/**
 * Cancels any ongoing speech.
 */
export function cancelSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Pauses any ongoing speech.
 */
export function pauseSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
}

/**
 * Resumes any paused speech.
 */
export function resumeSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.resume();
  }
}

/**
 * Checks if speech synthesis is currently speaking.
 * @returns true if speaking, false otherwise.
 */
export function isSpeaking(): boolean {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

/**
 * Checks if speech synthesis is currently paused.
 * @returns true if paused, false otherwise.
 */
export function isPaused(): boolean {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        return window.speechSynthesis.paused;
    }
    return false;
}

let voiceList: SpeechSynthesisVoice[] = [];
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

/**
 * Gets a list of available speech synthesis voices.
 * It caches the voices after the first call.
 * @returns A promise that resolves with an array of SpeechSynthesisVoice objects.
 */
export function getVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve([]);
  }

  if (voiceList.length > 0) {
    return Promise.resolve(voiceList);
  }

  if (voicesPromise) {
    return voicesPromise;
  }

  voicesPromise = new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      voiceList = voices;
      resolve(voiceList);
      voicesPromise = null; // Reset promise once resolved
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      voiceList = window.speechSynthesis.getVoices();
      resolve(voiceList);
      voicesPromise = null; // Reset promise once resolved
      // It's good practice to remove the event listener after it has served its purpose
      // to prevent potential multiple triggers if voices change again.
      window.speechSynthesis.onvoiceschanged = null;
    };
  });
  return voicesPromise;
}
