export default function HomePage() {
  return (
    <section
      data-testid="hero"
      className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-24 md:py-32"
    >
      <h1 className="font-serif text-4xl leading-tight text-ink-0 md:text-5xl">Pantheon</h1>
      <p className="font-serif text-lg leading-relaxed text-ink-1 md:text-xl">
        The seasons, ranked. No spoilers.
      </p>
      <p className="max-w-prose text-base text-ink-2">
        A spoiler-free home for ranked TV seasons. Editor&rsquo;s Canon and Community Rank side by side.
        Substrate is up; show pages land in the next phases.
      </p>
    </section>
  )
}
