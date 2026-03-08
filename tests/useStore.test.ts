import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Store } from '@/Store'
import { useStore } from '@/useStore'

describe('useStore', () => {
  describe('without selector', () => {
    it('returns the current store state', () => {
      const store = new Store(42)
      const { result } = renderHook(() => useStore(store))
      expect(result.current).toBe(42)
    })

    it('re-renders when the store state changes', () => {
      const store = new Store('hello')
      const { result } = renderHook(() => useStore(store))

      act(() => store.set('world'))
      expect(result.current).toBe('world')
    })

    it('handles multiple sequential updates', () => {
      const store = new Store(0)
      const { result } = renderHook(() => useStore(store))

      act(() => {
        store.set(1)
        store.set(2)
        store.set(3)
      })
      expect(result.current).toBe(3)
    })

    it('works with object state', () => {
      const initial = { count: 0, name: 'test' }
      const store = new Store(initial)
      const { result } = renderHook(() => useStore(store))

      expect(result.current).toBe(initial)

      const next = { count: 1, name: 'updated' }
      act(() => store.set(next))
      expect(result.current).toBe(next)
    })

    it('does not re-render when set is called with identical value', () => {
      const store = new Store(42)
      const renderCount = vi.fn()

      renderHook(() => {
        renderCount()
        return useStore(store)
      })

      expect(renderCount).toHaveBeenCalledTimes(1)

      act(() => store.set(42))
      expect(renderCount).toHaveBeenCalledTimes(1)
    })

    it('works with update()', () => {
      const store = new Store(10)
      const { result } = renderHook(() => useStore(store))

      act(() => store.update((v) => v + 5))
      expect(result.current).toBe(15)
    })
  })

  describe('with selector', () => {
    it('returns the selected value', () => {
      const store = new Store({ count: 5, label: 'hello' })
      const { result } = renderHook(() => useStore(store, (s) => s.count))
      expect(result.current).toBe(5)
    })

    it('re-renders when the selected value changes', () => {
      const store = new Store({ count: 0, label: 'hello' })
      const { result } = renderHook(() => useStore(store, (s) => s.count))

      act(() => store.set({ count: 1, label: 'hello' }))
      expect(result.current).toBe(1)
    })

    it('does not re-render when an unrelated field changes (primitive selector)', () => {
      const store = new Store({ count: 0, label: 'hello' })
      const renderCount = vi.fn()

      renderHook(() => {
        renderCount()
        return useStore(store, (s) => s.count)
      })

      expect(renderCount).toHaveBeenCalledTimes(1)

      act(() => store.set({ count: 0, label: 'changed' }))
      // selector returns 0 both times → Object.is(0, 0) → no re-render
      expect(renderCount).toHaveBeenCalledTimes(1)
    })

    it('works with inline selectors across re-renders', () => {
      const store = new Store({ a: 1, b: 2 })
      const { result, rerender } = renderHook(() => useStore(store, (s) => s.a))

      expect(result.current).toBe(1)

      rerender()
      expect(result.current).toBe(1)

      act(() => store.set({ a: 10, b: 2 }))
      expect(result.current).toBe(10)
    })

    it('supports derived computations', () => {
      const store = new Store({ items: [1, 2, 3] })
      const { result } = renderHook(() =>
        useStore(store, (s) => s.items.length)
      )

      expect(result.current).toBe(3)

      act(() => store.set({ items: [1, 2, 3, 4] }))
      expect(result.current).toBe(4)
    })
  })

  describe('subscription lifecycle', () => {
    it('unsubscribes on unmount', () => {
      const store = new Store(0)
      const { result, unmount } = renderHook(() => useStore(store))

      expect(result.current).toBe(0)
      unmount()

      // After unmount, store updates should not cause issues
      act(() => store.set(99))
    })

    it('resubscribes when the store changes', () => {
      const store1 = new Store('a')
      const store2 = new Store('b')

      const { result, rerender } = renderHook(({ store }) => useStore(store), {
        initialProps: { store: store1 as Store<string> },
      })

      expect(result.current).toBe('a')

      rerender({ store: store2 })
      expect(result.current).toBe('b')

      // Updates to old store should not affect the hook
      act(() => store1.set('a-updated'))
      expect(result.current).toBe('b')

      // Updates to new store should
      act(() => store2.set('b-updated'))
      expect(result.current).toBe('b-updated')
    })
  })

  describe('selector stability', () => {
    it('does not resubscribe when an inline selector changes reference', () => {
      const store = new Store({ x: 1 })
      const subscribeSpy = vi.spyOn(store, 'subscribe')

      const { rerender } = renderHook(() => useStore(store, (s) => s.x))

      const initialCallCount = subscribeSpy.mock.calls.length

      // Re-render with a new inline selector (different reference)
      rerender()
      rerender()
      rerender()

      // subscribe should not have been called again
      expect(subscribeSpy).toHaveBeenCalledTimes(initialCallCount)

      subscribeSpy.mockRestore()
    })

    it('picks up a new selector without resubscribing', () => {
      const store = new Store({ a: 1, b: 2 })

      const { result, rerender } = renderHook(
        ({ field }: { field: 'a' | 'b' }) => useStore(store, (s) => s[field]),
        { initialProps: { field: 'a' } }
      )

      expect(result.current).toBe(1)

      rerender({ field: 'b' })
      expect(result.current).toBe(2)
    })
  })

  describe('edge cases', () => {
    it('handles undefined store state', () => {
      const store = new Store<number | undefined>(undefined)
      const { result } = renderHook(() => useStore(store))
      expect(result.current).toBeUndefined()
    })

    it('handles null store state', () => {
      const store = new Store<string | null>(null)
      const { result } = renderHook(() => useStore(store))
      expect(result.current).toBeNull()
    })

    it('handles selector returning undefined', () => {
      const store = new Store({ a: undefined as number | undefined })
      const { result } = renderHook(() => useStore(store, (s) => s.a))
      expect(result.current).toBeUndefined()
    })

    it('handles rapid store swaps', () => {
      const stores = Array.from({ length: 5 }, (_, i) => new Store(i))

      const { result, rerender } = renderHook(
        ({ idx }) => useStore(stores[idx] as Store<number>),
        { initialProps: { idx: 0 } }
      )

      for (let i = 1; i < 5; i++) {
        rerender({ idx: i })
        expect(result.current).toBe(i)
      }
    })
  })
})
