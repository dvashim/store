import { describe, expect, it, vi } from 'vitest'
import { ComputedStore } from '@/ComputedStore'
import { Store } from '@/Store'

describe('ComputedStore', () => {
  describe('constructor', () => {
    it('computes initial derived value from source store', () => {
      const source = new Store([1, 2, 3])
      const derived = new ComputedStore(source, (state) => state.length)

      expect(derived.get()).toBe(3)
    })

    it('is connected after construction', () => {
      const source = new Store(10)
      const derived = new ComputedStore(source, (n) => n * 2)

      expect(derived.isConnected).toBe(true)
    })
  })

  describe('get', () => {
    it('returns the current derived value', () => {
      const source = new Store('hello')
      const derived = new ComputedStore(source, (s) => s.toUpperCase())

      expect(derived.get()).toBe('HELLO')
    })

    it('reflects source store changes', () => {
      const source = new Store(5)
      const derived = new ComputedStore(source, (n) => n * 2)

      source.set(10)

      expect(derived.get()).toBe(20)
    })
  })

  describe('subscribe', () => {
    it('notifies subscribers when derived value changes', () => {
      const source = new Store(1)
      const derived = new ComputedStore(source, (n) => n * 10)
      const fn = vi.fn()

      derived.subscribe(fn)
      source.set(2)

      expect(fn).toHaveBeenCalledOnce()
      expect(fn).toHaveBeenCalledWith(20, 10)
    })

    it('does not notify when derived value is unchanged', () => {
      const source = new Store({ a: 1, b: 2 })
      const derived = new ComputedStore(source, (state) => state.a)
      const fn = vi.fn()

      derived.subscribe(fn)
      source.set({ a: 1, b: 3 })

      expect(fn).not.toHaveBeenCalled()
    })

    it('supports multiple subscribers', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n + 1)
      const fn1 = vi.fn()
      const fn2 = vi.fn()

      derived.subscribe(fn1)
      derived.subscribe(fn2)
      source.set(5)

      expect(fn1).toHaveBeenCalledWith(6, 1)
      expect(fn2).toHaveBeenCalledWith(6, 1)
    })

    it('returns an unsubscribe function', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n * 2)
      const fn = vi.fn()

      const unsubscribe = derived.subscribe(fn)
      unsubscribe()
      source.set(5)

      expect(fn).not.toHaveBeenCalled()
    })
  })

  describe('connect / disconnect', () => {
    it('stops updating derived value after disconnect', () => {
      const source = new Store(1)
      const derived = new ComputedStore(source, (n) => n * 2)

      derived.disconnect()
      source.set(10)

      expect(derived.get()).toBe(2)
      expect(derived.isConnected).toBe(false)
    })

    it('resumes updating after reconnect', () => {
      const source = new Store(1)
      const derived = new ComputedStore(source, (n) => n * 2)

      derived.disconnect()
      source.set(10)
      derived.connect()

      expect(derived.isConnected).toBe(true)
      source.set(20)

      expect(derived.get()).toBe(40)
    })

    it('does not notify derived subscribers after disconnect', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n + 1)
      const fn = vi.fn()

      derived.subscribe(fn)
      derived.disconnect()
      source.set(5)

      expect(fn).not.toHaveBeenCalled()
    })

    it('calling disconnect multiple times is safe', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n + 1)

      derived.disconnect()
      derived.disconnect()

      expect(derived.isConnected).toBe(false)
    })

    it('calling connect multiple times does not create duplicate subscriptions', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n + 1)
      const fn = vi.fn()

      derived.connect()
      derived.connect()
      derived.subscribe(fn)
      source.set(5)

      expect(fn).toHaveBeenCalledOnce()
    })

    it('derived value is stale after disconnect (returns last known value)', () => {
      const source = new Store(1)
      const derived = new ComputedStore(source, (n) => n * 3)

      source.set(5)
      expect(derived.get()).toBe(15)

      derived.disconnect()
      source.set(100)

      expect(derived.get()).toBe(15)
    })
  })

  describe('chaining', () => {
    it('supports ComputedStore as source (chaining)', () => {
      const source = new Store([1, 2, 3])
      const length = new ComputedStore(source, (arr) => arr.length)
      const label = new ComputedStore(length, (n) => `count: ${n}`)

      expect(label.get()).toBe('count: 3')
    })

    it('propagates changes through the chain', () => {
      const source = new Store([1, 2])
      const length = new ComputedStore(source, (arr) => arr.length)
      const doubled = new ComputedStore(length, (n) => n * 2)
      const fn = vi.fn()

      doubled.subscribe(fn)
      source.set([1, 2, 3, 4])

      expect(doubled.get()).toBe(8)
      expect(fn).toHaveBeenCalledWith(8, 4)
    })

    it('disconnecting middle store breaks the chain', () => {
      const source = new Store(1)
      const middle = new ComputedStore(source, (n) => n + 10)
      const end = new ComputedStore(middle, (n) => n * 2)

      expect(end.get()).toBe(22)

      middle.disconnect()
      source.set(5)

      expect(middle.get()).toBe(11)
      expect(end.get()).toBe(22)
    })
  })

  describe('selector behavior', () => {
    it('works with object selectors', () => {
      const source = new Store({ count: 2, users: ['a', 'b'] })
      const derived = new ComputedStore(source, (state) => state.users)

      expect(derived.get()).toEqual(['a', 'b'])
    })

    it('uses Object.is equality via internal Store', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) =>
        n > 0 ? 'positive' : 'non-positive'
      )
      const fn = vi.fn()

      derived.subscribe(fn)

      source.set(-1)
      expect(fn).not.toHaveBeenCalled()

      source.set(1)
      expect(fn).toHaveBeenCalledOnce()
      expect(fn).toHaveBeenCalledWith('positive', 'non-positive')
    })

    it('handles selectors that return new references', () => {
      const source = new Store({ x: 1 })
      const derived = new ComputedStore(source, (state) => ({
        doubled: state.x * 2,
      }))
      const fn = vi.fn()

      derived.subscribe(fn)
      source.set({ x: 1 })

      expect(fn).toHaveBeenCalledOnce()
    })
  })

  describe('edge cases', () => {
    it('handles undefined initial state', () => {
      const source = new Store<number | undefined>(undefined)
      const derived = new ComputedStore(source, (n) => n ?? 0)

      expect(derived.get()).toBe(0)

      source.set(5)
      expect(derived.get()).toBe(5)
    })

    it('handles null state', () => {
      const source = new Store<string | null>(null)
      const derived = new ComputedStore(source, (s) => s?.length ?? -1)

      expect(derived.get()).toBe(-1)

      source.set('hello')
      expect(derived.get()).toBe(5)
    })

    it('handles rapid sequential updates', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n * 2)
      const fn = vi.fn()

      derived.subscribe(fn)

      source.set(1)
      source.set(2)
      source.set(3)

      expect(derived.get()).toBe(6)
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('handles source store update() method', () => {
      const source = new Store(10)
      const derived = new ComputedStore(source, (n) => n + 1)

      source.update((prev) => prev * 2)

      expect(derived.get()).toBe(21)
    })

    it('handles source store set with force option', () => {
      const source = new Store(5)
      const derived = new ComputedStore(source, (n) => n * 2)
      const fn = vi.fn()

      derived.subscribe(fn)
      source.set(5, { force: true })

      expect(fn).not.toHaveBeenCalled()
    })
  })
})
