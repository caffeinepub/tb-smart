# TB SMART

## Current State
Full research app with Consent → Registration → Pre-Test → Awareness → Symptom Checker → Hospital Guidance → Post-Test → PDF Report flow, plus hidden Admin dashboard.

The backend currently gates `registerParticipant`, `savePreTestScore`, `savePostTestScore`, `saveRiskLevel`, and `getParticipant` behind `#user` role authorization. Since the app uses an anonymous actor (no login required for participants), every call fails with an authorization trap — causing the "registration failed" error.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Remove the `#user` authorization check from all participant-facing endpoints: `registerParticipant`, `savePreTestScore`, `savePostTestScore`, `saveRiskLevel`, `getParticipant` — these should be callable by anonymous users
- Keep `#admin` authorization on admin-only endpoints: `getAllParticipants`, `getTotalParticipants`, `getAveragePreTestScore`, `getAveragePostTestScore`, `getAverageImprovement`, `getHighRiskCount`
- `validateAdmin` stays open (no auth check needed — it just validates credentials)

### Remove
- Nothing

## Implementation Plan
1. Regenerate Motoko backend with participant endpoints open to anonymous callers
2. Keep admin endpoints protected with `#admin` role
3. Keep all data structures, fields, and logic identical
