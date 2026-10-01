import type { ErrorType } from '../chat/types'

// Hungarian names for the error categories, with the German term kept as the
// "official" name the learner also meets in corrections and cards.
export const ERROR_LABELS: Record<ErrorType, { hu: string; hint: string }> = {
  Kasus: { hu: 'Esetek', hint: 'Nominativ, Akkusativ, Dativ: mikor melyik kell' },
  Artikel: { hu: 'Névelő', hint: 'der, die, das, és hogy kell-e névelő' },
  Wortstellung: { hu: 'Szórend', hint: 'Hová kerül az ige a mondatban' },
  Verbkonjugation: { hu: 'Igeragozás', hint: 'Az ige alakja személy szerint' },
  Tempus: { hu: 'Igeidő', hint: 'Perfekt, Präteritum, haben vagy sein' },
  Präposition: { hu: 'Elöljárószó', hint: 'Melyik elöljáró illik ide' },
  Adjektivdeklination: { hu: 'Melléknév', hint: 'Végződések és fokozás' },
  Rechtschreibung: { hu: 'Helyesírás', hint: 'Elírás, nagybetűs főnév' },
  Wortwahl: { hu: 'Szóhasználat', hint: 'Rossz szó vagy kifejezés' },
  Sonstiges: { hu: 'Egyéb', hint: 'Más típusú hiba' },
}
