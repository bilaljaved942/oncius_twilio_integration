import React, { useState } from 'react';
import { Phone, Delete, UserCheck } from 'lucide-react';

const ALL_COUNTRIES = [
  { code: '+1', flag: '🇺🇸', name: 'United States (+1)' },
  { code: '+1', flag: '🇨🇦', name: 'Canada (+1)' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom (+44)' },
  { code: '+91', flag: '🇮🇳', name: 'India (+91)' },
  { code: '+61', flag: '🇦🇺', name: 'Australia (+61)' },
  { code: '+49', flag: '🇩🇪', name: 'Germany (+49)' },
  { code: '+33', flag: '🇫🇷', name: 'France (+33)' },
  { code: '+81', flag: '🇯🇵', name: 'Japan (+81)' },
  { code: '+86', flag: '🇨🇳', name: 'China (+86)' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil (+55)' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico (+52)' },
  { code: '+39', flag: '🇮🇹', name: 'Italy (+39)' },
  { code: '+34', flag: '🇪🇸', name: 'Spain (+34)' },
  { code: '+7', flag: '🇷🇺', name: 'Russia (+7)' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea (+82)' },
  { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates (+971)' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia (+966)' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan (+92)' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh (+880)' },
  { code: '+62', flag: '🇮🇩', name: 'Indonesia (+62)' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines (+63)' },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam (+84)' },
  { code: '+66', flag: '🇹🇭', name: 'Thailand (+66)' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia (+60)' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore (+65)' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa (+27)' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria (+234)' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt (+20)' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey (+90)' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands (+31)' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland (+41)' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden (+46)' },
  { code: '+47', flag: '🇳🇴', name: 'Norway (+47)' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark (+45)' },
  { code: '+358', flag: '🇫🇮', name: 'Finland (+358)' },
  { code: '+48', flag: '🇵🇱', name: 'Poland (+48)' },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine (+380)' },
  { code: '+30', flag: '🇬🇷', name: 'Greece (+30)' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal (+351)' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland (+353)' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand (+64)' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina (+54)' },
  { code: '+56', flag: '🇨🇱', name: 'Chile (+56)' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia (+57)' },
  { code: '+51', flag: '🇵🇪', name: 'Peru (+51)' },
  { code: '+972', flag: '🇮🇱', name: 'Israel (+972)' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar (+974)' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait (+965)' },
  { code: '+968', flag: '🇴🇲', name: 'Oman (+968)' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain (+973)' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan (+962)' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon (+961)' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco (+212)' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria (+213)' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia (+216)' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya (+254)' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana (+233)' },
  { code: '+251', flag: '🇪🇹', name: 'Ethiopia (+251)' },
  { code: '+255', flag: '🇹ℤ', name: 'Tanzania (+255)' },
  { code: '+256', flag: '🇺🇬', name: 'Uganda (+256)' },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka (+94)' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal (+977)' },
  { code: '+95', flag: '🇲🇲', name: 'Myanmar (+95)' },
  { code: '+855', flag: '🇰🇭', name: 'Cambodia (+855)' }
];

export default function Dialer({ onInitiateCall, user }) {
  const [dialedNumber, setDialedNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('+1');

  const keys = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '*', sub: '' },
    { num: '0', sub: '+' },
    { num: '#', sub: '' }
  ];

  const playDtmfTone = (key) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const freqs = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
      };
      if (!freqs[key]) return;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.frequency.value = freqs[key][0];
      osc2.frequency.value = freqs[key][1];
      gain.gain.value = 0.08;
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      setTimeout(() => { osc1.stop(); osc2.stop(); ctx.close(); }, 100);
    } catch (e) {}
  };

  const handleKeyPress = (num) => {
    playDtmfTone(num);
    setDialedNumber((prev) => prev + num);
  };

  const handleBackspace = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleCallClick = () => {
    if (!dialedNumber.trim()) return;

    let cleaned = dialedNumber.trim().replace(/[\s\-\(\)]/g, '');

    // If user didn't type a '+', prepend selected country code and strip redundant local leading '0'
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('0') && cleaned.length > 1) {
        cleaned = cleaned.substring(1);
      }
      cleaned = selectedCountry + ' ' + cleaned;
    }

    onInitiateCall(cleaned);
  };

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem 1.2rem',
      maxWidth: '360px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Header Info */}
      <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-element)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          marginBottom: '0.5rem',
          maxWidth: '100%'
        }}>
          <UserCheck size={13} flexShrink={0} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Caller: <strong style={{ color: 'var(--text-primary)' }}>{user?.name || 'Web User'}</strong>
          </span>
        </div>

        <h2 style={{ fontSize: '1.15rem', margin: 0 }}>DIRECT DIALER</h2>
      </div>

      {/* Country Code & Number Input Box */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'var(--bg-element)',
        padding: '0.5rem 0.7rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        marginBottom: '1.2rem',
        width: '100%'
      }}>
        {/* Full Country Select Dropdown */}
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="mono"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            outline: 'none',
            maxWidth: '85px',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          {ALL_COUNTRIES.map((c, i) => (
            <option key={i} value={c.code} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>

        {/* Input */}
        <input
          type="text"
          value={dialedNumber}
          onChange={(e) => setDialedNumber(e.target.value)}
          placeholder="555 0199"
          className="mono"
          style={{
            width: '100%',
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            fontWeight: 700,
            outline: 'none',
            letterSpacing: '0.04em'
          }}
        />

        {dialedNumber && (
          <button
            type="button"
            onClick={handleBackspace}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.2rem',
              flexShrink: 0
            }}
          >
            <Delete size={18} />
          </button>
        )}
      </div>

      {/* Keypad Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.7rem',
        justifyItems: 'center',
        marginBottom: '1.4rem'
      }}>
        {keys.map((k) => (
          <button
            key={k.num}
            type="button"
            className="keypad-btn"
            onClick={() => handleKeyPress(k.num)}
          >
            <span className="keypad-num">{k.num}</span>
            {k.sub && <span className="keypad-sub">{k.sub}</span>}
          </button>
        ))}
      </div>

      {/* Call Button */}
      <button
        type="button"
        onClick={handleCallClick}
        disabled={!dialedNumber.trim()}
        className="btn-call"
        style={{
          opacity: dialedNumber.trim() ? 1 : 0.4,
          cursor: dialedNumber.trim() ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        <Phone size={18} fill="currentColor" />
        <span>CALL DIRECT NOW</span>
      </button>
    </div>
  );
}
