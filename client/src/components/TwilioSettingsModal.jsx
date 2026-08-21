import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Zap, Info, Check, Save } from 'lucide-react';

export default function TwilioSettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  const [formData, setFormData] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
    twimlAppSid: '',
    apiKey: '',
    apiSecret: ''
  });

  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/twilio/settings');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/twilio/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      setMessage('Twilio API credentials saved!');
      fetchSettings();
      if (onSettingsUpdated) onSettingsUpdated();
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      setMessage('Failed to update credentials.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '540px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2.5rem',
        border: '1px solid var(--border-medium)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Key size={22} />
            <h3 style={{ fontSize: '1.3rem', margin: 0 }}>TWILIO API SETTINGS</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Mode Status Banner */}
        <div style={{
          padding: '1rem 1.2rem',
          borderRadius: 'var(--radius-md)',
          background: status?.configured ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 255, 255, 0.04)',
          border: `1px solid ${status?.configured ? 'rgba(0, 230, 118, 0.3)' : 'var(--border-light)'}`,
          marginBottom: '1.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            {status?.configured ? (
              <>
                <ShieldCheck size={18} color="var(--accent-green)" />
                <span style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.9rem' }}>
                  LIVE TWILIO API ACTIVE
                </span>
              </>
            ) : (
              <>
                <Zap size={18} color="#aaa" />
                <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                  SIMULATOR MODE ACTIVE
                </span>
              </>
            )}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            {status?.configured
              ? `Account SID ${status.accountSidMasked} | Number ${status.phoneNumber}. Live calls dial out directly to real phone networks.`
              : 'No Twilio keys entered yet. You can test all dialer keypads, call timers, active call screens, and logs in Simulator Mode, or enter your credentials below.'}
          </p>
        </div>

        {message && (
          <div style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 230, 118, 0.1)',
            border: '1px solid rgba(0, 230, 118, 0.3)',
            color: 'var(--accent-green)',
            fontSize: '0.82rem',
            marginBottom: '1.2rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              TWILIO ACCOUNT SID
            </label>
            <input
              type="text"
              name="accountSid"
              placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              value={formData.accountSid}
              onChange={handleChange}
              className="mono"
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                color: '#fff',
                outline: 'none',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              TWILIO AUTH TOKEN
            </label>
            <input
              type="password"
              name="authToken"
              placeholder="Your Twilio Auth Token"
              value={formData.authToken}
              onChange={handleChange}
              className="mono"
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                color: '#fff',
                outline: 'none',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              TWILIO PURCHASED PHONE NUMBER
            </label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="+18885550199"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mono"
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                color: '#fff',
                outline: 'none',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              TWIML VOICE APP SID (Optional for WebRTC)
            </label>
            <input
              type="text"
              name="twimlAppSid"
              placeholder="APXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              value={formData.twimlAppSid}
              onChange={handleChange}
              className="mono"
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                color: '#fff',
                outline: 'none',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <Save size={16} />
              <span>{saving ? 'SAVING...' : 'SAVE SETTINGS'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
