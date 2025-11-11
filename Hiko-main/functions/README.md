# Hiko Firebase Functions

Scheduled Cloud Functions that ingest Department of Conservation (DoC) data into Firestore and Storage.

## Setup

```bash
cd functions
npm install
```

### Configure secrets

Use Firebase Functions secrets for API keys:

```bash
firebase functions:secrets:set DOC_API_KEY
firebase functions:secrets:set DOC_BASE
firebase functions:secrets:set OWM_API_KEY
```

> `DOC_API_KEY` and `DOC_BASE` are required for DoC ingestion. `OWM_API_KEY` is shared with the mobile client via remote config or other secure channel.

## Deploy

```bash
npm run build
firebase deploy --only functions,firestore:indexes
```

The schedules are created automatically:

- `syncDocAssets` – daily at 02:00 UTC
- `syncDocAlerts` – hourly

## Manual triggers

Two callable functions help during development:

- `manualSyncDocAssets` – runs the full asset ingest on demand.
- `seedDocDemo` – imports a limited (≤50 tracks) demo dataset for local testing.

Run them via the Firebase console or emulator.

## Testing

```bash
npm test
```

Vitest covers data normalisation edge cases.
