# Specification

## Summary
**Goal:** Deliver an anonymous shared chat where any message can be deleted by anyone once it is at least 5 minutes old, with backend-enforced timing and a cohesive non-blue/purple visual theme.

**Planned changes:**
- Backend (single Motoko actor in `backend/main.mo`): add message storage and APIs to create messages, list recent messages (id, text, created timestamp, deleted state), and delete messages only when they are ≥5 minutes old (any caller allowed; early deletes rejected with a clear error).
- Frontend: build an anonymous chat UI with a shared feed and composer; use React Query to load the feed and periodically poll/refresh so new messages appear without manual reload.
- Frontend: add a per-message delete control that stays hidden/disabled until the message is 5 minutes old; handle backend “too early” errors with a clear English message and keep the message intact; reflect deletions in the UI (remove or show “Message deleted” state).
- Frontend: apply a coherent, distinctive theme across layout/typography/components with a primary palette that is not blue/purple-dominant.
- Frontend: add generated static image assets under `frontend/public/assets/generated` and visibly use at least one in the UI (e.g., header or empty state), without fetching images from the backend.

**User-visible outcome:** Users can anonymously post messages to a shared feed, see new messages appear via periodic refresh, and delete any message once it has been posted for 5 minutes; the app has a consistent non-blue/purple theme and includes themed static illustrations.
