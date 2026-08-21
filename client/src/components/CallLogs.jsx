import React from 'react';
import { PhoneOutgoing, Clock, RotateCcw } from 'lucide-react';

export default function CallLogs({ logs, onRedial }) {
  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      maxWidth: '520px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.6rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={16} />
          <h3 style={{ fontSize: '1.05rem', margin: 0 }}>CALL HISTORY</h3>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="mono">
          {logs.length} LOGS
        </span>
      </div>

      {logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
          <PhoneOutgoing size={28} style={{ opacity: 0.3, marginBottom: '0.4rem' }} />
          <p style={{ fontSize: '0.82rem' }}>No recent call history yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-element)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PhoneOutgoing size={14} />
                </div>
                <div>
                  <div className="mono" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    {log.targetNumber}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', marginTop: '1px' }}>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="mono">{log.duration || '00:00'}</span>
                  </div>
                </div>
              </div>

              {/* Status Tag & Small Redial Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  background: log.status === 'Completed' ? 'rgba(0, 230, 118, 0.12)' : 'var(--bg-card)',
                  color: log.status === 'Completed' ? 'var(--accent-green)' : 'var(--text-muted)'
                }}>
                  {log.status.toUpperCase()}
                </span>

                <button
                  type="button"
                  onClick={() => onRedial(log.targetNumber)}
                  className="btn"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                >
                  <RotateCcw size={12} />
                  <span>REDIAL</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
