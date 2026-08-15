---
name: project-bootstrap
description: Set a new project up for spec-driven delivery — scaffold the docs/ artifacts, a lean CLAUDE.md, the working agreement, and the empty ledgers, so the pipeline and its gates have somewhere to write from day one. Triggers on "bootstrap this project", "set up the process", "new project setup", "scaffold the docs", "start a new project", or when the user wants the spec-driven workflow applied to a fresh or existing repo.
---

# Project bootstrap

Create the artifacts the pipeline writes into, so nothing has to invent a home for itself
mid-phase. Ten minutes, and it removes the two failure modes that show up otherwise: a
decision with nowhere to go, and a `CLAUDE.md` that becomes a changelog by phase four.

Read `${CLAUDE_PLUGIN_ROOT}/references/process.md` first if you haven't in this session.

## 1. Check what exists

For an existing repo, read what's there before creating anything: a `README`, any `docs/`,
`CLAUDE.md`, the test setup, the CI config. **Adopt rather than overwrite** — if the project
already has a changelog in a different format, keep the format and add the rules, don't
replace the file. Report anything you're about to overwrite and ask first.

## 2. Scaffold `docs/`

```
docs/
├── README.md            # map of these artifacts + the project's deltas
├── outline.txt          # stage 0 — the raw idea, kept for provenance
├── specs.md             # stage 1 — created by spec-refiner
├── roadmap.md           # stage 1b — v1 / fast-follow / deferred
├── plan.md              # stage 2 — created by spec-architect
├── tasks.md             # stage 3 — created by task-breakdowner
├── decisions.md         # ledger — starts empty, with its header
├── changelog.md         # starts empty, with its header
├── glossary.md          # domain nouns — starts empty
├── lessons-learned.md   # starts empty
├── design-spec.md       # visual decisions — see the visual-pass skill
├── screenshots/
│   └── README.md
├── issues/
│   └── inbox.txt        # empty
└── operations/
    └── <checklists as the project earns them>
```

Templates for the ledgers, the issue-round document and the checklists are in
`${CLAUDE_PLUGIN_ROOT}/references/templates/`. Copy them; don't invent new headers, because the skills that read
these files expect these shapes.

Stage artifacts (`specs.md`, `plan.md`, `tasks.md`) are **created by their skills**, not
here. Don't stub them with placeholder content — an empty file with a heading invites
someone to fill it in out of order.

## 3. Write `docs/README.md`

The map. It should say: which artifact answers which question, that the *method* lives in
this plugin rather than in the repo, and — the part that matters — **the project's deltas**:

- rows this project adds to the issue-round conflict checklist (every codebase has two or
  three: a permissions module nothing routes around, a token layer, a generated column);
- gates this project runs and what each one is blind to;
- anything about the process that is true here and not in general.

Use `${CLAUDE_PLUGIN_ROOT}/references/templates/docs-README.md`.

## 4. Write a lean `CLAUDE.md`

It answers **four questions and no others**: what is this · where do I look · what
constrains the code · what will bite me.

Use `${CLAUDE_PLUGIN_ROOT}/references/templates/CLAUDE.md`. Then hold the line: **≤ ~200 lines, checked at every
phase boundary.** It is loaded into every session, so length is a standing tax on all of
them, and the bloat is invisible to whoever is appending. One project's status section
reached 1,113 lines — 94% of the file — restating what `tasks.md`, `decisions.md` and `git
log` already held, and had gone stale, because nobody edits a wall of prose.

The section that earns its place fastest is **Gotchas**: traps that will bite the next
session and are not inferable from the code. Start it as soon as you have one.

## 5. Adopt the working agreement

Summarise `${CLAUDE_PLUGIN_ROOT}/references/working-agreement.md` into `CLAUDE.md` in about fifteen lines — branch
and PR per phase, commit per task, which gates run per task vs per phase, hybrid TDD at the
risk centres, the decisions ledger rule — and link to the plugin for the detail. Don't paste
the whole thing in; that is the leanness rule failing on day one.

Name the project's actual gate commands. "Run the tests" is not a working agreement.

## 6. Wire the mechanical checks early

These cost little at the start and a great deal to retrofit:

- **CI runs the fast gates** — build, test, lint, typecheck, format — plus a dependency audit
  at a failing threshold. A documented habit is not a control; one project's audit habit
  lapsed silently for ten phases and ended in seven high-severity advisories.
- **Link integrity** — a test asserting every internal link literal resolves to a route that
  exists. Cheap, and it catches an entire class of "click the obvious thing" defect that no
  unit test will.
- **Signed-in vs signed-out render checks** on every public page, if the product has auth.
- **The e2e suite builds and serves a production bundle** on its own port, so it cannot
  accidentally attach to a dev server and cannot pass on dev-only attributes.

## 7. First commit

Commit the scaffold on its own before any stage runs, so each stage after it has a clean
diff.

## Report

List what you created, what you adopted rather than replaced, what you deliberately left
empty and which skill will fill it, and the gates you wired. Then point at stage 0: the
next move is `outline.txt`, and after it `spec-refiner`.
