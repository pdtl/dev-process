# docs/ — the paper trail

**The artifacts of this project. The *method* that produces them lives in the
`spec-driven-delivery` plugin, not in this repo** — so it can improve across projects
instead of being copy-pasted between them.

| Artifact | Question it answers |
|---|---|
| `outline.txt` | What was the original idea? |
| `specs.md` | What must it do? (`FR-X.Y`, testable) |
| `roadmap.md` | What's in v1, and what isn't? |
| `plan.md` | How is it built? (stack, data model, risks) |
| `tasks.md` | **What's done and what's next?** (source of truth) |
| `decisions.md` | Why is it like that? (`D<n>` + revisit triggers) |
| `changelog.md` | What shipped, for someone who won't read the code? |
| `glossary.md` | What do we call things? |
| `lessons-learned.md` | What did building it teach us about how we build? |
| `design-spec.md` | What does it look like, and why? |
| `issues/` | What did hands-on testing find? |
| `operations/` | How do we run, verify and release it? |
| `screenshots/` | Visual evidence, taken deliberately (never by the test suite). |

## The method

Installed as a plugin:

```
/plugin marketplace add <owner>/dev-process
/plugin install spec-driven-delivery
```

Skills: `spec-refiner` · `spec-architect` · `task-breakdowner` · `task-close` ·
`phase-gate` · `issue-round` · `visual-pass` · `project-bootstrap`.

References: the pipeline, the working agreement, and **`gate-blindness.md`** — the catalogue
of ways a passing check covers nothing.

## This project's deltas

The parts of the process that are true *here* and not in general. Keep this short and keep
it current; it is what a general-purpose skill can't know.

**Extra rows for the issue-round conflict checklist:**

- **<e.g. the permissions module>** — `<path>` is the single source of truth for
  authorization; nothing routes around it. A fix that touches access goes through it.
- **<e.g. the token layer>** — visual values come from `<path>`; never a component literal.
- **<e.g. a generated column / migration constraint>** — <what it forbids>.

**Gates this project runs, and what each is blind to:**

| Gate | Command | Blind to |
|---|---|---|
| <unit> | `<cmd>` | <e.g. anything requiring a real database> |
| <integration> | `<cmd>` | <e.g. anything not exercised by a fixture> |
| <e2e> | `<cmd>` | <e.g. surfaces not linked from the UI> |
| <a11y> | `<cmd>` | <e.g. the canvas; non-default schemes unless looped> |

**Local rituals** not covered by the plugin: <anything else>.
