/** Inserts a character at the cursor of an input and keeps the cursor after it. */
export function insertAtCursor(el: HTMLInputElement | undefined, value: string, char: string, set: (v: string) => void) {
  const start = el?.selectionStart ?? value.length
  const end = el?.selectionEnd ?? value.length
  set(value.slice(0, start) + char + value.slice(end))
  requestAnimationFrame(() => {
    el?.focus()
    el?.setSelectionRange(start + 1, start + 1)
  })
}
