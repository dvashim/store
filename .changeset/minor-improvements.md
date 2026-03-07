---
"@dvashim/store": patch
---

Prevent infinite loops in subscriber updates and improve error handling during state flush

- **Fix:** Add a safety limit of 100 re-entrant updates to prevent infinite loops in subscribers
- **Fix:** Catch updater errors individually so remaining queued items still process; rethrow the first error after the queue drains
- **Docs:** Update README to document re-entrant update safety limit and error handling behavior
