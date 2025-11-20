# QR Code Attendance Tracking System – Implementation Report

## 1. Executive Summary

An offline-first QR attendance platform that pairs a Vite/React front-end with a Node/Express/MongoDB API. Teachers can manage students, generate encrypted QR codes, and scan them even when the network is unreliable. The app stores scans locally (IndexedDB) and automatically syncs once connectivity returns, guaranteeing zero data loss.

## 2. Technology Stack

- **Frontend**: Vite + React 18, TailwindCSS, HTML5 QR scanner (`html5-qrcode`), IndexedDB (`idb`)
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT auth
- **Tooling**: Vite dev server, Nodemon, Recharts, QRCodeSVG

## 3. Repository Layout

```
attendance-app/
├── backend/         # Express REST API, Mongo models, routes, init scripts
├── frontend/        # Vite React client with offline sync + QR tooling
└── docs/*.md        # Database and troubleshooting notes
```

## 4. Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or Atlas)

### Backend

```bash
cd backend
npm install
copy .env.example .env   # set MONGODB_URI, JWT_SECRET, etc.
npm run init-admin       # seeds default admin/admin123
npm run dev              # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173 (or add -- --port 3000)
```

## 5. Key Features

- Modern neon/glass UI for login, dashboard, QR studio, and scanner
- Role-based dashboards (Admin/Teacher vs Student)
- Encrypted QR generation with session + student metadata
- Camera-based QR scanner with offline persistence and sync
- Analytics (daily/monthly trends, top students) rendered via Recharts
- Floating sync status widget indicating connectivity and pending queue

## 6. Architecture Highlights

| Layer        | Responsibilities                                            | Notable Files                                                                               |
| ------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Frontend     | Authentication flow, dashboards, QR tools, offline queue    | `src/App.jsx`, `components/`                                                                |
| Offline Core | IndexedDB queue, sync scheduler, manual sync hook           | `services/offlineStorage.js`, `services/syncService.js`, `components/OfflineSyncStatus.jsx` |
| Backend      | JWT auth, student CRUD, attendance analytics, QR encryption | `backend/server.js`, `routes/*.js`, `models/*.js`                                           |

The offline queue uses IndexedDB (via `idb`) to persist scans with timestamps, while `syncService` periodically flushes pending records in batches to `/attendance/mark`. This decouples UI responsiveness from network state.

## 7. Development & Troubleshooting Tips

- If the frontend shows a blank page, follow `frontend/BLANK_PAGE_FIX.md`.
- Use `start-backend.sh` / `stop-backend.sh` (Linux/Mac) or equivalent PowerShell commands on Windows for quick restarts.
- To inspect Mongo data, use `backend/scripts/initAdmin.js` for seeding and `view-database.sh` (or `mongosh`) for queries.

## 8. Testing the Flow

1. Run backend and frontend as described above.
2. Login with `admin / admin123`.
3. Add a student, generate a QR code, and scan it using the in-app scanner.
4. Toggle browser dev tools → Network → “Offline” to simulate outages; scans are cached and synced automatically once back online.

## 9. Exam Question Answer (10 Marks)

### Question

_While attempting to implement the solution, what challenges did you encounter that made you realize that a conventional approach will not work and which led you to research non-conventional approaches? And how did you solve the problem?_

### Part 1: Challenges with the Conventional Approach

We started with a fully synchronous REST workflow: every QR scan triggered an immediate API call to `/attendance/mark`.

- **Latency & Timeouts**: In basement classrooms the spinner lasted 10–20 seconds; users assumed the app froze.
- **Data Loss**: Mid-request dropouts meant attendance never reached the server, yet users thought it had.
- **Scalability**: 50 simultaneous scans -> 50 concurrent API calls, saturating the server queue.

The breaking point was realizing that “Scan” (user intent) and “Transmit” (network IO) must not be the same step. Coupling them makes UX hostage to Wi-Fi quality.

### Part 2: Non-Conventional Approach (Offline-First Store-and-Forward)

We adopted an asynchronous store-and-forward architecture—unusual for typical web CRUD apps because it assumes the network is _always_ unreliable. The browser becomes the temporary source of truth via IndexedDB; the backend simply reconciles batches when possible. This mindset flips the usual “server-first” trust model.

### Part 3: Final Solution

1. **Interception Layer** (`offlineStorage.js`): Scans are written to IndexedDB immediately with `{ studentId, sessionId, timestamp }`. The UI shows “Success” instantly, even offline.
2. **Background Sync Service** (`syncService.js`): A timer/visibility listener checks connectivity. When online, it grabs pending records and posts them in batches.
3. **Acknowledgment & Cleanup**: On HTTP 200 the entries are marked synced and pruned, keeping storage lean. Users can also trigger manual sync via the floating widget (`OfflineSyncStatus.jsx`).

This decoupled architecture guarantees:

- **Zero-latency UX** (no spinner waits)
- **100% reliability** (no silent losses)
- **Graceful scaling** (batch uploads reduce API pressure)

The result is a resilient attendance system that works in airplane mode yet still keeps the central database authoritative once the connection stabilizes.

---

**Built with ❤️ using React, Node.js, and MongoDB**
