# Help Radius – REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. System Health & Seeding

### `GET /api/health`
Checks server readiness, active services, and entity counts.
- **Auth:** Public
- **Response (200):**
  ```json
  {
    "status": "ok",
    "service": "help-radius-api",
    "version": "1.0.0",
    "time": "2026-11-15T18:45:00.000Z",
    "counts": { "users": 7, "helpers": 5, "requests": 2 }
  }
  ```

### `POST /api/seed/relocate`
Dynamically positions seed helpers around given coordinates for localized testing anywhere.
- **Auth:** Public
- **Body:** `{ "lat": 12.9716, "lng": 77.5946 }`
- **Response (200):** `{ "message": "Relocated seed helpers...", "helpers": [...] }`

---

## 2. Authentication & Emergency Contacts

### `POST /api/auth/send-otp`
Sends simulated OTP for phone verification.
- **Body:** `{ "phone": "+919876543210" }`
- **Response (200):** `{ "success": true, "simulatedOtp": "123456" }`

### `POST /api/auth/register`
Multi-step user registration with mandatory Verification ID, permissions, and emergency contacts.
- **Body:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "phone": "+919876543210",
    "password": "securepassword",
    "verificationId": "ID-9876543210",
    "idType": "Aadhaar Card",
    "role": "user",
    "emergencyContacts": [
      { "name": "Emergency Contact", "phone": "+919800011122", "relationship": "Family" }
    ],
    "permissions": { "locationGranted": true, "notificationsGranted": true }
  }
  ```
- **Response (201):** `{ "message": "Account created successfully", "user": {...}, "token": "jwt..." }`

### `POST /api/auth/login`
Authenticate user or administrator against persistent database.
- **Body:** `{ "email": "user@example.com", "password": "securepassword" }`
- **Response (200):** `{ "user": {...}, "token": "jwt..." }`

### `GET /api/users/me/emergency-contacts`
List saved emergency contacts.
- **Auth:** Bearer Token
- **Response (200):** `{ "contacts": [...], "count": 4, "maxAllowed": 6 }`

### `POST /api/users/me/emergency-contacts`
Add emergency contact. Rejects with 400 Bad Request if already at limit 6.
- **Auth:** Bearer Token
- **Body:** `{ "name": "Dr. Ramesh", "phone": "+919811223344", "relationship": "Doctor" }`
- **Response (201):** `{ "contact": {...}, "count": 5, "maxAllowed": 6 }`

---

## 3. Requests & Assistance Workflow

### `POST /api/requests`
Create Emergency SOS, General Help, or Scheduled Help.
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "type": "emergency",
    "category": "personal_safety",
    "location": { "lat": 12.9716, "lng": 77.5946, "address": "Current GPS" },
    "description": "Urgent assistance required",
    "voluntaryReward": 0
  }
  ```
- **Response (201):** `{ "request": {...}, "contactAlerts": [...], "pricingEstimate": {...} }`

### `GET /api/requests/mine`
Get active and past requests for authenticated user.
- **Auth:** Bearer Token

### `POST /api/requests/:id/accept`
Accept request (Atomic lock: first helper wins).
- **Auth:** Bearer Token (Approved Helper)
- **Response (200):** `{ "message": "Request accepted", "trackingSession": {...} }`
- **Response (409):** `{ "error": "AlreadyAccepted", "message": "Request already accepted" }`

### `POST /api/requests/:id/complete`
Mark request complete, unlock rating, terminate tracking, lock chat.
- **Auth:** Bearer Token

---

## 4. Communication & Live Tracking

### `GET /api/chats/:id/messages`
Get encrypted conversation history.
- **Auth:** Bearer Token (Participants only)

### `POST /api/chats/:id/messages`
Send message (text, photo, or audio note).
- **Body:** `{ "type": "audio", "text": "Voice note", "media": { "url": "blob:...", "durationSec": 4 } }`

### `POST /api/calls/:id/initiate`
Initiate in-app WebRTC audio calling.
- **Auth:** Bearer Token (Session participants)

---

## 5. Administration

### `GET /api/admin/metrics`
Platform KPIs: total users, active requests, verified helpers.
- **Auth:** Bearer Token (Admin Role Required)

### `PATCH /api/admin/helpers/:helperId`
Approve/reject helper and toggle `safetyEligible` certification.
- **Auth:** Bearer Token (Admin Role Required)
- **Body:** `{ "status": "approved", "safetyEligible": true, "notes": "CPR Certified" }`
