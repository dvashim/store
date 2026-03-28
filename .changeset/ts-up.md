---
"@dvashim/store": patch
---

Upgrade to TypeScript 6 and update dev dependencies

- **TypeScript:** Upgrade from v5.9 to v6.0, including `@dvashim/typescript-config` v1.x → v2.x
- **Biome:** Upgrade from v2.4.7 to v2.4.9, including `@dvashim/biome-config` v1.3 → v1.5
- **Testing:** Upgrade jsdom v28 → v29, vitest v4.1.0 → v4.1.2
- **isolatedDeclarations:** Add explicit return type annotations to `Store` and `ComputedStore` to satisfy `isolatedDeclarations` enabled by the new TypeScript config
- **Test config:** Add `vitest` types and disable `isolatedDeclarations` in test tsconfig
