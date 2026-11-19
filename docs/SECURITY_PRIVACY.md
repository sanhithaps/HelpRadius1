# Help Radius – Security, Privacy & Data Protection Policy

## 1. Zero-Compromise Privacy Principles

### No Storage of National Identity Numbers (Aadhaar / SSN)
As required by UIDAI and data minimization best practices, Help Radius strictly **prohibits** the storage of raw Aadhaar numbers or scans. For the prototype and presentation, identity verification is **simulated** with explicit labels: *Prototype / Simulated*. In production, this is delegated exclusively to licensed KYC providers (e.g. DigiLocker OAuth API) where only an anonymized verification token is retained.

### Phone Number Masking
In traditional apps, exposing mobile numbers creates harassment risks. Help Radius ensures that:
- Neither the requester nor the helper can view each other's phone numbers.
- In-app communication occurs through internal encrypted messaging and WebRTC voice calls using internal IDs.
- Only saved emergency contacts receive notifications, dispatched directly by the server.

### Ephemeral Live Tracking Sessions
- Tracking GPS location is enabled **only** while a request status is `accepted` or `in_progress`.
- The moment a request is marked `completed` or `cancelled`, the tracking session is terminated (`active: false`) and location sharing ceases immediately.
- Historical raw tracking trails are discarded.

### Private Chat Locking
- Private chat rooms lock into read-only mode upon request completion to prevent post-assistance unwanted contact or harassment.

---

## 2. Server-Side Security & Rate Limiting

- **Rate Limiting:** Protects `/api/requests` against SOS spam abuse (maximum 3 SOS per 10 minutes per IP).
- **Helmet Headers:** Enforces modern HTTP security headers including X-Content-Type-Options, Frameguard, and Cross-Origin Protections.
- **Role-Based Guards:** Critical endpoints (such as `/api/admin/*` and helper approvals) are gated by `requireAdmin` checks verifying custom claims on the verified token.
