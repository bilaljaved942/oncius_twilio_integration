import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import Auth from './components/Auth.jsx';
import Dialer from './components/Dialer.jsx';
import ActiveCall from './components/ActiveCall.jsx';
import CallLogs from './components/CallLogs.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import { Phone, Clock } from 'lucide-react';
import { voiceService } from './services/voice.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dialer'); // 'dialer' | 'logs' | 'admin'
  const [theme, setTheme] = useState('dark');

  // Call States
  const [activeCallTarget, setActiveCallTarget] = useState(null);
  const [activeLogId, setActiveLogId] = useState(null);
  const [callStatus, setCallStatus] = useState('Dialing...');
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [callLogs, setCallLogs] = useState([]);

  const timerRef = useRef(null);
  const callSecondsRef = useRef(0);
  const activeLogIdRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedUser = localStorage.getItem('monochrome_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        if (u.role === 'admin') {
          setActiveTab('admin');
        }
      } catch (e) {
        localStorage.removeItem('monochrome_user');
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setActiveTab('admin');
      } else {
        fetchCallHistory();
        // Setup Twilio Voice WebRTC Device
        voiceService.setupDevice(user.email).catch((err) => {
          console.warn('Voice device setup notice:', err.message);
        });
      }
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const fetchCallHistory = async () => {
    if (!user || user.role === 'admin') return;
    try {
      const res = await fetch(`/api/twilio/history?email=${encodeURIComponent(user.email)}&role=${user.role}`);
      const data = await res.json();
      if (Array.isArray(data)) setCallLogs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    voiceService.hangup();
    localStorage.removeItem('monochrome_jwt');
    localStorage.removeItem('monochrome_user');
    setUser(null);
    setActiveTab('dialer');
  };

  const stopCallTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatDuration = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async (durationStr) => {
    voiceService.hangup();
    stopCallTimer();

    const logId = activeLogIdRef.current || activeLogId;
    const finalDuration = durationStr || formatDuration(callSecondsRef.current);

    if (logId) {
      try {
        await fetch('/api/twilio/call-end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logId, duration: finalDuration })
        });
        fetchCallHistory();
      } catch (e) {
        console.error(e);
      }
    }

    setActiveCallTarget(null);
    setActiveLogId(null);
    activeLogIdRef.current = null;
    setCallSeconds(0);
    callSecondsRef.current = 0;
    setIsMuted(false);
  };

  const handleInitiateCall = async (targetNumber) => {
    try {
      setCallStatus('Connecting call...');
      setCallSeconds(0);
      callSecondsRef.current = 0;
      setIsMuted(false);
      setActiveCallTarget(targetNumber);

      // Create Call Log in Backend
      try {
        const logRes = await fetch('/api/twilio/log-call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetNumber,
            userEmail: user?.email,
            userName: user?.name
          })
        });
        const logData = await logRes.json();
        if (logData.log) {
          setActiveLogId(logData.log.id);
          activeLogIdRef.current = logData.log.id;
          fetchCallHistory();
        }
      } catch (logErr) {
        console.warn('Log error:', logErr);
      }

      // Connect 2-Way Audio via Single WebRTC Stream
      await voiceService.makeCall(targetNumber, {
        onRinging: () => {
          setCallStatus('Ringing target phone...');
        },
        onAccept: () => {
          setCallStatus('Connected (Live 2-Way Audio)');
          stopCallTimer();
          timerRef.current = setInterval(() => {
            setCallSeconds((prev) => {
              const next = prev + 1;
              callSecondsRef.current = next;
              return next;
            });
          }, 1000);
        },
        onDisconnect: () => {
          handleEndCall(formatDuration(callSecondsRef.current));
        },
        onError: (err) => {
          alert(`Call Notice: ${err.message || 'Call ended.'}`);
          handleEndCall(formatDuration(callSecondsRef.current));
        },
        onMute: (muted) => {
          setIsMuted(muted);
        }
      });
    } catch (e) {
      alert(`Call Error: ${e.message}`);
      setActiveCallTarget(null);
    }
  };

  const handleToggleMute = () => {
    const muted = voiceService.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main style={{ flex: 1, padding: '1.5rem 1rem', maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
        {!user ? (
          <Auth onLoginSuccess={(u) => {
            setUser(u);
            if (u.role === 'admin') setActiveTab('admin');
          }} />
        ) : (
          <div>
            {/* Standard User Tabs (Hidden for Admin) */}
            {user.role !== 'admin' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                marginBottom: '1.8rem'
              }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('dialer')}
                  className="btn"
                  style={{
                    background: activeTab === 'dialer' ? 'var(--btn-bg)' : 'var(--bg-element)',
                    color: activeTab === 'dialer' ? 'var(--btn-text)' : 'var(--text-secondary)',
                    padding: '0.5rem 1.1rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <Phone size={14} />
                  <span>KEYPAD DIALER</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('logs')}
                  className="btn"
                  style={{
                    background: activeTab === 'logs' ? 'var(--btn-bg)' : 'var(--bg-element)',
                    color: activeTab === 'logs' ? 'var(--btn-text)' : 'var(--text-secondary)',
                    padding: '0.5rem 1.1rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <Clock size={14} />
                  <span>CALL HISTORY ({callLogs.length})</span>
                </button>
              </div>
            )}

            {/* Admin View */}
            {user.role === 'admin' ? (
              <AdminDashboard user={user} />
            ) : (
              /* User Views */
              <>
                {activeTab === 'dialer' && (
                  <Dialer onInitiateCall={handleInitiateCall} user={user} />
                )}

                {activeTab === 'logs' && (
                  <CallLogs
                    logs={callLogs}
                    onRedial={(num) => {
                      setActiveTab('dialer');
                      handleInitiateCall(num);
                    }}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Active Call Overlay Screen */}
      {activeCallTarget && (
        <ActiveCall
          targetNumber={activeCallTarget}
          callStatus={callStatus}
          callSeconds={callSeconds}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  );
}
