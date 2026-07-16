# Vitals — Blood Pressure & Pulse Rate Tracker (MERN)

A full-stack MERN application for logging and visualizing blood pressure and pulse rate readings.

## Directory Structure

```
bp-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/
│   │   └── recordController.js    # CRUD logic + time-range filtering + stats
│   ├── models/
│   │   └── Record.js              # Mongoose schema
│   ├── routes/
│   │   └── recordRoutes.js        # /api/records routes
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── records.js         # Axios client for the API
    │   ├── components/
    │   │   ├── InputForm.jsx      # New reading form
    │   │   ├── TimeRangeSelector.jsx
    │   │   ├── StatsSummary.jsx
    │   │   ├── AnalyticsGraph.jsx # Recharts line chart
    │   │   └── HistoryTable.jsx
    │   ├── utils/
    │   │   └── bpCategory.js      # BP category classification helper
    │   ├── App.jsx                # Dashboard layout
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    ├── .env.example
    └── package.json
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env       # then edit MONGO_URI if needed
npm run dev                # starts on http://localhost:5000
```

Requires a running MongoDB instance (local `mongod`, or a MongoDB Atlas connection string in `.env`).

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env       # confirm VITE_API_URL points to your backend
npm run dev                # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

## API Reference

| Method | Endpoint             | Description                                                                 |
|--------|-----------------------|------------------------------------------------------------------------------|
| POST   | `/api/records`        | Create a new reading. Body: `{ systolic, diastolic, pulseRate, armSelection, comments?, timestamp? }` |
| GET    | `/api/records?range=` | Fetch readings. `range` = `today` \| `7days` \| `month` \| `6months` \| `year` \| `all` (default `all`). Returns `{ data, stats, count }`. |
| DELETE | `/api/records/:id`    | Delete a reading by ID.                                                      |

## Design Notes

- **Palette**: soft teal/mint clinical background with a deep teal primary, blue secondary (diastolic), and muted amber/red signal colors for elevated/high readings — avoids alarming pure-red for anything short of a real high reading.
- **Typography**: Space Grotesk for headings, Inter for body text, JetBrains Mono for all numeric vitals (so readings read like a monitor display).
- **Signature element**: an animated EKG waveform line in the header, echoing the subject matter (pulse/vitals) without needing extra copy.
- Fully responsive: form and analytics stack vertically on mobile, history table becomes stacked cards below `sm` breakpoint.
