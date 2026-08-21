import React, { useState } from 'react';
import { Users, Plus, PhoneCall, Trash2 } from 'lucide-react';

export default function Contacts({ onCallContact }) {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Support Hotline', phone: '+1 (800) 555-0199', tag: 'Service' },
    { id: 2, name: 'Main Office', phone: '+1 (555) 234-5678', tag: 'HQ' },
    { id: 3, name: 'Tech Lead', phone: '+1 (555) 987-6543', tag: 'Direct' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', tag: 'General' });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;

    setContacts([
      ...contacts,
      { id: Date.now(), ...newContact }
    ]);
    setNewContact({ name: '', phone: '', tag: 'General' });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="glass-panel" style={{
      padding: '2rem',
      border: '1px solid var(--border-medium)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Users size={20} />
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>SPEED DIAL CONTACTS</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
        >
          <Plus size={14} />
          <span>ADD CONTACT</span>
        </button>
      </div>

      {/* Add Contact Modal / Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} style={{
          background: 'var(--bg-card)',
          padding: '1.2rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem'
        }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem' }}>NEW SPEED DIAL ENTRY</h4>
          <input
            type="text"
            placeholder="Contact Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-element)',
              border: '1px solid var(--border-light)',
              color: '#fff',
              outline: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Phone Number (+1...)"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            className="mono"
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-element)',
              border: '1px solid var(--border-light)',
              color: '#fff',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="btn"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      {/* Contact Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {contacts.map((contact) => (
          <div
            key={contact.id}
            style={{
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{contact.name}</div>
              <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {contact.phone}
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-element)',
                color: 'var(--text-muted)',
                display: 'inline-block',
                marginTop: '6px'
              }}>
                {contact.tag}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => onCallContact(contact.phone)}
                className="btn btn-primary"
                style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                title="Dial number directly"
              >
                <PhoneCall size={15} />
                <span>CALL</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(contact.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.4rem'
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
