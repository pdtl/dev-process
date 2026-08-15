<!-- TEMPLATE. Replace every <angle-bracket> placeholder. Delete this comment.
     Budget: ~200 lines. It is loaded into EVERY session, so length taxes all of them.
     It answers four questions: what is this · where do I look · what constrains the
     code · what will bite me. Anything else belongs in docs/. -->

# CLAUDE.md — <Project name>

<One or two sentences: what this is and who it's for. The value, not the stack.>

Built spec-first; the planning docs in `docs/` are authoritative. The *method* itself lives
in the `spec-driven-delivery` plugin, not in this repo — see `docs/README.md`.

## Read these first

- `docs/specs.md` — refined functional + non-functional spec (`FR-X.Y`).
- `docs/plan.md` — architecture, stack, data model, risks.
- `docs/roadmap.md` — v1 / fast-follow / deferred scope.
- `docs/tasks.md` — **ordered task list with checkboxes; the source of truth for what's done
  vs. next.**
- `docs/decisions.md` — **ledger of compromises / assumptions / deferrals and their revisit
  triggers.** Add to it whenever you make one.
- `docs/changelog.md` — plain-language record of what shipped and why it mattered. **Every
  task adds to it.**
- `docs/lessons-learned.md` — what the review rounds taught us. **Read before a new phase.**
- `docs/README.md` — the artifact map and this project's process deltas.

## Current status

**<Where we are in one or two sentences.>** <Which phases are done, what's open.>

Look things up rather than reading a log here: `docs/tasks.md` is the source of truth for
what's done vs. next, `docs/decisions.md` records every compromise with its revisit trigger,
and `git log` has the diffs.

<!-- A phase merge edits ONE row/sentence here. Prune anything that has become a
     description of how the product works — that belongs in the code or the spec. -->

## Dev environment

<The minimum to get running: prerequisites, the processes that must run together, and
anything non-obvious about their relationship. Point at a runbook for the rest.>

Teardown, reset, service URLs and troubleshooting: `docs/operations/dev-runbook.md`.

## Working agreement

- **One branch + PR per phase, one commit per task.** Push after every task commit; the PR
  opens at phase end.
- **Every task leaves `<build>`, `<test>`, `<lint>`, `<typecheck>`, `<format:check>` green**
  — by exit code, never piped through `tail`.
- **`<e2e>` and `<integration>` run before the phase's PR.** Too slow per task; skipping them
  entirely is how a phase merges with specs red.
- **Hybrid TDD:** test-first at the risk centres (<name them: permissions, date math,
  concurrency, auth>); tests inline elsewhere.
- Close each task with the `task-close` skill; end each phase with `phase-gate`.
- **Log every compromise or deferral in `docs/decisions.md` as you make it**, with a revisit
  trigger *and* a placeholder task.
- **Keep this file ≤ ~200 lines.** Completing a task changes `docs/tasks.md` and
  `docs/decisions.md` — it does not earn a paragraph here. A task may add at most one line
  to **Gotchas** or **Key conventions**, and if `decisions.md` already says it, link `D<n>`.

## Key conventions & decisions

<Rules that constrain future code. Each one should be a rule someone could violate by
accident. Link `D<n>` rather than restating the rationale.>

- **<Convention>** — <what it constrains, and where the single source of truth lives>.

## Gotchas

<Traps that will bite the next session and are not inferable from reading the code. This
section earns its place faster than any other. Each entry: the symptom first, then the
cause, then what to do.>

- **<Symptom stated as what you will observe>** — <why it happens; what to do instead>.
