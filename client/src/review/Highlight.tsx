// Renders `sentence` with the first occurrence of `fragment` emphasised.
export function Highlight({ sentence, fragment, className }: { sentence: string; fragment: string; className: string }) {
  const at = fragment ? sentence.indexOf(fragment) : -1
  if (at === -1) return <>{sentence}</>
  return (
    <>
      {sentence.slice(0, at)}
      <mark className={`rounded px-0.5 ${className}`}>{fragment}</mark>
      {sentence.slice(at + fragment.length)}
    </>
  )
}
