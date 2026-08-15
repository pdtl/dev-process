# The pipeline

Idea → implementation-ready tasks → shipped code, as a sequence of reviewable artifacts.
Each stage produces one Markdown file you can diff, review and commit. **The file is the
deliverable.**

## Philosophy

- **Decide *what* before *how*.** The spec describes behaviour and intent; the plan
  describes the technical approach; tasks describe the work. Keep stack choices out of the
  spec — "semantic search is required" is spec, "use pgvector" is plan.
- **Human-in-the-loop between every stage.** Each skill produces a draft; the human reviews
  and approves before the next stage builds on it. One stage's assumptions must not flow
  silently into the next.
- **Resolve open questions before advancing.** A stage's "open questions" section is a gate.
  Answer them or consciously defer them — a deferral becomes a ledger entry *and* a task.
- **One fact, one place.** A decision lives in exactly one artifact; the others link to it.
  Restating is how documents drift apart.

## Stages

| Stage | Skill | Input | Output | Gate before advancing |
|-------|-------|-------|--------|------------------------|
| 0. Draft | — | Idea, notes, feature outline | `outline.txt` | You can state the core value in one sentence |
| 1. Refine | `spec-refiner` | Draft requirements | `specs.md` (refined, testable) | Open questions answered; scope agreed |
| 1b. Scope | — | Refined spec | `roadmap.md` (v1 / fast-follow / deferred) | The v1 boundary is explicit |
| 2. Architect | `spec-architect` | Solid `specs.md` | `plan.md` (stack, architecture, data model, risks) | You accept the technical approach |
| 3. Break down | `task-breakdowner` | `specs.md` + `plan.md` | `tasks.md` (ordered, testable) | Tasks right-sized and sequenced |
| 4. Build | `task-close`, `phase-gate` | `tasks.md` | Code, tests, PRs | Gates green; phase-boundary ritual walked |
| 5. Review | `issue-round` | A built, used surface | `issues/<date>-round-N.md` | Every item dispositioned |

The arrows are a loop, not a one-way street. Discoveries while architecting or building
send you back to tighten the spec — **update the upstream artifact rather than letting the
docs drift**. A fix that changes specified behaviour amends the spec in the same change.

## Stage 0 — Draft

Capture the idea in whatever form is fastest. Don't polish. What the next stage needs: the
core problem and who it's for, a rough feature list (incomplete is fine), and any hard
constraints you already know.

## Stage 1 — Refine

`spec-refiner` turns vague requirements into a spec an engineer can build without guessing.
It reviews for implementation creep, security and abuse, flow completeness, validation
specificity, error paths, limits, cross-feature interaction, legal, and testability.

**Before advancing:** answer the open questions — these are the judgment calls only you can
make. Then confirm the scope split.

**Two rules that earn their keep:**

- **Every acceptance criterion is binary pass/fail when tested.** Flag vague words — fast,
  intuitive, seamless — and replace with measurable terms.
- **Every acceptance criterion carries a literal example**: `typing "spac" shows "Space
  Race"`. This is not the same rule. A criterion reading *"free-text keyword search over
  name and description"* sounds specific, passed review, and was satisfied by whole-lexeme
  full-text search that returns **nothing** for `spac`. The criterion was met and the
  search box was useless. Plausible-sounding words get interpreted into whatever was easiest
  to build; an input→output pair cannot be.

## Stage 2 — Architect

`spec-architect` produces `plan.md`: stack, architecture, data model, folder/module
structure, risks and trade-offs. Run it only once the spec is solid.

**Before advancing:** accept the stack, data model and major trade-offs, and resolve any
spikes the plan flags — a spike that gates a data-model decision is not optional.

**The plan's folder structure is a commitment, not a sketch.** On one project the plan
correctly specified both a multi-item viewing route and a single-item deep link. The
walking skeleton then built the deep link *as* the viewer, the other route was never
created, and **nobody ever diffed the tree against the plan**. Six phases later the
correction was a phase-sized refactor. This wasn't a decision to build the wrong thing — it
was drift nobody was watching for, which is worse and much easier to prevent. See
`phase-gate`.

## Stage 3 — Break down

`task-breakdowner` decomposes spec + plan into discrete, ordered, independently testable
tasks. Sanity-check sizing and order: each task small enough to implement and verify alone,
the sequence respecting dependencies.

**Slice vertically where you can.** One narrow end-to-end path (create → author → view →
share) beats four complete layers with no path through them. Horizontal slicing — a layer
at a time, UI deferred each time — is how a project ends up with every owner API complete,
verified against a live database, and **no way for a signed-in user to create anything**.
Each deferral was individually rational, individually logged, individually small. Nobody
was watching the aggregate.

If you *do* build API-first, the host page belongs to the same task's acceptance criteria —
or the task ships with a failing checkbox, not a passing one.

## Stage 4 — Build

Work the tasks in order under the working agreement (`references/working-agreement.md`).
Every task closes with `task-close`; every phase boundary runs `phase-gate`.

### The walking skeleton chooses your domain model

