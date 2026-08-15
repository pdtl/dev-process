# Working agreement

How building actually proceeds once `tasks.md` exists. Adopt this into the project's
`CLAUDE.md` (a condensed version — the detail stays here).

## Branching

- **One branch and PR per phase, one commit per task.** Branch names like
  `phase-3-accounts`. Merge to the default branch when the phase is reviewed.
- **Push after every task commit**, not at phase end. The PR opens at phase end.
- Check the task's box in `tasks.md` when it's done, **and add its line to
  `changelog.md`** — see `task-close`.

## Gates

**Every task leaves the fast gates green**: `build`, `test`, `lint`, `typecheck`,
`format:check`. Tasks that touch the database are verified against a live database, not
only unit tests with a fake connection string.

**The slow gates run before the phase's PR**: end-to-end and integration suites. They are
too slow for every task, but skipping them entirely is how a phase merges with three specs
red and nobody notices until the phase after. Whatever your CI runs is not a substitute —
it typically covers only the fast gates.

Three rules about running gates, each of which cost a real defect:

- **Never pipe a gate through `tail`, `head` or `grep`.** Use the exit code. Piping
  converts "did it pass?" into "what did it print last?", and those are different
  questions — a lint summary one line above the tail, or an error in the same file, becomes
  invisible.
- **Treat an exhaustive-deps warning about a value read in a render effect as an error.**
  It is the compiler describing a stale-render bug in advance, usually naming the exact
  variable.
- **The end-to-end suite builds and serves its own production bundle** on its own port. A
  gate exercising a dev server is testing a different program — it can pass on attributes
  and behaviour production does not have.

## Hybrid TDD

**Test-first at the risk centres. Tests inline everywhere else.**

Risk centres are the places where correctness is load-bearing and a defect is silent:
permission and role matrices, money and date arithmetic, unit conversion, optimistic
concurrency, auth enumeration and timing, limit resolution, anything with a security
property.

This works. On one project, across a full review round after eight phases, **not one issue
was a core-logic defect** — every one was a surface, reachability or model problem. The
instinct about *where* correctness mattered was right; the gap was in what wasn't tested at
all.

So the corollary matters as much as the rule: **the risk centres are not where your bugs
will be.** They are where your *expensive* bugs would have been. Budget attention for
reachability and intent separately — see `references/gate-blindness.md`.

### Prove each new test fails with its feature turned off

Before committing, revert the feature and confirm the new test goes red. It costs a minute
and it is the only thing that distinguishes a test that guards behaviour from one that
merely runs.

Adopted mid-project, it immediately caught two tests asserting nothing: one recorded a
render call the painter made either way, and another passed its own threshold in as an
argument — so the shipped default it existed to pin went unchecked. Neither would ever have
failed.

## The decisions ledger

**Log every compromise, load-bearing assumption and deferred decision as you make it**, in
`decisions.md`, with a **revisit trigger**. Don't let a shortcut become permanent by
omission.

The ledger's payoff is triage speed: when a review round arrives, every gap found in
testing is already documented with its rationale and its cost, so items go from raw note to
root cause and file-and-line in a single session, and nothing is a surprise.

Three rules keep it honest:

- **Every deferral gets a placeholder task in `tasks.md`, not just a ledger entry.** The
  ledger is a record, not a queue: a "revisit when…" note has no owner, no date and no place
  in the backlog, so it is only found by someone who goes looking. One entry with an honest
  trigger was revisited five phases later — by the user, in testing. The ledger worked
  exactly as designed and still didn't fire, because nothing was scheduled to read it. **If
  it isn't worth a task, it isn't deferred — it's dropped, and should be recorded as such.**
- **When a decision asserts something is fine, say what verified it.** "Verified" with
  nothing behind it is a guess in a decision's clothes. One entry asserting a component met
  contrast requirements was written about a page no gate could reach; when a later phase
  linked it and scanned it, it failed.
- **Re-test a reason, don't re-read it.** Entries blocked on an external fact rot; entries
  expressing a judgement age fine. See `gate-blindness.md` §8.

## Definition of done

**Done means reachable.** A user-facing capability is not done until a user can get to it
from a page they would plausibly be on. An endpoint with no entry point is inventory, not
value — and an unreachable surface is also an *unaudited* surface, because every gate you
believe protects you walks the app.

## Verify in the product, not only in the suite

**Open the thing you changed** — even when the change is one line and the tests are green.
On one project, verifying a one-line fix in a browser turned up a two-phase-old hole in the
accessibility gate that no test could have reported.

For anything that draws:

- **Screenshot the surface as part of the task**, not as a nice-to-have. Shoot every
  orientation and scheme it supports — landscape *and* portrait, light *and* dark. Four
  images, not one.
- **Assert the output, not the control.** `expect(before).not.toEqual(after)` on two
  screenshots either side of the interaction. A test that asserts a button's label changed
  never checks the thing the button was for.
- **Look at the after image, specifically.** A screenshot proving a bug was once captured,
  saved, and not looked at, in the same run that reported success. Capturing an image and
  moving on is the same as not capturing it.
- **When a change adds a mark, ask what is already at that coordinate.** When a change
  moves a mark, **the hit-test moves with it or the mark is decoration.**

Committed screenshots are produced deliberately, not by the test suite — a suite that
overwrites them on every run turns real updates into indistinguishable binary churn. If a
change makes one wrong, retake it in the same commit.

## Make habits controls

A documented pre-PR step that nothing enforces **will** lapse silently. One project's
dependency-audit habit stopped after phase 18 and nothing said so; ten phases later there
were seven high-severity advisories, including an auth bypass in the framework enforcing
the app's own auth gate.

If a step matters, put it in CI where a lapse fails the build. If it can't be automated, it
belongs in the `phase-gate` ritual, which is at least scheduled.
