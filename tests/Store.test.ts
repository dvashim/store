import { describe, expect, it, vi } from 'vitest'
import { Store } from '@/Store'

describe('Store', () => {
  describe('constructor', () => {
    it('initializes with the given state', () => {
      const store = new Store(42)
      expect(store.get()).toBe(42)
    })

    it('accepts undefined as initial state', () => {
      const store = new Store<number | undefined>(undefined)
      expect(store.get()).toBeUndefined()
    })

    it('accepts null as initial state', () => {
      const store = new Store<string | null>(null)
      expect(store.get()).toBeNull()
    })

    it('preserves object reference identity', () => {
      const obj = { a: 1, b: [2, 3] }
      const store = new Store(obj)
      expect(store.get()).toBe(obj)
    })
  })

  describe('get', () => {
    it('returns the current state', () => {
      const store = new Store('hello')
      expect(store.get()).toBe('hello')
    })

    it('reflects the latest state after set', () => {
      const store = new Store(0)
      store.set(5)
      expect(store.get()).toBe(5)
    })

    it('reflects the latest state after update', () => {
      const store = new Store(0)
      store.update((v) => v + 10)
      expect(store.get()).toBe(10)
    })
  })

  describe('set', () => {
    it('updates the state', () => {
      const store = new Store(1)
      store.set(2)
      expect(store.get()).toBe(2)
    })

    it('notifies subscribers on state change', () => {
      const store = new Store(0)
      const fn = vi.fn()
      store.subscribe(fn)
      store.set(1)
      expect(fn).toHaveBeenCalledOnce()
    })

    it('skips notification when value is identical (Object.is)', () => {
      const store = new Store(1)
      const fn = vi.fn()
      store.subscribe(fn)
      store.set(1)
      expect(fn).not.toHaveBeenCalled()
    })

    it('skips notification for same object reference', () => {
      const obj = { x: 1 }
      const store = new Store(obj)
      const fn = vi.fn()
      store.subscribe(fn)
      store.set(obj)
      expect(fn).not.toHaveBeenCalled()
    })

    it('notifies for different object with same shape', () => {
      const store = new Store({ x: 1 })
      const fn = vi.fn()
      store.subscribe(fn)
      store.set({ x: 1 })
      expect(fn).toHaveBeenCalledOnce()
    })

    it('distinguishes +0 and -0', () => {
      const store = new Store(0)
      const fn = vi.fn()
      store.subscribe(fn)
      store.set(-0)
      expect(fn).toHaveBeenCalledOnce()
    })

    it('treats NaN as equal to NaN', () => {
      const store = new Store(Number.NaN)
      const fn = vi.fn()
      store.subscribe(fn)
      store.set(Number.NaN)
      expect(fn).not.toHaveBeenCalled()
    })

    it('notifies when force is true even if value is identical', () => {
      const store = new Store(1)
      const fn = vi.fn()
      store.subscribe(fn)
      store.set(1, { force: true })
      expect(fn).toHaveBeenCalledOnce()
    })

    it('does not notify without subscribers', () => {
      const store = new Store(0)
      store.set(1)
      expect(store.get()).toBe(1)
    })

    it('handles multiple sequential sets', () => {
      const store = new Store(0)
      const calls: number[] = []
      store.subscribe(() => calls.push(store.get()))
      store.set(1)
      store.set(2)
      store.set(3)
      expect(calls).toEqual([1, 2, 3])
      expect(store.get()).toBe(3)
    })
  })

  describe('update', () => {
    it('derives next state from current state', () => {
      const store = new Store(10)
      store.update((prev) => prev + 5)
      expect(store.get()).toBe(15)
    })

    it('notifies subscribers', () => {
      const store = new Store(0)
      const fn = vi.fn()
      store.subscribe(fn)
      store.update((prev) => prev + 1)
      expect(fn).toHaveBeenCalledOnce()
    })

    it('skips notification when updater returns identical value', () => {
      const store = new Store(1)
      const fn = vi.fn()
      store.subscribe(fn)
      store.update((prev) => prev)
      expect(fn).not.toHaveBeenCalled()
    })

    it('notifies with force even when updater returns identical value', () => {
      const store = new Store(1)
      const fn = vi.fn()
      store.subscribe(fn)
      store.update((prev) => prev, { force: true })
      expect(fn).toHaveBeenCalledOnce()
    })

    it('chains updates correctly', () => {
      const store = new Store(0)
      store.update((v) => v + 1)
      store.update((v) => v * 10)
      store.update((v) => v - 5)
      expect(store.get()).toBe(5)
    })

    it('receives the latest state in each updater', () => {
      const store = new Store(0)
      const received: number[] = []
      store.update((v) => {
        received.push(v)
        return 10
      })
      store.update((v) => {
        received.push(v)
        return 20
      })
      expect(received).toEqual([0, 10])
    })
  })

  describe('subscribe', () => {
    it('returns an unsubscribe function', () => {
      const store = new Store(0)
      const fn = vi.fn()
      const unsub = store.subscribe(fn)
      unsub()
      store.set(1)
      expect(fn).not.toHaveBeenCalled()
    })

    it('supports multiple subscribers', () => {
      const store = new Store(0)
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      store.subscribe(fn1)
      store.subscribe(fn2)
      store.set(1)
      expect(fn1).toHaveBeenCalledOnce()
      expect(fn2).toHaveBeenCalledOnce()
    })

    it('notifies subscribers in registration order', () => {
      const store = new Store(0)
      const order: string[] = []
      store.subscribe(() => order.push('A'))
      store.subscribe(() => order.push('B'))
      store.subscribe(() => order.push('C'))
      store.set(1)
      expect(order).toEqual(['A', 'B', 'C'])
    })

    it('handles unsubscribe during notification (snapshot iteration)', () => {
      const store = new Store(0)
      const fn2 = vi.fn()
      let unsub2: () => void

      store.subscribe(() => {
        unsub2()
      })
      unsub2 = store.subscribe(fn2)

      store.set(1)
      // fn2 still called because subscribers are snapshot before iteration
      expect(fn2).toHaveBeenCalledOnce()

      fn2.mockClear()
      store.set(2)
      // fn2 no longer subscribed
      expect(fn2).not.toHaveBeenCalled()
    })

    it('handles subscribe during notification (snapshot iteration)', () => {
      const store = new Store(0)
      const lateFn = vi.fn()

      store.subscribe(() => {
        store.subscribe(lateFn)
      })

      store.set(1)
      // lateFn not in snapshot for this notification
      expect(lateFn).not.toHaveBeenCalled()

      store.set(2)
      // now it's subscribed
      expect(lateFn).toHaveBeenCalledOnce()
    })

    it('deduplicates the same function reference (Set-based)', () => {
      const store = new Store(0)
      const fn = vi.fn()
      store.subscribe(fn)
      store.subscribe(fn)
      store.set(1)
      expect(fn).toHaveBeenCalledOnce()
    })

    it('allows resubscribing after unsubscribe', () => {
      const store = new Store(0)
      const fn = vi.fn()
      const unsub = store.subscribe(fn)
      unsub()
      store.subscribe(fn)
      store.set(1)
      expect(fn).toHaveBeenCalledOnce()
    })

    it('unsubscribe is idempotent', () => {
      const store = new Store(0)
      const fn = vi.fn()
      const unsub = store.subscribe(fn)
      unsub()
      unsub()
      store.set(1)
      expect(fn).not.toHaveBeenCalled()
    })
  })

  describe('re-entrant updates', () => {
    it('queues re-entrant set() and flushes in FIFO order', () => {
      const store = new Store(0)
      const calls: string[] = []

      store.subscribe(() => {
        calls.push(`A:${store.get()}`)
        if (store.get() === 1) {
          store.set(2)
        }
      })

      store.subscribe(() => {
        calls.push(`B:${store.get()}`)
      })

      store.set(1)

      // All subscribers see state=1 first, then state=2
      expect(calls).toEqual(['A:1', 'B:1', 'A:2', 'B:2'])
    })

    it('handles ping-pong updates without infinite recursion', () => {
      const store = new Store(0)
      const calls: number[] = []

      store.subscribe(() => {
        const v = store.get()
        calls.push(v)
        if (v < 5) {
          store.set(v + 1)
        }
      })

      store.set(1)
      expect(calls).toEqual([1, 2, 3, 4, 5])
    })

    it('all subscribers see every intermediate state', () => {
      const store = new Store('a')
      const bValues: string[] = []

      store.subscribe(() => {
        if (store.get() === 'a') {
          store.set('b')
        }
      })

      store.subscribe(() => {
        bValues.push(store.get())
      })

      store.set('a', { force: true })
      expect(bValues).toEqual(['a', 'b'])
    })

    it('re-entrant update() reads latest state', () => {
      const store = new Store(0)

      store.subscribe(() => {
        if (store.get() === 1) {
          store.update((v) => v + 10)
        }
      })

      store.set(1)
      expect(store.get()).toBe(11)
    })

    it('deeply nested re-entrant calls drain correctly', () => {
      const store = new Store('')
      const calls: string[] = []

      store.subscribe(() => {
        const v = store.get()
        calls.push(v)
        if (v === 'a') {
          store.set('b')
        }
        if (v === 'b') {
          store.set('c')
        }
      })

      store.set('a')
      expect(calls).toEqual(['a', 'b', 'c'])
      expect(store.get()).toBe('c')
    })
  })

  describe('error handling', () => {
    it('continues notifying other subscribers when one throws', () => {
      const store = new Store(0)
      const fn2 = vi.fn()

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      store.subscribe(() => {
        throw new Error('boom')
      })
      store.subscribe(fn2)
      store.set(1)

      expect(fn2).toHaveBeenCalledOnce()
      expect(consoleSpy).toHaveBeenCalledOnce()
      expect(consoleSpy).toHaveBeenCalledWith('Error in subscriber:', expect.any(Error))
      consoleSpy.mockRestore()
    })

    it('logs errors for multiple throwing subscribers', () => {
      const store = new Store(0)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      store.subscribe(() => {
        throw new Error('one')
      })
      store.subscribe(() => {
        throw new Error('two')
      })
      store.set(1)

      expect(consoleSpy).toHaveBeenCalledTimes(2)
      consoleSpy.mockRestore()
    })

    it('state is still updated even when subscribers throw', () => {
      const store = new Store(0)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      store.subscribe(() => {
        throw new Error('boom')
      })
      store.set(42)

      expect(store.get()).toBe(42)
      consoleSpy.mockRestore()
    })

    it('propagates updater errors to the caller', () => {
      const store = new Store(0)
      expect(() => {
        store.update(() => {
          throw new Error('updater error')
        })
      }).toThrow('updater error')
    })

    it('preserves state when updater throws', () => {
      const store = new Store(42)
      try {
        store.update(() => {
          throw new Error('fail')
        })
      } catch {}
      expect(store.get()).toBe(42)
    })

    it('remains functional after updater throws', () => {
      const store = new Store(0)
      const fn = vi.fn()
      store.subscribe(fn)

      try {
        store.update(() => {
          throw new Error('fail')
        })
      } catch {}

      store.set(1)
      expect(store.get()).toBe(1)
      expect(fn).toHaveBeenCalledOnce()
    })

    it('clears queue when updater throws', () => {
      const store = new Store(0)
      const calls: number[] = []

      store.subscribe(() => {
        calls.push(store.get())
      })

      // First set succeeds and queues a re-entrant update
      store.subscribe(() => {
        if (store.get() === 1) {
          store.set(99) // queued
        }
      })

      store.set(1)
      // Subscriber 1 sees 1, subscriber 2 queues 99, then subscriber 1 sees 99
      expect(calls).toEqual([1, 99])

      calls.length = 0

      // Now test that a throwing updater clears the queue
      try {
        store.update(() => {
          throw new Error('fail')
        })
      } catch {}

      store.set(10)
      expect(store.get()).toBe(10)
      expect(calls).toEqual([10])
    })

    it('handles non-Error thrown values', () => {
      const store = new Store(0)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      store.subscribe(() => {
        // biome-ignore lint: testing non-Error thrown values
        throw 'string error'
      })
      store.set(1)

      expect(consoleSpy).toHaveBeenCalledWith('Error in subscriber:', 'string error')
      consoleSpy.mockRestore()
    })
  })
})
