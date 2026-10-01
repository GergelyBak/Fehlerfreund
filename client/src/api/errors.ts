import { ApiError, SERVER_UNREACHABLE } from './client'

const UNREACHABLE = 'Nem érem el a szervert. Ellenőrizd, hogy fut-e a backend (cd server → npm run dev).'

// The API answers in English; the UI speaks Hungarian.
const MESSAGES: Record<string, string> = {
  [SERVER_UNREACHABLE]: UNREACHABLE,
  'Invalid email or password': 'Hibás e-mail-cím vagy jelszó.',
  'Email already registered': 'Ezzel az e-mail-címmel már regisztráltak.',
  'Too many attempts, try again later': 'Túl sok próbálkozás. Próbáld újra negyedóra múlva.',
  'Validation failed': 'Ellenőrizd a kiemelt mezőket.',
  'Reset link is invalid or has expired': 'Ez a link érvénytelen vagy lejárt. Kérj egy újat.',
  'Not authenticated': 'Lejárt a munkamenet, jelentkezz be újra.',
  'Invalid or expired session': 'Lejárt a munkamenet, jelentkezz be újra.',
  'Conversation not found': 'Ez a beszélgetés nem található.',
  'Card not found': 'Ez a kártya már nem létezik.',
  'Topic not found': 'Ez a témakör nem található.',
  'Unknown error type': 'Ismeretlen hibatípus.',
  'Translation failed, please try again': 'Nem sikerült lefordítani, próbáld újra.',
  'Message not found': 'Ez az üzenet nem található.',
  'This conversation is full, start a new one': 'Ez a beszélgetés megtelt, kezdj egy újat.',
  'Too many messages per minute, slow down a little': 'Túl sok üzenet egy perc alatt, lassíts egy kicsit.',
  'Daily practice limit reached, come back tomorrow': 'Elérted a mai gyakorlási keretet, holnap folytathatod.',
  "The conversation partner couldn't answer, please try again":
    'A beszélgetőtárs most nem tudott válaszolni, próbáld újra.',
  'Saving the conversation failed': 'Nem sikerült menteni a beszélgetést.',
}

export function errorMessage(err: unknown, fallback = 'Valami hiba történt, próbáld újra.') {
  if (err instanceof ApiError) return MESSAGES[err.message] ?? fallback
  // fetch throws TypeError when the server can't be reached at all.
  if (err instanceof TypeError) return UNREACHABLE
  return fallback
}
