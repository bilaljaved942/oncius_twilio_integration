import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'db.json');

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

export function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDB(initialData);
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return initialData;
  }
}

export function writeDB(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

export function getUsers() {
  const db = readDB();
  return db.users || [];
}

export function saveUser(user) {
  const db = readDB();
  db.users.push(user);
  writeDB(db);
}

export function deleteUserById(userId) {
  const db = readDB();
  db.users = db.users.filter((u) => u.id !== userId);
  writeDB(db);
}

export function getCallLogs() {
  const db = readDB();
  return db.callLogs || [];
}

export function saveCallLog(log) {
  const db = readDB();
  if (!db.callLogs) db.callLogs = [];
  db.callLogs.unshift(log);
  writeDB(db);
}

export function updateCallLog(logId, updates) {
  const db = readDB();
  const log = db.callLogs.find((l) => l.id === logId);
  if (log) {
    Object.assign(log, updates);
    writeDB(db);
  }
  return log;
}

export function deleteCallLogById(logId) {
  const db = readDB();
  db.callLogs = db.callLogs.filter((l) => l.id !== logId);
  writeDB(db);
}

// Fallback to process.env if db.json field is empty
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
