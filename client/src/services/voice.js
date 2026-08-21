import { Device } from '@twilio/voice-sdk';

class VoiceService {
  constructor() {
    this.device = null;
    this.activeCall = null;
    this.token = null;
  }

  async setupDevice(identity = 'user_web') {
    try {
      const res = await fetch(`/api/twilio/token?identity=${encodeURIComponent(identity)}`);
      const data = await res.json();

      if (!res.ok || !data.token) {
        throw new Error(data.error || 'Failed to fetch Twilio voice token');
      }

      this.token = data.token;

      // If simulated mode (no Twilio keys), device setup is skipped
      if (data.simulated) {
        console.log('⚡ Voice Service running in simulated mode');
        return { simulated: true };
      }

      if (this.device) {
        this.device.destroy();
      }

      this.device = new Device(this.token, {
        codecPreferences: ['opus', 'pcmu'],
        enableRingingState: true,
        logLevel: 1
      });

      await this.device.register();
      console.log('🎙️ Twilio WebRTC Voice Device Registered successfully');
      return { simulated: false };
    } catch (err) {
      console.error('Voice Service setup error:', err);
      throw err;
    }
  }

  async makeCall(targetNumber, callbacks = {}) {
    if (!this.device) {
      const setup = await this.setupDevice();
      if (setup.simulated) {
        // Simulated calling
        setTimeout(() => callbacks.onRinging?.(), 1000);
        setTimeout(() => callbacks.onAccept?.(), 2500);
        return {
          disconnect: () => callbacks.onDisconnect?.(),
          mute: (m) => callbacks.onMute?.(m)
        };
      }
    }

    try {
      console.log(`📞 Connecting WebRTC Call to: ${targetNumber}`);
      const call = await this.device.connect({
        params: {
          To: targetNumber
        }
      });

      this.activeCall = call;

      call.on('ringing', (hasEarlyMedia) => {
        console.log('🔔 Call is ringing...');
        callbacks.onRinging?.(hasEarlyMedia);
      });

      call.on('accept', () => {
        console.log('✅ Call accepted & connected (2-way audio active)!');
        callbacks.onAccept?.();
      });

      call.on('disconnect', () => {
        console.log('📴 Call disconnected');
        this.activeCall = null;
        callbacks.onDisconnect?.();
      });

      call.on('error', (err) => {
        console.error('❌ Call error:', err);
        this.activeCall = null;
        callbacks.onError?.(err);
      });

      call.on('mute', (isMuted) => {
        callbacks.onMute?.(isMuted);
      });

      return call;
    } catch (err) {
      console.error('Error establishing WebRTC call:', err);
      throw err;
    }
  }

  hangup() {
    if (this.activeCall) {
      this.activeCall.disconnect();
      this.activeCall = null;
    } else if (this.device) {
      this.device.disconnectAll();
    }
  }

  toggleMute() {
    if (this.activeCall) {
      const isMuted = this.activeCall.isMuted();
      this.activeCall.mute(!isMuted);
      return !isMuted;
    }
    return false;
  }
}

export const voiceService = new VoiceService();