A walking skeleton is framed as a *technical* proof (DB → API → render), so it gets
reviewed for wiring — but **the first route you build is a claim about what the product's
objects are**, and every later phase compounds it. When the core noun is a composite ("N
things compared", "a playlist of tracks", "a thread of messages"), make the skeleton
exercise *that*, even if N=1 is all you can render. The singular is a special case of the
plural; retrofitting the plural onto a singular route is not.

Ask before writing it: **which noun owns the URL, and does the spec agree?**

### Model errors have an expiry date

Before launch you can rename tables, move routes and re-home a share model with no aliases,
no redirects and no deprecation window. That option closes permanently at your first
external user. **The moment you notice a model error is the cheapest it will ever be to
fix.** Fix it then, or accept that you have chosen to keep it.

## Stage 5 — Review

Hands-on use produces a different class of input than any gate: bugs, questions, and "this
doesn't match how I think about it". That has its own loop — see the `issue-round` skill.

**Only a user has a mental model to violate.** The single most valuable finding on one
project was an aside during testing: *"this would imply that when you open a single item,
you're not on 'its' page, but a view that happens to contain only it."* That is not a bug
report — it is a model correction, and no code review, test or audit produces one. It came
from someone forming a mental model by using the thing.

Get the product in front of a real user **at the point where the mental model forms** — the
first three clicks — early and repeatedly, not once at the end. The findings that reshape
architecture arrive in the first session, and their cost of adoption climbs with every
phase you wait.

## Artifacts

| File | Stage | Purpose |
|------|-------|---------|
| `outline.txt` | 0 | The original raw idea (kept for provenance) |
| `specs.md` | 1 | Refined, testable functional + non-functional spec (`FR-X.Y`) |
| `roadmap.md` | 1b | v1 / fast-follow / deferred scope split |
| `plan.md` | 2 | Technical architecture, stack, data model, risks |
| `tasks.md` | 3 | Ordered, testable implementation tasks (`T<phase>.<n>`) |
| `decisions.md` | 4 | Ledger of compromises / assumptions / deferrals (`D<n>`) + revisit triggers |
| `changelog.md` | 4 | Plain-language record of what shipped and why it mattered |
| `glossary.md` | 4 | Domain nouns + one-line definitions (see `phase-gate`) |
| `issues/inbox.txt` | 5 | Raw, untriaged testing notes |
| `issues/<date>-round-N.md` | 5 | A triaged round: verdict, evidence, conflicts, plan per item |
| `lessons-learned.md` | 5 | What the review rounds taught you about the *process* |
| `design-spec.md` | — | The visual decisions (tokens, type scale) — see `visual-pass` |
| `CLAUDE.md` | — | Orientation for an agent starting a session |

Conventions: **numbering is stable** (`FR-X.Y` referenced by plan and tasks, so traceability
survives edits); **one fact, one place**; **branch + commit per stage**.

## The changelog is written as the work lands

Ticking the box is not the last step; adding a line to `changelog.md` is. It is the only
artifact aimed at someone who will never read the code, and it **cannot be reconstructed
later** without losing exactly the thing it is for — why the change mattered to a person
using the product.

- **Register:** halfway between release notes and an engineering summary. Name the surface
  ("the event editor"), never the file. Avoid identifiers — `FR-7.1`, `T24.1`, `D91` mean
  nothing here and belong in the other artifacts.
- **Lead with the consequence, not the change.** Not "added a null check to the icon
  column", but "editing an event no longer wipes its icon". If a task has no consequence
  you can state in that form, it is probably infrastructure — see below.
- **Invisible work gets a `Behind the scenes` note, never silence.** Security patches, data
  retention, test-harness repairs and performance work are most of what keeps a product
  trustworthy, and a log that omits them reads as though nothing was done for weeks.
- **Grouping:** by phase, newest first, under a plain-language heading and the merge date.
  A phase that is all scaffolding gets one `Behind the scenes` paragraph rather than a
  bullet per task. Every task is *accounted for*; not every task earns a line.
- **Not in it:** rationale for a compromise (`decisions.md`), acceptance criteria
  (`tasks.md`), process lessons (`lessons-learned.md`). If an entry is getting long, the
  length belongs in one of those three.

## Keeping `CLAUDE.md` lean

`CLAUDE.md` is the one artifact with a *per-session* cost: every word is re-read on every
run, relevant or not. That makes it the artifact most worth pruning and the easiest to let
sprawl — appending a paragraph per task feels like diligence, and the bloat is invisible to
the person appending it.

On one project the status section reached **1,113 lines, 94% of the file**, restating detail
that `tasks.md`, `decisions.md` and `git log` already held. It had also gone **stale** —
length and accuracy fail together, because nobody edits a wall of prose.

The rule is just "one fact, one place" applied to the file that pays for duplication:

- **It answers four questions**: what is this · where do I look · what constrains the code ·
  what will bite me. Anything else belongs in a `docs/` artifact.
- **Finishing a task does not add to it.** A task may add at most a line to **Gotchas** (a
  trap the next session will hit) or **Key conventions** (a rule that binds future code) —
  and if `decisions.md` already says it, link `D<n>` instead of restating it.
- **A phase merge edits one status row.** Status is a ledger of *where we are*, not a record
  of how we got here.
- **Budget it: ≤ ~200 lines.** Over budget is a signal to prune, not to keep a longer file.
- **Prune at each phase boundary.** If a line now merely describes how the product works,
  delete it — the code and the spec are the truth, and a description that drifts is worse
  than none.

## Quick-start for a fresh project

Run the `project-bootstrap` skill, or by hand:

1. Write a rough `outline.txt` (problem, users, features, hard constraints).
2. `spec-refiner` → review → answer open questions → finalise `specs.md`.
3. (Optional) `roadmap.md` to lock the v1 boundary.
4. Commit the spec on a branch; push.
5. `spec-architect` → review → finalise `plan.md`; resolve flagged spikes.
6. `task-breakdowner` → review sizing and order → finalise `tasks.md`.
7. Adopt `references/working-agreement.md`; seed `decisions.md`, `changelog.md`,
   `glossary.md` and `issues/inbox.txt` empty.
8. Build. Close every task with `task-close`; end every phase with `phase-gate`.
