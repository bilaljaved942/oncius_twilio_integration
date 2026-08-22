import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Cloud Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (supabase) {
  console.log('⚡ Connected to Supabase Cloud Database!');
} else {
  console.log('📁 Using local JSON file store (db.json)');
}

// Local File Store Fallback
const SEED_FILE = path.join(__dirname, 'db.json');
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, 'db.json');

function hashPassword(plainText) {
  return bcrypt.hashSync(plainText, 10);
}

const initialData = {
  users: [
    {
      id: 'user_admin_root',
      name: 'System Admin',
      email: 'admin@example.com',
      phone: '',
      password: hashPassword('pakistan123'),
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  ],
  callLogs: [],
  twilioConfig: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    twimlAppSid: process.env.TWILIO_TWIML_APP_SID || '',
    apiKey: process.env.TWILIO_API_KEY || '',
    apiSecret: process.env.TWILIO_API_SECRET || ''
  }
};

let memoryDB = null;

export function readDB() {
  try {
    if (process.env.VERCEL && memoryDB) return memoryDB;

    if (!fs.existsSync(DB_FILE)) {
      if (fs.existsSync(SEED_FILE)) {
        try {
          const seedContent = fs.readFileSync(SEED_FILE, 'utf-8');
          const parsed = JSON.parse(seedContent);
          writeDB(parsed);
          memoryDB = parsed;
          return parsed;
        } catch (e) {}
      }
      writeDB(initialData);
      memoryDB = initialData;
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    memoryDB = parsed;
    return parsed;
  } catch (err) {
    if (!memoryDB) memoryDB = initialData;
    return memoryDB;
  }
}

export function writeDB(data) {
  try {
    memoryDB = data;
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    memoryDB = data;
  }
}

// ── USERS ──────────────────────────────────────────────────────────────────

export async function getUsers() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || '',
          password: u.password,
          role: u.role || 'user',
          createdAt: u.created_at
        }));
      }
    } catch (e) {
      console.error('Supabase getUsers error:', e);
    }
  }
  const db = readDB();
  return db.users || [];
}

export async function saveUser(user) {
  if (supabase) {
    try {
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: user.password,
        role: user.role || 'user',
        created_at: user.createdAt || new Date().toISOString()
      });
      if (error) console.error('Supabase saveUser error:', error);
      return;
    } catch (e) {
      console.error('Supabase saveUser error:', e);
    }
  }
  const db = readDB();
  if (!db.users) db.users = [];
  db.users.push(user);
  writeDB(db);
}

export async function deleteUserById(userId) {
  if (supabase) {
    try {
      await supabase.from('users').delete().eq('id', userId);
      return;
    } catch (e) {
      console.error('Supabase deleteUser error:', e);
    }
  }
  const db = readDB();
  db.users = (db.users || []).filter((u) => u.id !== userId);
  writeDB(db);
}

// ── CALL LOGS ──────────────────────────────────────────────────────────────

export async function getCallLogs() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('call_logs').select('*').order('timestamp', { ascending: false });
      if (!error && data) {
        return data.map((l) => ({
          id: l.id,
          userEmail: l.user_email,
          userName: l.user_name,
          targetNumber: l.target_number,
          userNumber: l.user_number,
          status: l.status,
          duration: l.duration,
          timestamp: l.timestamp,
          mode: l.mode,
          callSid: l.call_sid
        }));
      }
    } catch (e) {
      console.error('Supabase getCallLogs error:', e);
    }
  }
  const db = readDB();
  return db.callLogs || [];
}

export async function saveCallLog(log) {
  if (supabase) {
    try {
      const { error } = await supabase.from('call_logs').insert({
        id: log.id,
        user_email: log.userEmail,
        user_name: log.userName,
        target_number: log.targetNumber,
        user_number: log.userNumber,
        status: log.status,
        duration: log.duration,
        timestamp: log.timestamp || new Date().toISOString(),
        mode: log.mode || 'WebRTC Direct Audio',
        call_sid: log.callSid || ''
      });
      if (error) console.error('Supabase saveCallLog error:', error);
      return;
    } catch (e) {
      console.error('Supabase saveCallLog error:', e);
    }
  }
  const db = readDB();
  if (!db.callLogs) db.callLogs = [];
  db.callLogs.unshift(log);
  writeDB(db);
}

export async function updateCallLog(logId, updates) {
  if (supabase) {
    try {
      const updateData = {};
      if (updates.status) updateData.status = updates.status;
      if (updates.duration) updateData.duration = updates.duration;
      if (updates.callSid) updateData.call_sid = updates.callSid;

      await supabase.from('call_logs').update(updateData).eq('id', logId);
    } catch (e) {
      console.error('Supabase updateCallLog error:', e);
    }
  }
  const db = readDB();
  const log = (db.callLogs || []).find((l) => l.id === logId);
  if (log) {
    Object.assign(log, updates);
    writeDB(db);
  }
  return log;
}

export async function deleteCallLogById(logId) {
  if (supabase) {
    try {
      await supabase.from('call_logs').delete().eq('id', logId);
      return;
    } catch (e) {
      console.error('Supabase deleteCallLog error:', e);
    }
  }
  const db = readDB();
  db.callLogs = (db.callLogs || []).filter((l) => l.id !== logId);
  writeDB(db);
}

// ── TWILIO CONFIG ──────────────────────────────────────────────────────────

export function getTwilioConfig() {
  const db = readDB();
  const fileConfig = db.twilioConfig || {};
  return {
    accountSid: fileConfig.accountSid || process.env.TWILIO_ACCOUNT_SID || '',
    authToken: fileConfig.authToken || process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: fileConfig.phoneNumber || process.env.TWILIO_PHONE_NUMBER || '',
    twimlAppSid: fileConfig.twimlAppSid || process.env.TWILIO_TWIML_APP_SID || '',
    apiKey: fileConfig.apiKey || process.env.TWILIO_API_KEY || '',
    apiSecret: fileConfig.apiSecret || process.env.TWILIO_API_SECRET || ''
  };
}

export function updateTwilioConfig(newConfig) {
  const db = readDB();
  db.twilioConfig = { ...db.twilioConfig, ...newConfig };
  writeDB(db);
  return db.twilioConfig;
}
