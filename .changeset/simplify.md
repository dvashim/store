---
"@dvashim/store": patch
---

Simplify internal implementation of Store and ComputedStore

- **Refactor:** Simplify Store flush loop to use index-based iteration and skip subscriber notification when there are no subscribers
- **Refactor:** Extract `#compute` and `#subscribe` private methods in ComputedStore to reduce duplication
- **Docs:** Clarify that `connect()` immediately syncs the derived value with the current source state
