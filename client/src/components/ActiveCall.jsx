import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Radio } from 'lucide-react';

export default function ActiveCall({ targetNumber, callStatus, callSeconds, isMuted, onToggleMute, onEndCall }) {
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Format seconds to MM:SS
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isConnected = callStatus.toLowerCase().includes('connected') || callStatus.toLowerCase().includes('live');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.92)',
      backdropFilter: 'blur(20px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '3rem 2rem',
        textAlign: 'center',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        {/* Animated Avatar / Ringing Pulse */}
        <div style={{
          position: 'relative',
          width: '110px',
          height: '110px',
          margin: '0 auto 2rem auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="calling-pulse" style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)'
          }} />
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: '#ffffff',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 700,
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
            position: 'relative',
            zIndex: 2
          }}>
            {targetNumber ? targetNumber.slice(-2) : '11'}
          </div>
        </div>

        {/* Target Number */}
        <h2 className="mono" style={{ fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
          {targetNumber}
        </h2>

        {/* Call Status Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: isConnected ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 255, 255, 0.1)',
          border: `1px solid ${isConnected ? 'rgba(0, 230, 118, 0.4)' : 'var(--border-light)'}`,
          marginBottom: '1.5rem'
        }}>
          <Radio size={14} color={isConnected ? 'var(--accent-green)' : '#ffffff'} />
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: isConnected ? 'var(--accent-green)' : '#ffffff'
          }}>
            {callStatus.toUpperCase()}
          </span>
        </div>

        {/* Live Call Duration */}
        <div className="mono" style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          marginBottom: '2rem',
          color: isConnected ? '#ffffff' : 'var(--text-muted)'
        }}>
          {formatTime(callSeconds)}
        </div>

        {/* Audio Waveform Bars (Active when connected) */}
        {isConnected && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            height: '35px',
            marginBottom: '2.5rem'
          }}>
            <div className="wave-bar" />
            <div className="wave-bar" />
            <div className="wave-bar" />
            <div className="wave-bar" />
            <div className="wave-bar" />
          </div>
        )}

        {/* Controls Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Mute Button */}
          <button
            type="button"
            onClick={onToggleMute}
            className="keypad-btn"
            style={{
              width: '60px',
              height: '60px',
              background: isMuted ? '#ffffff' : 'var(--bg-element)',
              color: isMuted ? '#000000' : '#ffffff'
            }}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          {/* Speaker Button */}
          <button
            type="button"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className="keypad-btn"
            style={{
              width: '60px',
              height: '60px',
              background: !isSpeakerOn ? 'var(--bg-element)' : 'rgba(255, 255, 255, 0.15)'
            }}
          >
            {isSpeakerOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
        </div>

        {/* End Call Button */}
        <button
          type="button"
          onClick={() => onEndCall(formatTime(callSeconds))}
          className="btn btn-end"
          style={{
            width: '100%',
            padding: '1.1rem',
            borderRadius: 'var(--radius-lg)',
            fontSize: '1.1rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem'
          }}
        >
          <PhoneOff size={24} />
          <span>DISCONNECT CALL</span>
        </button>
      </div>
    </div>
  );
}
