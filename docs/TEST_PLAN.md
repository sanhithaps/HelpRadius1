# Help Radius – Test Plan & Verification Matrix

| Test ID | Category | Scenario / Steps | Expected Result | Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | SOS Accidental Trigger | Tap SOS button quickly once | Accidental trigger prevented; button requires continuous 2-second press | **PASS** |
| **TC-02** | SOS Cancel Window | Press & hold SOS for 2s, then press "Cancel SOS" within 5 seconds | Broadcast cancelled, countdown audio stops, no request dispatched | **PASS** |
| **TC-03** | Emergency Contact Limits | Add 6 contacts, attempt to add 7th contact | Server returns `400 Bad Request` with `LimitExceeded` error | **PASS** |
| **TC-04** | Emergency Contact Alerts | Trigger Emergency SOS with 4 saved contacts | All 4 contacts alerted simultaneously via SMS adapter independent of distance; status shows Delivered | **PASS** |
| **TC-05** | Safety Helper Filter | Create Personal Safety SOS (`personal_safety`) | Only verified helpers with `safetyEligible: true` are matched; general volunteers filtered out | **PASS** |
| **TC-06** | Radius Expansion | Watch searching request for 30s | Radius automatically expands from 2 km to 5 km; new step recorded in history | **PASS** |
| **TC-07** | Duplicate Suppression | Step 2 radius expansion occurs | Only newly within-range helpers receive notifications; Step 1 helpers are not duplicated | **PASS** |
| **TC-08** | Atomic Acceptance Lock | Helper 1 and Helper 2 attempt to accept same request simultaneously | Helper 1 succeeds (200 OK); Helper 2 receives `409 Conflict` ("Already Accepted") | **PASS** |
| **TC-09** | Live Tracking | Open active request tracking screen | Map renders both requester and helper pins; route line shown; distance & ETA update | **PASS** |
| **TC-10** | Voice Note Messaging | Record 4-second audio note in chat and click send | Audio waveform displays; inline playback works on both sender and receiver | **PASS** |
| **TC-11** | In-App Voice Call | Click call button in active session | WebRTC audio ringing modal opens; call connects without exposing phone numbers | **PASS** |
| **TC-12** | Chat Post-Session Lock | Helper marks request complete | Private chat immediately locks into read-only mode; new message submissions rejected | **PASS** |
| **TC-13** | Pricing Transparency | Inspect price breakdown on General help vs Emergency SOS | Emergency shows ₹0 fee; General separates Expansion Fee, Travel Comp, and Reward | **PASS** |
| **TC-14** | Admin Verification | Admin approves pending helper and ticks "Safety Certified" | Helper status changes to Approved; helper can now receive personal safety SOS | **PASS** |
| **TC-15** | Containerization | Run `docker compose build` | Multi-stage frontend (nginx) and backend (node-alpine) build with zero errors | **PASS** |
