// Compares a sentence the learner should say with what speech recognition
// heard, word by word. Pure, so it's unit-tested.

export interface WordMatch {
  word: string // as written in the target sentence
  ok: boolean
}

// Recognizers write small numbers as digits ("2 Brüder"), the sentences as
// words, or the other way round; both sides are mapped to digits.
const NUMBER_WORDS: Record<string, string> = {
  null: '0', eins: '1', ein: '1', eine: '1', zwei: '2', drei: '3', vier: '4', fünf: '5', sechs: '6',
  sieben: '7', acht: '8', neun: '9', zehn: '10', elf: '11', zwölf: '12', zwanzig: '20', dreißig: '30',
  hundert: '100', tausend: '1000',
}

/** Lower case, no punctuation, ß → ss; number words become digits. */
export function normalizeWord(word: string) {
  const w = word
    .toLowerCase()
    .replace(/[.,!?;:"„“”'’()–-]/g, '')
    .trim()
  const n = NUMBER_WORDS[w] ?? w
  return n.replace(/ß/g, 'ss')
}

const words = (text: string) => text.split(/\s+/).filter((w) => normalizeWord(w) !== '')

/**
 * Marks each word of the target as said or not, using the longest common
 * subsequence: word order matters, but one missed word doesn't make every
 * following word count as wrong.
 */
export function compareWords(target: string, heard: string): { words: WordMatch[]; score: number } {
  const t = words(target)
  const h = words(heard).map(normalizeWord)
  const tn = t.map(normalizeWord)
  // lcs[i][j] = longest common subsequence of tn[i..] and h[j..]
  const lcs = Array.from({ length: tn.length + 1 }, () => new Array<number>(h.length + 1).fill(0))
  for (let i = tn.length - 1; i >= 0; i--) {
    for (let j = h.length - 1; j >= 0; j--) {
      lcs[i]![j] = tn[i] === h[j] ? lcs[i + 1]![j + 1]! + 1 : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!)
    }
  }
  const ok = new Array<boolean>(tn.length).fill(false)
  for (let i = 0, j = 0; i < tn.length && j < h.length; ) {
    if (tn[i] === h[j]) {
      ok[i] = true
      i++
      j++
    } else if (lcs[i + 1]![j]! >= lcs[i]![j + 1]!) i++
    else j++
  }
  const matched = ok.filter(Boolean).length
  return { words: t.map((word, i) => ({ word, ok: ok[i]! })), score: t.length ? matched / t.length : 0 }
}

/** Recognizers return several guesses; the learner gets the best one. */
export function bestMatch(target: string, alternatives: string[]) {
  const results = alternatives.map((heard) => ({ heard, ...compareWords(target, heard) }))
  return results.sort((a, b) => b.score - a.score)[0] ?? { heard: '', ...compareWords(target, '') }
}
