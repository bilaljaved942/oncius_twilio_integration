import React from 'react';
import { Phone, LogOut, Sun, Moon } from 'lucide-react';

export default function Navbar({ user, onLogout, theme, onToggleTheme }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-light)',
      background: 'var(--bg-card)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.6rem 1.5rem',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--btn-bg)',
            color: 'var(--btn-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Phone size={14} strokeWidth={2.5} />
          </div>
          <span style={{
            fontSize: '0.95rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            letterSpacing: '0.08em'
          }}>
            MONOCHROME
          </span>
        </div>

        {/* User Info & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-element)',
              border: '1px solid var(--border-light)'
            }}>
              {user.role === 'admin' ? (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-green)',
                  color: '#000'
                }}>
                  ADMIN PANEL
                </span>
              ) : (
                <span style={{ fontWeight: 600 }}>{user.name}</span>
              )}
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="btn"
            style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span style={{ fontSize: '0.7rem' }}>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
          </button>

          {/* Logout Exit Button */}
          {user && (
            <button
              type="button"
              onClick={onLogout}
              className="btn"
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
            >
              <LogOut size={13} />
              <span>Exit</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
