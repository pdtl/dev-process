---
name: issue-round
description: The feedback loop for a product that exists and is being used — turn raw hands-on testing notes into a triaged, dispositioned round document, then into a phase of tasks. Capture, triage with evidence, human decides, promote, build, close. Triggers on "review the inbox", "triage these issues", "issue round", "here are my testing notes", "answer the questions and draft a plan", or when the user shares a list of observations from using the product.
---

# Issue round

Once a surface is built and used, hands-on testing produces a different class of input than
any gate: bugs, questions, and "this doesn't match how I think about it". This is the loop
that turns it into planned work without losing the model corrections buried in it.

Complements the spec → plan → tasks pipeline, which covers *new* scope. This covers
feedback on what exists.

| Step | Who | Artifact |
|------|-----|----------|
| 1. Capture | Human | raw notes appended to `docs/issues/inbox.txt` |
| 2. Triage | You | `docs/issues/<YYYY-MM-DD>-round-N.md` |
| 3. Decide | Human | Accept / Defer / Reject per item — **the gate** |
| 4. Promote | You | accepted → tasks; conflicts → decisions; behaviour changes → spec |
| 5. Build | You | normal working agreement |
| 6. Close | You | status per item + **spec disposition**; inbox cleared |

## 1. Capture

Freeform, numbered, untriaged. Questions and bugs mixed freely — sorting them is step 2's
job. **Don't let the human self-censor "is this even a bug" items.** The ambiguous ones are
the most valuable, because they are where the product's model and the user's model diverge,
and that is the one finding no test, review or audit can produce.

The most valuable line in one entire round was an aside: *"this would imply that when you
open a single item, you're not on 'its' page, but a view that happens to contain only it."*
Not a bug report — a model correction, worth a phase-sized refactor, from someone forming a
mental model by using the thing.

## 2. Triage — the round document

Produce `docs/issues/<YYYY-MM-DD>-round-N.md`. Every item gets:

- **ID** — `I<n>`, stable, referenced by the tasks that fix it.
- **Verdict** — exactly one of:
  - **Answer** — it's a question. No code change, or an optional follow-up.
  - **Bug** — behaviour contradicts the spec or obvious intent.
  - **Gap** — a built API or domain with no UI, or a surface never built. Usually already a
    known `D<n>`.
  - **Enhancement** — new or changed behaviour. **Needs a spec amendment.**
  - **Won't do** — with the reason.
- **Evidence** — `file:line`. **Every verdict is traced to code, never inferred from the
  docs.** The docs are what you are checking, not the source of truth.
- **Root cause** — why it behaves that way. Often a deliberate, logged deferral; say which.
- **Conflict** — does the fix collide with an existing architectural or spec decision? See
  the checklist below.
- **Fix + size** — the proposed change, S/M/L.

Then add a section for **items the human didn't file** that fell out of the review: dead
links, unreachable pages, orphaned components. Testing finds what testing finds; code review
finds the rest, and the two sets barely overlap.

Close with a summary table: `ID · Verdict · Size · Conflict · Spec`.

### Conflict checklist

Run every proposed fix past these before writing it up. **This is where a "small UI fix"
turns out to be an architecture change**, and catching it here is the whole point of the
triage step:

- **Identity / routing** — does the fix change what a URL *means*?
- **Access model** — does it touch visibility, share tokens, or the role matrix? Route
  everything through the single source of truth; nothing goes around it.
- **Data model** — does it need a migration, or change what a column means?
- **Spec** — does it change an acceptance criterion? Amend, don't drift.
- **Prior decision** — does it contradict a `D<n>`? Supersede it explicitly.
- **Token layer** — visual changes go through the theme tokens, never component literals.
- **Project-specific rows** — check the project's `docs/README.md` for additions to this
  list; every codebase has two or three of its own.

## 3. Decide — the gate

The human marks each item Accept / Defer / Reject in the round doc. **Nothing is promoted
until this gate passes** — the same human-in-the-loop rule as every pipeline stage.

Items flagged **Conflict** are the ones that actually need judgment. The rest are usually
rubber stamps. Say so, rather than presenting twenty items as equally weighty.

## 4. Promote

Accepted items become a **new phase** in `tasks.md` (`T<phase>.<n>`, with the usual Files /
Refs / Acceptance / Size / Blocks fields), each cross-referenced to its `I<n>`.

- A fix that changes *specified* behaviour **amends `specs.md` in the same change** — never
  silently.
- A fix that takes a shortcut or defers a conflict gets a `D<n>` in `decisions.md` with a
  revisit trigger **and a placeholder task**.

An issue fix is held to exactly the same standard as planned work. The failure mode is
treating feedback as "small stuff" exempt from the paper trail.

## 5–6. Build and close

Normal working agreement — branch per phase, commit per task, `task-close` each one,
`phase-gate` at the end. When the phase merges, mark each item in the round doc with the
task that resolved it, and clear the handled lines out of `inbox.txt`.

### The spec disposition

Every item verdicted **Enhancement** closes with *one of two things* in the summary table's
**Spec** column:

- the `FR-x.y` it amended (`FR-8.1 ✎`), or
- an explicit reason it needed none — **Gap** (the spec already required it; only the UI was
  missing), **below spec altitude** (layout or ordering the spec doesn't legislate), or a
  `D<n>` that consciously defers it.

**An Enhancement closing with a blank Spec cell is not closed.**

This is deliberately a *written* disposition rather than a remembered habit, because every
gate in the working agreement is a **code** gate — nothing mechanical will ever tell you the
spec drifted. The evidence: round 1 amended the spec for 2 of 2 Enhancements and annotated
each inline. Rounds 2 and 3 dropped the annotation and amended 1 of ~4 and 1 of 5. The habit
decayed silently and no one noticed for two rounds.

**Pre-PR smell test:** if the round doc has Enhancement items and `git diff main...HEAD --
docs/specs.md` is empty, confirm each one is a Gap or below spec altitude before opening the
PR.

## After the round: harvest the lessons

When a round is closed, ask the question that produced this whole plugin: **what, in the
process, would have caught these earlier — or prevented them?** Not the bug list, which the
round doc already holds. The practice that would have changed the outcome.

Add each answer to the project's `docs/lessons-learned.md` as a numbered case study: what
happened, why it happened, what to do instead. Then check whether it **generalises beyond
this project** — if so, it belongs in this plugin, under `${CLAUDE_PLUGIN_ROOT}/references/`,
and the case study should name the rule it produced. The plugin README has the promotion path.
