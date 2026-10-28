import { describe, expect, it } from 'vitest'
import { bestMatch, compareWords, normalizeWord } from './compareWords'

const okWords = (target: string, heard: string) =>
  compareWords(target, heard)
    .words.filter((w) => w.ok)
    .map((w) => w.word)

describe('normalizeWord', () => {
  it('ignores case, punctuation and ß/ss', () => {
    expect(normalizeWord('Straße,')).toBe('strasse')
    expect(normalizeWord('„Hallo!“')).toBe('hallo')
  })

  it('treats number words and digits alike', () => {
    expect(normalizeWord('zwei')).toBe(normalizeWord('2'))
    expect(normalizeWord('Zwölf')).toBe('12')
  })
})

describe('compareWords', () => {
  it('scores a perfect reading 100%', () => {
    const r = compareWords('Ich esse einen Apfel.', 'ich esse einen Apfel')
    expect(r.score).toBe(1)
    expect(r.words.every((w) => w.ok)).toBe(true)
  })

  it('marks only the misheard word', () => {
    const r = compareWords('Ich habe zwei Brüder.', 'ich habe zwei Bruder')
    expect(okWords('Ich habe zwei Brüder.', 'ich habe zwei Bruder')).toEqual(['Ich', 'habe', 'zwei'])
    expect(r.score).toBe(0.75)
  })

  it('does not punish every word after a missed one', () => {
    // "gerne" is missing, the rest is still right.
    expect(okWords('Ich trinke sehr gerne Kaffee.', 'ich trinke sehr Kaffee')).toEqual(['Ich', 'trinke', 'sehr', 'Kaffee.'])
  })

  it('accepts digits for number words', () => {
    expect(compareWords('Ich habe zwei Brüder.', 'ich habe 2 Brüder').score).toBe(1)
  })

  it('ignores extra words the recognizer adds', () => {
    expect(compareWords('Guten Morgen!', 'ja guten Morgen').score).toBe(1)
  })

  it('handles nothing heard', () => {
    const r = compareWords('Guten Tag.', '')
    expect(r.score).toBe(0)
    expect(r.words.map((w) => w.ok)).toEqual([false, false])
  })
})

describe('bestMatch', () => {
  it('picks the alternative that matches best', () => {
    const r = bestMatch('Wo ist der Bahnhof?', ['wo ist der Bahn Hof', 'wo ist der Bahnhof'])
    expect(r.heard).toBe('wo ist der Bahnhof')
    expect(r.score).toBe(1)
  })
})
