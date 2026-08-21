import React, { useState, useEffect } from 'react';
import { Users, PhoneOutgoing, Key, Trash2, Shield, Save, Clock, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [activeAdminTab, setActiveAdminTab] = useState('users'); // 'users' | 'calls' | 'settings'
  const [usersList, setUsersList] = useState([]);
  const [allCalls, setAllCalls] = useState([]);

  const [settingsForm, setSettingsForm] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
    twimlAppSid: ''
  });
  const [settingsMessage, setSettingsMessage] = useState('');

  const getAuthToken = () => localStorage.getItem('monochrome_jwt');

  useEffect(() => {
    fetchUsers();
    fetchAllCalls();
    fetchTwilioSettings();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/users', {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setUsersList(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAllCalls = async () => {
    try {
      const res = await fetch('/api/twilio/history?role=admin');
      const data = await res.json();
      if (Array.isArray(data)) setAllCalls(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTwilioSettings = async () => {
    try {
      const res = await fetch('/api/twilio/settings');
      const data = await res.json();
      if (data) {
        setSettingsForm((prev) => ({
          ...prev,
          phoneNumber: data.phoneNumber !== 'Not Set' ? data.phoneNumber : ''
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user account "${userName}"?`)) return;

    try {
      const res = await fetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        fetchUsers();
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (e) {
      alert('Error deleting user');
    }
  };

  const handleDeleteCall = async (callId) => {
    try {
      const res = await fetch(`/api/twilio/history/${callId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      if (res.ok) {
        fetchAllCalls();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsMessage('');

    try {
      const res = await fetch('/api/twilio/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (res.ok) {
        setSettingsMessage('Twilio API credentials updated successfully!');
        fetchTwilioSettings();
        setTimeout(() => setSettingsMessage(''), 3000);
      } else {
        setSettingsMessage(data.error || 'Failed to update credentials.');
      }
    } catch (e) {
      setSettingsMessage('Server error updating settings.');
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
      {/* Admin Panel Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem',
        marginBottom: '1.8rem',
        paddingBottom: '1.2rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Shield size={22} color="var(--accent-green)" />
          <div>
            <h2 style={{ fontSize: '1.35rem', margin: 0, lineHeight: 1.1 }}>ADMIN CONTROL PANEL</h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Manage System Accounts, User Direct Call Logs & Twilio Credentials
            </span>
          </div>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {user?.email}
        </span>
      </div>

      {/* Subtabs Bar */}
      <div className="admin-subtabs" style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.8rem' }}>
        <button
          type="button"
          onClick={() => setActiveAdminTab('users')}
          className="btn"
          style={{
            background: activeAdminTab === 'users' ? 'var(--btn-bg)' : 'var(--bg-element)',
            color: activeAdminTab === 'users' ? 'var(--btn-text)' : 'var(--text-primary)',
            fontSize: '0.82rem',
            padding: '0.6rem 1.2rem'
          }}
        >
          <Users size={15} />
          <span>Registered Users ({usersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('calls')}
          className="btn"
          style={{
            background: activeAdminTab === 'calls' ? 'var(--btn-bg)' : 'var(--bg-element)',
            color: activeAdminTab === 'calls' ? 'var(--btn-text)' : 'var(--text-primary)',
            fontSize: '0.82rem',
            padding: '0.6rem 1.2rem'
          }}
        >
          <PhoneOutgoing size={15} />
          <span>Call Logs ({allCalls.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('settings')}
          className="btn"
          style={{
            background: activeAdminTab === 'settings' ? 'var(--btn-bg)' : 'var(--bg-element)',
            color: activeAdminTab === 'settings' ? 'var(--btn-text)' : 'var(--text-primary)',
            fontSize: '0.82rem',
            padding: '0.6rem 1.2rem'
          }}
        >
          <Key size={15} />
          <span>Twilio Credentials</span>
        </button>
      </div>

      {/* Tab 1: User Accounts Management */}
      {activeAdminTab === 'users' && (
        <div className="glass-panel" style={{ padding: '2.2rem 2.4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '0.8rem',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>REGISTERED USER ACCOUNTS</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }} className="mono">
              TOTAL: {usersList.length} ACCOUNTS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {usersList.map((u) => (
              <div
                key={u.id}
                className="admin-user-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.1rem 1.4rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-element)',
                  border: '1px solid var(--border-light)',
                  width: '100%',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span>{u.name}</span>
                    {u.role === 'admin' ? (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, background: 'var(--accent-green)', color: '#000', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>ADMIN</span>
                    ) : (
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>USER</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '4px' }}>
                    <span style={{ wordBreak: 'break-all' }}>{u.email}</span>
                    <span>•</span>
                    <span className="mono" style={{ color: 'var(--text-muted)' }}>Registered: {new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {u.role !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    className="btn btn-end"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem', flexShrink: 0 }}
                  >
                    <Trash2 size={14} />
                    <span>Delete User</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: System Call Logs */}
      {activeAdminTab === 'calls' && (
        <div className="glass-panel" style={{ padding: '2.2rem 2.4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '0.8rem',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>ALL SYSTEM USER CALL DETAILS</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }} className="mono">
              TOTAL: {allCalls.length} CALLS
            </span>
          </div>

          {allCalls.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
              <PhoneOutgoing size={36} style={{ opacity: 0.25, marginBottom: '0.8rem' }} />
              <p style={{ fontSize: '0.9rem', margin: 0 }}>No calls logged yet in the system.</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                When registered users dial numbers on the website dialer, their call logs will appear here live.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {allCalls.map((log) => (
                <div
                  key={log.id}
                  className="admin-user-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.1rem 1.4rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-element)',
                    border: '1px solid var(--border-light)',
                    width: '100%'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, wordBreak: 'break-all' }}>
                      Caller: <strong style={{ color: 'var(--text-primary)' }}>{log.userName || log.userEmail}</strong>
                    </div>
                    <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, marginTop: '3px' }}>
                      Target Dialed: {log.targetNumber}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.6rem', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span className="mono">Duration: {log.duration || '00:00'}</span>
                      <span>•</span>
                      <span>Mode: {log.mode || 'Direct'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCall(log.id)}
                    style={{
                      background: 'rgba(255, 51, 51, 0.1)',
                      border: '1px solid rgba(255, 51, 51, 0.3)',
                      color: 'var(--accent-red)',
                      cursor: 'pointer',
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.78rem',
                      flexShrink: 0
                    }}
                    title="Delete call log record"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Twilio Credentials Form */}
      {activeAdminTab === 'settings' && (
        <div className="glass-panel" style={{ padding: '2.2rem 2.4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '0.8rem',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>UPDATE TWILIO API CREDENTIALS</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Master Configuration
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Configure your master Twilio credentials to route direct 1-on-1 calls to actual phone numbers worldwide.
          </p>

          {settingsMessage && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 230, 118, 0.1)',
              border: '1px solid rgba(0, 230, 118, 0.3)',
              color: 'var(--accent-green)',
              fontSize: '0.82rem',
              marginBottom: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} />
              <span>{settingsMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                TWILIO ACCOUNT SID
              </label>
              <input
                type="text"
                placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                value={settingsForm.accountSid}
                onChange={(e) => setSettingsForm({ ...settingsForm, accountSid: e.target.value })}
                className="mono"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-element)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                TWILIO AUTH TOKEN
              </label>
              <input
                type="password"
                placeholder="Your Twilio Auth Token"
                value={settingsForm.authToken}
                onChange={(e) => setSettingsForm({ ...settingsForm, authToken: e.target.value })}
                className="mono"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-element)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                TWILIO PURCHASED PHONE NUMBER
              </label>
              <input
                type="text"
                placeholder="+18885550199"
                value={settingsForm.phoneNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, phoneNumber: e.target.value })}
                className="mono"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-element)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                TWIML APP SID (Optional for WebRTC)
              </label>
              <input
                type="text"
                placeholder="APXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                value={settingsForm.twimlAppSid}
                onChange={(e) => setSettingsForm({ ...settingsForm, twimlAppSid: e.target.value })}
                className="mono"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-element)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '0.6rem', padding: '0.85rem' }}
            >
              <Save size={16} />
              <span>SAVE CREDENTIALS</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
