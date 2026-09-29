// Tiny pub/sub so the nav badge refreshes when cards are added or reviewed,
// without a global store.
const EVENT = 'fehlerfreund:cards-changed'

export function notifyCardsChanged() {
  window.dispatchEvent(new Event(EVENT))
}

export function onCardsChanged(listener: () => void) {
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}
