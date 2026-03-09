import { describe, expectTypeOf, it } from 'vitest'
import { ComputedStore } from '@/ComputedStore'
import { Store } from '@/Store'
import type { SourceStore } from '@/types'

describe('ComputedStore types', () => {
  describe('constructor', () => {
    it('infers T and U from source and selector', () => {
      const source = new Store([1, 2, 3])
      const derived = new ComputedStore(source, (state) => state.length)
      expectTypeOf(derived).toEqualTypeOf<ComputedStore<number[], number>>()
    })

    it('accepts explicit generic types', () => {
      const source = new Store({ count: 0, name: 'test' })
      const derived = new ComputedStore<
        { count: number; name: string },
        number
      >(source, (s) => s.count)
      expectTypeOf(derived).toEqualTypeOf<
        ComputedStore<{ count: number; name: string }, number>
      >()
    })

    it('accepts Store as source', () => {
      const source = new Store(42)
      const derived = new ComputedStore(source, (n) => String(n))
      expectTypeOf(derived).toEqualTypeOf<ComputedStore<number, string>>()
    })

    it('accepts ComputedStore as source (chaining)', () => {
      const source = new Store([1, 2])
      const length = new ComputedStore(source, (arr) => arr.length)
      const label = new ComputedStore(length, (n) => `count: ${n}`)
      expectTypeOf(label).toEqualTypeOf<ComputedStore<number, string>>()
    })

    it('accepts any SourceStore as source', () => {
      const custom: SourceStore<number> = {
        get: () => 42,
        subscribe: () => () => {},
      }
      const derived = new ComputedStore(custom, (n) => n > 0)
      expectTypeOf(derived).toEqualTypeOf<ComputedStore<number, boolean>>()
    })

    it('rejects selector with wrong input type', () => {
      const source = new Store(42)
      // @ts-expect-error — (s: string) => number is not assignable to Selector<number, number>
      // biome-ignore lint/nursery/noFloatingClasses: ok
      new ComputedStore(source, (s: string) => s.length)
    })
  })

  describe('get', () => {
    it('returns U (derived type)', () => {
      const source = new Store({ count: 0 })
      const derived = new ComputedStore(source, (s) => s.count)
      expectTypeOf(derived.get()).toEqualTypeOf<number>()
    })

    it('returns union types correctly', () => {
      const source = new Store(42)
      const derived = new ComputedStore(source, (n) =>
        n > 0 ? ('positive' as const) : ('non-positive' as const)
      )
      expectTypeOf(derived.get()).toEqualTypeOf<'positive' | 'non-positive'>()
    })
  })

  describe('subscribe', () => {
    it('accepts Subscriber<U> callback', () => {
      const source = new Store([1, 2])
      const derived = new ComputedStore(source, (arr) => arr.length)
      derived.subscribe((state, prevState) => {
        expectTypeOf(state).toEqualTypeOf<number>()
        expectTypeOf(prevState).toEqualTypeOf<number>()
      })
    })

    it('returns an unsubscribe function', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n * 2)
      const unsub = derived.subscribe(() => {})
      expectTypeOf(unsub).toEqualTypeOf<() => void>()
    })

    it('rejects subscriber with wrong parameter type', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n * 2)
      // @ts-expect-error — (s: string) => void is not assignable to Subscriber<number>
      derived.subscribe((_s: string) => {})
    })
  })

  describe('implements SourceStore<U>', () => {
    it('is assignable to SourceStore<U>', () => {
      const source = new Store(42)
      const derived = new ComputedStore(source, (n) => String(n))
      expectTypeOf(derived).toMatchTypeOf<SourceStore<string>>()
    })

    it('is not assignable to SourceStore of wrong type', () => {
      const source = new Store(42)
      const derived = new ComputedStore(source, (n) => String(n))
      expectTypeOf(derived).not.toMatchTypeOf<SourceStore<number>>()
    })
  })

  describe('connect / disconnect', () => {
    it('connect returns void', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n)
      expectTypeOf(derived.connect()).toEqualTypeOf<void>()
    })

    it('disconnect returns void', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n)
      expectTypeOf(derived.disconnect()).toEqualTypeOf<void>()
    })

    it('isConnected is a boolean', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n)
      expectTypeOf(derived.isConnected).toEqualTypeOf<boolean>()
    })
  })

  describe('does not expose internal Store methods', () => {
    it('does not have set method', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n)
      expectTypeOf(derived).not.toHaveProperty('set')
    })

    it('does not have update method', () => {
      const source = new Store(0)
      const derived = new ComputedStore(source, (n) => n)
      expectTypeOf(derived).not.toHaveProperty('update')
    })
  })
})
