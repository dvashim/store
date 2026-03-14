---
"@dvashim/store": minor
---

Replace re-entrant update queue with immediate throw

- **Breaking:** Calling `set()` or `update()` from within a subscriber now throws instead of being queued and flushed
- **Removed:** Queue-based flush system and 100-iteration safety limit
