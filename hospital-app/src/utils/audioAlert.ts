class SirenAudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private sirenInterval: any = null;

  public playSiren() {
    if (this.isPlaying) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioCtx = new AudioCtx();
      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.setValueAtTime(800, this.audioCtx.currentTime);

      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.isPlaying = true;

      // Alternating ambulance / ER siren frequency pitch
      let highTone = false;
      this.sirenInterval = setInterval(() => {
        if (!this.audioCtx || !this.oscillator || !this.isPlaying) return;
        highTone = !highTone;
        const targetFreq = highTone ? 960 : 700;
        this.oscillator.frequency.exponentialRampToValueAtTime(
          targetFreq,
          this.audioCtx.currentTime + 0.15
        );
      }, 400);
    } catch (e) {
      console.warn('Audio Siren playback prevented by browser policy or missing context', e);
    }
  }

  public stopSiren() {
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }

    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {
        // ignore
      }
      this.oscillator = null;
    }

    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {
        // ignore
      }
      this.audioCtx = null;
    }

    this.isPlaying = false;
  }

  public isSirenActive(): boolean {
    return this.isPlaying;
  }
}

export const sirenSynthesizer = new SirenAudioSynthesizer();
