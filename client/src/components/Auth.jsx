import React, { useState } from 'react';
import { Phone, Lock, Mail, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('monochrome_jwt', data.token);
      localStorage.setItem('monochrome_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem 1rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '380px',
        padding: '2rem 1.6rem',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--btn-bg)',
            color: 'var(--btn-text)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <Phone size={20} strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            {isLogin
              ? 'Enter your account credentials'
              : 'Sign up to start dialing numbers instantly'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--bg-element)',
          padding: '3px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.2rem',
          border: '1px solid var(--border-light)'
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              padding: '0.45rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: isLogin ? 'var(--btn-bg)' : 'transparent',
              color: isLogin ? 'var(--btn-text)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              padding: '0.45rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: !isLogin ? 'var(--btn-bg)' : 'transparent',
              color: !isLogin ? 'var(--btn-text)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            REGISTER
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '0.5rem 0.7rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 51, 51, 0.1)',
            border: '1px solid rgba(255, 51, 51, 0.3)',
            color: 'var(--accent-red)',
            fontSize: '0.75rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.2rem', color: 'var(--text-secondary)' }}>
                FULL NAME
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.55rem 0.55rem 2.2rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-element)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.2rem', color: 'var(--text-secondary)' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="email"
                required
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.55rem 0.55rem 2.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-element)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.2rem', color: 'var(--text-secondary)' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.55rem 2.2rem 0.55rem 2.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-element)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              marginTop: '0.3rem',
              padding: '0.7rem',
              width: '100%'
            }}
          >
            {loading ? (
              <span>PROCESSING...</span>
            ) : (
              <>
                <span>{isLogin ? 'SIGN IN NOW' : 'REGISTER & DIAL'}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
