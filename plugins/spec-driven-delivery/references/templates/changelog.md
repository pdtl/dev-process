# Changelog

What shipped and why it mattered — **written for someone who will never read the code.**

Written as the work lands, because it cannot be reconstructed later without losing exactly
the thing it is for. Rules in the `task-close` skill; the short version:

- **Lead with the consequence, not the change.** "Editing an event no longer wipes its
  icon", not "added a null check to the icon column".
- **Name the surface, never the file.** No `FR-`, `T`, or `D` identifiers — they belong in
  the other artifacts and mean nothing here.
- **Invisible work gets a `Behind the scenes` note, never silence.** Security patches, data
  retention, test-harness repairs and performance work each get a line saying why they
  matter, not how they work. A log that omits them reads as though nothing was done for
  weeks at a time.
- Every task is **accounted for**; not every task earns its own line.

---

## <Phase name in plain language> — <merge date>

<One sentence on what this phase was for, in the same register.>

- <Consequence-first line.>
- <Consequence-first line.>

*Behind the scenes:* <the infrastructure work, grouped, with why it matters.>
