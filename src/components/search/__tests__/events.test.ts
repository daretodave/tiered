import { afterEach, describe, expect, it, vi } from 'vitest'

import * as eventsModule from '../events'
import { SEARCH_OPEN_EVENT, dispatchSearchOpen } from '../events'

const EXPECTED_RUNTIME_KEYS = [
  'SEARCH_OPEN_EVENT',
  'dispatchSearchOpen',
] as const

describe('@/components/search/events — module surface', () => {
  it('SEARCH_OPEN_EVENT pins the exact wire name "tiered:search-open"', () => {
    // The string is the contract between dispatch site (SearchTrigger)
    // and listener site (SearchHost). A drift to 'tiered:search:open'
    // or any rename silently severs both consumers — locked here so
    // it must be reviewed.
    expect(SEARCH_OPEN_EVENT).toBe('tiered:search-open')
  })

  it('SEARCH_OPEN_EVENT is a string primitive (not a Symbol or object)', () => {
    expect(typeof SEARCH_OPEN_EVENT).toBe('string')
  })

  it('dispatchSearchOpen is a function', () => {
    expect(typeof dispatchSearchOpen).toBe('function')
  })

  it('exposes exactly the documented exports, nothing more, nothing less', () => {
    const keys = Object.keys(eventsModule).sort()
    expect(keys).toEqual([...EXPECTED_RUNTIME_KEYS].sort())
  })

  it('exports nothing besides the 2 documented symbols (no helpers, no constants)', () => {
    const documented = new Set<string>(EXPECTED_RUNTIME_KEYS)
    const extras = Object.keys(eventsModule).filter((k) => !documented.has(k))
    expect(extras).toEqual([])
  })
})

describe('@/components/search/events — dispatchSearchOpen behavior', () => {
  const windowListeners: Array<[string, EventListener]> = []
  const documentListeners: Array<[string, EventListener]> = []

  function onWindow(handler: EventListener) {
    window.addEventListener(SEARCH_OPEN_EVENT, handler)
    windowListeners.push([SEARCH_OPEN_EVENT, handler])
  }

  function onDocument(handler: EventListener) {
    document.addEventListener(SEARCH_OPEN_EVENT, handler)
    documentListeners.push([SEARCH_OPEN_EVENT, handler])
  }

  afterEach(() => {
    for (const [name, fn] of windowListeners) {
      window.removeEventListener(name, fn)
    }
    for (const [name, fn] of documentListeners) {
      document.removeEventListener(name, fn)
    }
    windowListeners.length = 0
    documentListeners.length = 0
  })

  it('dispatches a single event per call to a window listener', () => {
    const listener = vi.fn()
    onWindow(listener)
    dispatchSearchOpen()
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('dispatches a CustomEvent instance (not a plain Event)', () => {
    const received: Event[] = []
    onWindow((ev) => {
      received.push(ev)
    })
    dispatchSearchOpen()
    expect(received).toHaveLength(1)
    const [event] = received
    expect(event).toBeInstanceOf(CustomEvent)
    // CustomEvent extends Event — the inheritance check is a belt-and-
    // braces lock against a future refactor that defines a custom class
    // not in the Event hierarchy.
    expect(event).toBeInstanceOf(Event)
  })

  it('the dispatched event.type matches SEARCH_OPEN_EVENT', () => {
    const received: Event[] = []
    onWindow((ev) => {
      received.push(ev)
    })
    dispatchSearchOpen()
    expect(received).toHaveLength(1)
    const [event] = received
    expect(event?.type).toBe(SEARCH_OPEN_EVENT)
    expect(event?.type).toBe('tiered:search-open')
  })

  it('the dispatched CustomEvent carries no detail payload (current no-payload contract)', () => {
    // Locks today's no-payload contract: dispatchSearchOpen() takes no
    // args and sends no detail. A future opt-in to a typed `detail` is
    // a breaking change for any consumer that starts reading it; failing
    // this test is the signal to update the typed contract in lockstep.
    const received: CustomEvent[] = []
    onWindow((ev) => {
      received.push(ev as CustomEvent)
    })
    dispatchSearchOpen()
    expect(received).toHaveLength(1)
    const [event] = received
    // CustomEvent.detail is `null` when constructed with no `detail` in
    // the init dict; the explicit assertion against null pins the
    // platform-default contract (vs. undefined / vs. an object that
    // would slip past a truthiness check).
    expect(event?.detail).toBeNull()
  })

  it('returns undefined (void contract — callers must not rely on a return value)', () => {
    // Locks the documented `: void` return type at runtime — catches a
    // future refactor that returns the event object or a boolean "did
    // dispatch succeed" that callers would start relying on.
    const result = dispatchSearchOpen()
    expect(result).toBeUndefined()
  })

  it('multiple consecutive calls each fire exactly once (no batching, no extras)', () => {
    const listener = vi.fn()
    onWindow(listener)
    dispatchSearchOpen()
    dispatchSearchOpen()
    dispatchSearchOpen()
    expect(listener).toHaveBeenCalledTimes(3)
  })

  it('does NOT dispatch on document — only window listeners catch it', () => {
    // SearchHost listens on window; a regression that swaps the dispatch
    // target to document would silently break every search-trigger click
    // across the chrome. The dual check (window fires, document doesn't)
    // pins the target explicitly.
    const winListener = vi.fn()
    const docListener = vi.fn()
    onWindow(winListener)
    onDocument(docListener)
    dispatchSearchOpen()
    expect(winListener).toHaveBeenCalledTimes(1)
    expect(docListener).not.toHaveBeenCalled()
  })
})
