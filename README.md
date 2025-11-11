# SmartExpenseTrackerViaSMS

## Overview
Smart Expense Tracker that auto-imports bank transaction SMS on Android, parses the SMS and stores transactions locally using SQLite. Manual add supported for both platforms.

## Setup
1. Clone repo
2. Install dependencies: `yarn`
3. iOS: `cd ios && pod install && cd ..`
4. Android: ensure `android/gradle.properties` etc. RN config valid.

## Permissions (Android)
Add to AndroidManifest.xml:
  <uses-permission android:name="android.permission.READ_SMS" />
  <uses-permission android:name="android.permission.RECEIVE_SMS" />

At runtime the app requests `READ_SMS`.

## SMS parsing logic (regex)
- Look for finance keywords: `debited`, `credited`, `txn`, `avl bal`.
- Bank-specific patterns for AXISBK, HDFCBK, ICICI, etc. (see `src/services/smsParser.ts`)
- General currency regex: `(?:Rs\.?|INR|₹)\s?([0-9,]+(?:\.[0-9]{1,2})?)` to extract amounts.
- Date extraction looks for `DD-MM-YYYY` / `YYYY-MM-DD` patterns; if not present we fallback to current time (can be changed).

## Database
- SQLite via `react-native-sqlite-storage`. Transactions stored in `transactions` table.

## Biometric
- Install  via `react-native-biometrics` AND `@react-native-async-storage/async-storage` 

## Limitations
- **Android only** for SMS inbox reading. iOS cannot read SMS inbox.
- Some bank message formats may vary and require additional regex tuning.
