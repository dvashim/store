import { describe, expect, it } from 'vitest'
import { createStore } from '@/createStore'
import { Store } from '@/Store'

describe('createStore', () => {
  describe('with initial state', () => {
    it('creates a Store instance', () => {
      const store = createStore(0)
      expect(store).toBeInstanceOf(Store)
    })

    it('initializes with the given primitive value', () => {
      expect(createStore(42).get()).toBe(42)
      expect(createStore('hello').get()).toBe('hello')
      expect(createStore(true).get()).toBe(true)
      expect(createStore(null).get()).toBeNull()
    })

    it('initializes with an object', () => {
      const obj = { a: 1, b: [2, 3] }
      const store = createStore(obj)
      expect(store.get()).toBe(obj)
    })

    it('initializes with undefined passed explicitly', () => {
      const store = createStore(undefined)
      expect(store.get()).toBeUndefined()
    })
  })

  describe('without initial state', () => {
    it('creates a Store with undefined state', () => {
      const store = createStore()
      expect(store).toBeInstanceOf(Store)
      expect(store.get()).toBeUndefined()
    })

    it('allows setting state after creation', () => {
      const store = createStore<number>()
      store.set(42)
      expect(store.get()).toBe(42)
    })

    it('allows updating state after creation', () => {
      const store = createStore<string>()
      store.set('hello')
      store.update((prev) => `${prev} world`)
      expect(store.get()).toBe('hello world')
    })
  })

  describe('store functionality', () => {
    it('returned store supports subscribe/set cycle', () => {
      const store = createStore(0)
      const values: number[] = []
      store.subscribe(() => values.push(store.get()))
      store.set(1)
      store.set(2)
      expect(values).toEqual([1, 2])
    })

    it('returned store supports update', () => {
      const store = createStore(10)
      store.update((v) => v * 2)
      expect(store.get()).toBe(20)
    })
  })
})
