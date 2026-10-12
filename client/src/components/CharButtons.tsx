const SPECIAL_CHARS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü']

// ä ö ü ß buttons for keyboards without them (e.g. Hungarian ones).
export function CharButtons({ onInsert, disabled }: { onInsert: (c: string) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {SPECIAL_CHARS.map((c) => (
        <button
          key={c}
          type="button"
          // Keep focus (and the phone keyboard) in the input while tapping.
          onMouseDown={(ev) => ev.preventDefault()}
          onClick={() => onInsert(c)}
          disabled={disabled}
          className="size-10 rounded-lg bg-slate-100 text-lg font-medium text-slate-800 hover:bg-indigo-100 disabled:opacity-40 sm:size-8 sm:text-base"
        >
          {c}
        </button>
      ))}
    </div>
  )
}
