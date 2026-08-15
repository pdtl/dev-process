# spec-driven-delivery

Idea → shipped software, as a sequence of reviewable artifacts, with the gates that thirty
phases of building taught us to add.

The pipeline half (spec → plan → tasks) is a reasonable idea anyone might have. **The other
half is not** — it is a list of specific, non-obvious ways a project with 644 green unit
tests, cross-browser e2e specs, zero accessibility violations, a clean security review and a
performance suite still shipped a landing page inviting signed-in users to create an
account. Every rule here was paid for.

## Install

```
/plugin marketplace add pdtl/dev-process
/plugin install spec-driven-delivery
```

Restart Claude Code afterwards, then `/project-bootstrap` on a new project.

Scopes, verifying the install, removing stale loose copies of the three spec skills,
updating, and working on the plugin itself: **[Installation](../../README.md#installation)**
in the repo README.

## Skills

| Skill | When |
|---|---|
| `project-bootstrap` | New project — scaffold the artifacts and wire the mechanical gates |
| `spec-refiner` | Draft requirements → a spec an engineer can build without guessing |
| `spec-architect` | Solid spec → stack, architecture, data model, risks |
| `task-breakdowner` | Spec + plan → ordered, independently testable tasks |
| `task-close` | Every task — gates by exit code, look at the result, three artifacts, commit |
| `phase-gate` | Every phase boundary — the checks that only happen if scheduled |
| `issue-round` | Testing notes → triaged, dispositioned round → a phase of tasks |
| `visual-pass` | Functionality is locked and the work is now aesthetic |

## References

Loaded on demand by the skills, never into a session wholesale.

- **`references/process.md`** — the pipeline, its stages and gates, the artifact set, the
  changelog register, and the rule that keeps `CLAUDE.md` lean.
- **`references/working-agreement.md`** — branching, which gates run when, hybrid TDD, the
  decisions ledger, definition of done.
- **`references/gate-blindness.md`** — **the catalogue.** Seven ways a passing check covers
  nothing, each with the defect that revealed it.
- **`references/templates/`** — `CLAUDE.md`, `docs/README.md`, the ledgers, the issue-round
  document, the glossary, the verification checklist, the screenshots rule.

## The short version

If you read nothing else:

1. Make the walking skeleton exercise the **plural/composite** case of the core noun — the
   first route you build is a claim about what your objects are. And **diff the built tree
   against the plan** at every phase boundary.
2. Keep a **domain glossary**; dedupe every new noun against it.
3. **"Done" = reachable.** No orphan APIs, no orphan components, no orphan pages — and an
   unreachable surface is an *unaudited* surface.
4. Every **deferral gets a task**, not just a ledger note.
5. **Walk the app as a user at every phase merge** — ten minutes, into the issue inbox. The
   highest-yield item on this list.
6. Automate the mechanical half of intent: **link integrity**, signed-in vs signed-out
   renders.
7. Every acceptance criterion carries a **literal input → expected output example**.
8. Fix model errors **the day you notice them**. The price only rises, and it rises
   discontinuously at your first external user.
9. **Audit every scheme, palette and orientation you ship** — and give any surface your gate
   can't reach a check of its own.
10. **Look at anything that draws.** A test over rendering code proves the calls were made,
    never that the result is visible, distinguishable or clickable.
11. **Prove each new test fails with its feature turned off.** When a limit changes, re-check
    the fixtures calibrated against the old one.
12. **Never pipe a gate through `tail`** — use the exit code. For anything that draws, assert
    the *pixels* changed, then look at the after image.
13. **Re-test a deferral's reason, don't re-read it.** When a task closes part of a deferral,
    amend the deferral.
14. **Make habits controls.** A documented pre-PR step that nothing enforces will lapse
    silently.
15. **Test the build you ship.** A gate against a dev server is testing a different program.
16. **Assert that a gate's fixture isn't empty.** A scan of an empty page passes exactly like
    a scan of a clean one.

## What worked, and shouldn't be over-corrected away

The list above is all failures, so it reads more pessimistically than the record deserves.

- **Hybrid TDD aimed at the right targets.** Across a full review round after eight phases,
  **not one issue was a core-logic defect.** The instinct about where correctness was
  load-bearing was right; the gap was in what wasn't tested at all.
- **The decisions ledger made triage nearly free.** Every gap found in testing was already
  documented with its rationale and its cost — raw note to file-and-line in one session,
  nothing a surprise. Its failure was that nothing *acted* on it, not that it was wrong.
- **A token-only visual pass** let aesthetics change with no risk of masking functional
  regressions, and the functional checkpoint made that guarantee auditable.
- **Docs that tell the truth**, including about their own embarrassments. That is the only
  reason review rounds were triage rather than archaeology.

## Adding to this plugin

The rules here came from somewhere, and the flow needs to keep working:

1. A project learns something. It goes in **that project's** `docs/lessons-learned.md` as a
   case study — what happened, why, what to do instead. That is the evidence, and it stays
   with the project it happened to.
2. Ask whether it **generalises**. Would it have been true on a project with a different
   stack, domain and team? If not, it belongs in the project's `docs/README.md` deltas, not
   here.
3. If it generalises, add the **rule** here — usually a new bullet under an existing skill or
   a new costume in `gate-blindness.md`, rarely a new skill. Keep one line of concrete
   evidence with it: a rule with no story behind it gets rationalised away, and the story is
   what makes it persuasive at the moment someone is about to skip it.
4. Cross-reference: the project's case study names the rule it produced.

Keep the case studies out of here. They are about a specific product and they age; the rules
don't.
