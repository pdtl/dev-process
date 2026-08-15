---
name: task-close
description: Close a single task properly — gates by exit code, verify in the product not just the suite, tick the box, write the changelog line, log any compromise as a decision with a revisit trigger, and commit. Triggers on "close the task", "finish this task", "task is done", "commit this task", "wrap up T<n>", or when an implementation task's acceptance criteria are met and it is time to commit.
---

# Task close

A task is not done when the code works. It is done when the code works, the gates pass by
exit code, someone has *looked* at the result, and the three artifacts say so.

Work the steps in order. Steps 2 and 4 are the ones that get skipped, and they are the ones
that caught real defects.

## 1. Gates, by exit code

Run the project's fast gates — typically `build`, `test`, `lint`, `typecheck`,
`format:check`.

**Never pipe a gate through `tail`, `head` or `grep`.** Use the exit code. A lint summary
one line above the tail — or a hard error in the same file — becomes invisible, and a
warning naming the exact stale variable in the exact render effect scrolls past unread. A
gate reduced to its last line answers "what did it print?", not "did it pass?".

If the task touched the database, verify against a live database, not a unit test with a
fake connection string.

**Read the warnings.** An exhaustive-deps warning about a value read in a render effect is
an error — it is the compiler describing a stale-render bug in advance.

## 2. Verify in the product

**Open the thing you changed.** Even when the change is one line and the tests are green —
that is exactly the case that once turned up a two-phase-old hole in an accessibility gate.

If the task touched anything that draws:

- **Screenshot it**, and shoot every orientation and scheme it supports — landscape *and*
  portrait, light *and* dark. Four images, not one. On one project, three of five drawing
  defects in a phase were visible in only one of the four.
- **Look at the after image** — the frame that should have changed, not the one that already
  worked. A screenshot proving a bug was once captured, saved, and never opened, in the same
  run that reported success.
- **Assert the output, not the control.** `expect(before).not.toEqual(after)` on two
  screenshots either side of the interaction. Asserting that a button's label changed never
  checks the thing the button was for.
- **What was already at that coordinate?** A new mark can land on top of an existing one and
  every call-log test will still pass.
- **Did the mark move?** Then the hit-test moves with it, or the mark is decoration.

Save screenshots to the project's committed screenshot directory (not the test runner's
output directory) and reference them from the task. If an existing screenshot is now wrong,
retake it in this commit.

## 3. Prove the new tests guard something

Before committing, **revert the feature and confirm each new test goes red.** A minute, and
it is the only thing distinguishing a test that guards behaviour from one that merely runs.
Two tests caught this way asserted nothing at all: one recorded a call made either way, the
other passed its own threshold in as an argument.

If the task added a gate over a fixture, assert the fixture is **non-empty**. A scan of an
empty page passes exactly like a scan of a clean one.

If the task **raised a limit** — rows, page size, capacity, timeout — re-check every fixture
calibrated against the old one. They may have silently stopped reaching the condition they
were written to test.

## 4. Write the three artifacts

**a. `tasks.md`** — tick the box. Leave the files/refs/acceptance fields intact.

**b. `changelog.md`** — the step people skip, and the one that cannot be reconstructed
later. Add a line now:

- **Lead with the consequence, not the change.** Not "added a null check to the icon
  column", but "editing an event no longer wipes its icon".
- **Name the surface, never the file.** "The event editor", not `ObjectEditor.tsx`.
- **No identifiers.** `FR-7.1`, `T24.1`, `D91` mean nothing to the reader this file is for.
- **If the task has no consequence you can state that way**, it is infrastructure: give it a
  short `Behind the scenes` note saying why it matters, not how it works. Security patches,
  test-harness repairs and performance work get a line each — silence reads as though
  nothing was done for weeks.

**c. `decisions.md`** — *only if* the task took a shortcut, relied on a load-bearing
assumption, or deferred something. Add a `D<n>` with a **revisit trigger**, and:

- **Also add a placeholder task to `tasks.md`.** The ledger is a record, not a queue. An
  entry with no task is found only by someone who goes looking — one such entry surfaced
  five phases later, in user testing.
- **If you assert something is fine, say what verified it.** "Verified" with nothing behind
  it is a guess in a decision's clothes.
- **If this task closed part of an existing deferral, amend that entry** rather than leaving
  it describing work that is done.

**Do not add a paragraph to `CLAUDE.md`.** Finishing a task does not earn one. At most, one
line under **Gotchas** (a trap the next session will hit) or **Key conventions** (a rule
that binds future code) — and if `decisions.md` already says it, link `D<n>` instead.

## 5. Commit and push

One commit per task, message naming the task id and what changed for a user. Push the phase
branch now — the PR opens at phase end, not per task.

## Report

State plainly: gates run and their exit status, what you looked at and where the screenshots
are, which tests you proved fail without the feature, and the three artifact edits. If a
gate failed or a step was skipped, say so — a task reported as closed with a red suite is
worse than one reported as blocked.
