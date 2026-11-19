const db = require('../models/dataStore');
const notificationService = require('../services/notificationService');

class CallController {
  // Initiate or get active call session for request
  async getCallSession(req, res) {
    const { id } = req.params; // requestId
    const call = db.calls.get(id);

    if (!call) {
      return res.status(404).json({ error: 'CallNotFound', message: 'No active call for this request.' });
    }

    return res.json({ call });
  }

  // Initiate a call
  async initiateCall(req, res) {
    const { id } = req.params; // requestId
    const request = db.requests.get(id);

    if (!request || (request.status !== 'accepted' && request.status !== 'in_progress')) {
      return res.status(400).json({
        error: 'InvalidCallState',
        message: 'In-app voice calling is only available during an active assistance session.'
      });
    }

    const callerId = req.user.id;
    // Callee is the other party
    let calleeId = request.requesterId === callerId ? request.acceptedHelperId : request.requesterId;
    if (!calleeId) {
      return res.status(400).json({ error: 'CalleeNotFound', message: 'Recipient is not connected to this request.' });
    }

    const callerUser = db.users.get(callerId);
    const calleeUser = db.users.get(calleeId);

    const callSession = {
      id: `call_${Date.now()}`,
      requestId: id,
      callerId,
      callerName: callerUser ? callerUser.name : 'Participant',
      callerAvatar: callerUser ? callerUser.avatar : null,
      calleeId,
      calleeName: calleeUser ? calleeUser.name : 'Participant',
      calleeAvatar: calleeUser ? calleeUser.avatar : null,
      status: 'ringing', // 'ringing' | 'accepted' | 'declined' | 'ended' | 'missed'
      offer: req.body.offer || null,
      answer: null,
      callerCandidates: [],
      calleeCandidates: [],
      createdAt: new Date().toISOString(),
      connectedAt: null,
      endedAt: null
    };

    db.calls.set(id, callSession);

    // Notify callee
    await notificationService.sendToUser(calleeId, {
      title: `Incoming In-App Voice Call`,
      body: `${callerUser ? callerUser.name : 'Your helper/requester'} is calling you. [No phone number exposed]`,
      requestId: id,
      type: 'call',
      priority: 'high'
    });

    db.logAudit('CALL_INITIATED', callerId, { requestId: id, calleeId });

    return res.status(201).json({ message: 'Call initiated', call: callSession });
  }

  // Answer call
  async answerCall(req, res) {
    const { id } = req.params;
    const call = db.calls.get(id);

    if (!call) return res.status(404).json({ error: 'CallNotFound' });

    call.status = 'connected';
    call.connectedAt = new Date().toISOString();
    if (req.body.answer) {
      call.answer = req.body.answer;
    }

    db.calls.set(id, call);
    return res.json({ message: 'Call connected', call });
  }

  // Add ICE Candidate
  async addCandidate(req, res) {
    const { id } = req.params;
    const { candidate, role } = req.body;
    const call = db.calls.get(id);

    if (!call) return res.status(404).json({ error: 'CallNotFound' });

    if (role === 'caller') {
      call.callerCandidates.push(candidate);
    } else {
      call.calleeCandidates.push(candidate);
    }

    db.calls.set(id, call);
    return res.json({ success: true });
  }

  // End or decline call
  async endCall(req, res) {
    const { id } = req.params;
    const { status } = req.body; // 'ended' | 'declined' | 'missed'
    const call = db.calls.get(id);

    if (!call) return res.status(404).json({ error: 'CallNotFound' });

    call.status = status || 'ended';
    call.endedAt = new Date().toISOString();
    db.calls.set(id, call);

    // Record call log message in chat
    const messages = db.messages.get(id) || [];
    messages.push({
      id: `call_log_${Date.now()}`,
      requestId: id,
      senderId: 'system',
      senderName: 'System',
      type: 'system',
      text: `📞 Voice call ${call.status} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: new Date().toISOString()
    });
    db.messages.set(id, messages);

    return res.json({ message: 'Call ended', call });
  }
}

module.exports = new CallController();
