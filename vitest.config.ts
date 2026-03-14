import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    coverage: {
      include: ['src/**'],
      provider: 'v8',
    },
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
    typecheck: {
      enabled: true,
      include: ['tests/**/*.test-d.{ts,tsx}'],
      tsconfig: 'tests/tsconfig.json',
    },
  },
})
