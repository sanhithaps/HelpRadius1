# Help Radius – System Architecture & Specifications

Help Radius is a high-availability, privacy-preserving location-based emergency and community assistance platform connecting individuals in distress with verified first responders and volunteers within dynamic geofenced radiuses.

---

## 1. High-Level System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Browser / Mobile PWA"]
        ReactApp["React 18 + Vite SPA"]
        Geolocation["HTML5 Geolocation API"]
        LeafletMap["Interactive Leaflet Maps"]
        MediaRec["MediaRecorder (Audio Notes)"]
        WebRTC["WebRTC In-App Audio Engine"]
    end

    subgraph Gateway ["Reverse Proxy & Ingress"]
        Nginx["Nginx Reverse Proxy & Static Server"]
    end

    subgraph BackendServices ["Node.js / Express Micro-Engine"]
        ExpressAPI["Express REST API (Port 5000)"]
        AuthMiddleware["JWT & Role Authorization Guard"]
        MatchingEngine["Geo-Matching Engine (Haversine & Geohash)"]
        RadiusWorker["Background Radius Expansion Worker (3s Loop)"]
        PricingEngine["3-Tier Transparent Pricing Calculator"]
    end

    subgraph DataPersistence ["Data & State Persistence"]
        DataStore["In-Memory / File-Persisted Real-Time Store"]
        AuditLogs["Audit Trail & Telemetry Logger"]
        FirebaseAdapter["Firebase Admin SDK / Firestore Adapter"]
    end

    subgraph NotificationChannels ["Notification & Alert Gateways"]
        SMSAdapter["SMS Gateway Adapter (Simulated / Twilio / DLT)"]
        FCMAdapter["FCM / Web Push Notification Dispatcher"]
    end

    ReactApp -->|HTTP / REST| Nginx
    Nginx -->|/api/* Reverse Proxy| ExpressAPI
    Geolocation -->|Lat / Lng Pin| ReactApp
    ExpressAPI --> AuthMiddleware
    AuthMiddleware --> MatchingEngine
    ExpressAPI --> RadiusWorker
    ExpressAPI --> PricingEngine
    MatchingEngine --> DataStore
    RadiusWorker --> MatchingEngine
    RadiusWorker --> FCMAdapter
    ExpressAPI --> SMSAdapter
    ExpressAPI --> DataStore
    DataStore --> AuditLogs
    DataStore -.-> FirebaseAdapter
    WebRTC <-->|Signaling via API| ExpressAPI
```

---

## 2. Request Lifecycle State Diagram

```mermaid
stateDiagram-v2
    [*] --> Searching: Emergency SOS / General Request
    [*] --> Scheduled: Future Scheduled Assistance

    Scheduled --> Searching: Lead Time Window Reached
    Scheduled --> Cancelled: Requester Cancels
    Scheduled --> Scheduled: Requester Reschedules Date/Time

    Searching --> Searching: Radius Expands (2km → 5km → 10km → 20km)
    Searching --> Accepted: Eligible Helper Accepts (Atomic Lock)
    Searching --> Expired: Max Radius Reached Without Acceptance
    Searching --> Cancelled: Requester Cancels

    Accepted --> InProgress: Helper Starts En-Route
    Accepted --> Cancelled: Helper or Requester Cancels

    InProgress --> Completed: Helper Reaches & Solves Issue
    InProgress --> Cancelled: Cancelled with Reason

    Completed --> Rated: "I'm Safe" & Star Review Recorded
    Rated --> [*]
    Expired --> [*]
    Cancelled --> [*]
```

---

## 3. Why Sensitive Operations Belong on the Backend

1. **Atomic Acceptance (Concurrency Protection):** Multiple nearby helpers may tap "Accept" simultaneously. Only the backend transaction guarantees that exactly one helper wins the request, avoiding race conditions.
2. **Helper Matching & Geo-Filtering:** Exact GPS coordinates of volunteers must remain confidential. The backend filters candidates using Haversine calculation without leaking raw location data to other users.
3. **Emergency Contact Dispatch:** Alerting family contacts via SMS or push must execute reliably on the server even if the user's browser closes or their device battery dies.
4. **Transparent Pricing Integrity:** Rates, free 2-kilometer thresholds, and emergency 100% free exemptions are enforced server-side to prevent manipulation.

---

## 4. Firestore & Data Store Document Schema

- `users/{uid}`: `{ id, name, email, phone, role: 'user'|'admin', isHelper: boolean, permissions: { locationGranted, notificationsGranted }, emergencyContacts: [] }`
- `users/{uid}/emergencyContacts/{id}`: Maximum 6 entries strictly enforced. `{ id, name, phone, relationship, email }`
- `helpers/{uid}`: `{ id, status: 'pending'|'approved'|'rejected', safetyEligible: boolean, isAvailable: boolean, categories: [], rating: number, location: { lat, lng }, verification: { simulatedIdType, notes } }`
- `requests/{id}`: `{ id, type: 'emergency'|'general'|'scheduled', category, priority, status, requesterId, location, radius: { currentKm, stepIndex, history: [] }, acceptedHelperId, voluntaryReward, finalPricing }`
- `chats/{requestId}`: `{ id, participants: [requesterId, helperId], active: boolean, lastMessage, lastMessageAt }`
- `chats/{requestId}/messages/{messageId}`: `{ id, senderId, senderName, type: 'text'|'image'|'audio'|'system', text, media, createdAt, deliveredTo, readBy }`
- `trackingSessions/{requestId}`: `{ requestId, requesterId, helperId, active: boolean, helperLocation, requesterLocation, distanceKm, etaMinutes }`
- `calls/{requestId}`: WebRTC signaling session `{ id, callerId, calleeId, status: 'ringing'|'connected'|'ended', offer, answer }`
- `reports/{id}`: `{ id, reporterId, reportedUserId, reason, status: 'pending'|'resolved' }`
- `adminAudit/{id}`: `{ id, action, actorId, details, timestamp }`
