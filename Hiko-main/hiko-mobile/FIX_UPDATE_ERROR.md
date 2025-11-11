# Fix: "Failed to download remote update" Error

## Quick Fix (Usually Works)

Run this command:
```bash
npm start
```

This now automatically clears the cache. Then:
1. Close Expo Go app completely on your phone
2. Reopen Expo Go
3. Scan the QR code again

## If That Doesn't Work

### Step 1: Delete .expo folder
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue

# Or manually delete the .expo folder in hiko-mobile directory
```

### Step 2: Clear Expo Go App Cache

**On your phone:**
- **iOS**: Delete and reinstall Expo Go app
- **Android**: Settings > Apps > Expo Go > Storage > Clear Cache

### Step 3: Restart with clean cache
```bash
npm start
```

### Step 4: If still failing, full reset
```bash
# Delete everything
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Reinstall
npm install

# Start fresh
npm start
```

## Why This Happens

This error occurs when:
- Expo Go tries to download a cached update that no longer exists
- There's a mismatch between your app version and Expo Go's cache
- Network issues during update download

The `--clear` flag in the start script should prevent this going forward.

