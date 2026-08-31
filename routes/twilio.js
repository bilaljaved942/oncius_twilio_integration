import express from 'express';
import twilio from 'twilio';
import { requireAdmin } from './auth.js';
import {
  getCallLogs,
  saveCallLog,
  updateCallLog,
  deleteCallLogById,
  getTwilioConfig,
  updateTwilioConfig
} from '../data/db.js';

const router = express.Router();

function isTwilioConfigured() {
  const config = getTwilioConfig();
  return Boolean(
    config.accountSid &&
    config.accountSid.startsWith('AC') &&
    config.authToken
  );
}

// Public status check
router.get('/settings', (req, res) => {
  const config = getTwilioConfig();
  res.json({
    configured: isTwilioConfigured(),
    accountSidMasked: config.accountSid
      ? config.accountSid.slice(0, 6) + '...' + config.accountSid.slice(-4)
      : 'Not Set',
    phoneNumber: config.phoneNumber || 'Not Set',
    twimlAppSidSet: Boolean(config.twimlAppSid)
  });
});

// Update Twilio Settings (Admin Only)
router.post('/settings', requireAdmin, (req, res) => {
  const { accountSid, authToken, phoneNumber, twimlAppSid, apiKey, apiSecret } = req.body;

  const newConfig = {};
  if (accountSid !== undefined) newConfig.accountSid = accountSid.trim();
  if (authToken !== undefined) newConfig.authToken = authToken.trim();
  if (phoneNumber !== undefined) newConfig.phoneNumber = phoneNumber.trim();
  if (twimlAppSid !== undefined) newConfig.twimlAppSid = twimlAppSid.trim();
  if (apiKey !== undefined) newConfig.apiKey = apiKey.trim();
  if (apiSecret !== undefined) newConfig.apiSecret = apiSecret.trim();

  const updated = updateTwilioConfig(newConfig);

  res.json({
    message: 'Twilio API credentials updated successfully',
    configured: isTwilioConfigured(),
    config: updated
  });
});

// WebRTC Access Token (Generates Voice JWT for browser)
router.get('/token', (req, res) => {
  const identity = req.query.identity || 'user_' + Math.floor(Math.random() * 1000);
  const config = getTwilioConfig();

  if (!isTwilioConfigured()) {
    return res.json({
      token: 'SIMULATED_TWILIO_WEBRTC_TOKEN_' + Date.now(),
      identity,
      simulated: true
    });
  }

  try {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const key = config.apiKey || config.accountSid;
    const secret = config.apiSecret || config.authToken;

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: config.twimlAppSid || undefined,
      incomingAllow: true
    });

    const token = new AccessToken(
      config.accountSid,
      key,
      secret,
      { identity, ttl: 3600 }
    );

    token.addGrant(voiceGrant);

    res.json({
      token: token.toJwt(),
      identity,
      simulated: false
    });
  } catch (err) {
    console.error('Error generating Twilio AccessToken:', err);
    res.status(500).json({ error: 'Failed to generate Twilio token: ' + err.message });
  }
});

// TwiML Voice Webhook (Invoked when browser WebRTC initiates call)
router.all('/voice', (req, res) => {
  const config = getTwilioConfig();
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  let to = req.body.To || req.query.To;
  const callerId = config.phoneNumber || '+19856022321';

  if (to) {
    to = to.replace(/[\s\-\(\)]/g, '');
    if (to.startsWith('+610')) to = '+61' + to.slice(4);
    if (to.startsWith('+440')) to = '+44' + to.slice(4);
    if (to.startsWith('+920')) to = '+92' + to.slice(4);
  }

  console.log(`🎙️ Twilio WebRTC Voice Bridge Request: From=${callerId} To=${to}`);

  if (to) {
    // Dial directly to destination phone number with active master Caller ID
    const dial = twiml.dial({
      callerId: callerId,
      answerOnBridge: true
    });

    dial.number(to);
  } else {
    twiml.say('No destination phone number specified.');
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// Record Initial Call Log
router.post('/log-call', async (req, res) => {
  const { targetNumber, userEmail, userName } = req.body;
  const config = getTwilioConfig();

  const newLog = {
    id: 'call_' + Date.now(),
    userEmail: userEmail || 'guest@example.com',
    userName: userName || 'Guest User',
    targetNumber: targetNumber || 'Unknown',
    userNumber: config.phoneNumber || 'Web Browser',
    status: 'Connected',
    duration: '00:00',
    timestamp: new Date().toISOString(),
    mode: 'WebRTC Direct Audio'
  };

  await saveCallLog(newLog);
  res.json({ success: true, log: newLog });
});

// Update Call End Duration
router.post('/call-end', async (req, res) => {
  const { logId, duration } = req.body;
  const updatedLog = await updateCallLog(logId, { status: 'Completed', duration: duration || '00:00' });
  res.json({ success: true, log: updatedLog });
});

// Get Call History
router.get('/history', async (req, res) => {
  const email = req.query.email;
  const role = req.query.role;
  const allLogs = await getCallLogs();

  if (role === 'admin' || !email) {
    res.json(allLogs);
  } else {
    const filtered = allLogs.filter((l) => l.userEmail === email);
    res.json(filtered);
  }
});

// Admin Route: Delete Call Log Entry
router.delete('/history/:id', requireAdmin, async (req, res) => {
  const logId = req.params.id;
  await deleteCallLogById(logId);
  res.json({ message: 'Call log deleted successfully' });
});

export default router;
