export const A4 = 440;
export const A4_INDEX = 69; 
const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function freqToNote(freq) {
  if (!freq || freq <= 0) return null;
  const halfStepsBelowA4 = Math.round(12 * Math.log2(freq / A4));
  const midiNote = A4_INDEX + halfStepsBelowA4;
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = NOTE_STRINGS[midiNote % 12];
  
  const expectedFreq = A4 * Math.pow(2, halfStepsBelowA4 / 12);
  const cents = Math.round(1200 * Math.log2(freq / expectedFreq));
  
  return {
    midi: midiNote,
    name: `${noteName}${octave}`,
    cents: cents,
    freq: freq
  };
}

export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.pitchDetector = null;
    this.audioData = null;
    this.isRecording = false;
  }

  async start(onPitch) {
    if (this.isRecording) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass();
    this.analyser = this.audioContext.createAnalyser();
    // 2048 is a good size for capturing down to lower frequencies (roughly 20Hz at 44.1kHz rate)
    this.analyser.fftSize = 2048; 
    
    this.audioData = new Float32Array(this.analyser.fftSize);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
      this.isRecording = true;
      await this.audioContext.resume();

      // Dynamically load to avoid SSR errors.
      const Pitchfinder = await import('pitchfinder');
      // YIN algorithm is usually better for voice than AMDF
      this.pitchDetector = Pitchfinder.YIN({ sampleRate: this.audioContext.sampleRate });

      this.loop(onPitch);
    } catch (err) {
      console.error("Microphone access error:", err);
      throw err;
    }
  }

  loop(onPitchCallback) {
    if (!this.isRecording) return;
    
    this.analyser.getFloatTimeDomainData(this.audioData);
    
    // Measure pitch
    const pitch = this.pitchDetector(this.audioData);
    const noteInfo = freqToNote(pitch);
    
    onPitchCallback(noteInfo);

    requestAnimationFrame(() => this.loop(onPitchCallback));
  }

  stop() {
    this.isRecording = false;
    if (this.microphone && this.microphone.mediaStream) {
      this.microphone.mediaStream.getTracks().forEach(track => track.stop());
      this.microphone.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.microphone = null;
    this.analyser = null;
    this.audioContext = null;
  }
}
