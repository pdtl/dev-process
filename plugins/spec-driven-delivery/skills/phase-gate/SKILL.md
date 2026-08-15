---
name: phase-gate
description: The phase-boundary ritual — the checks that only work if something schedules them. Run before opening a phase's PR and before starting the next phase. Catches drift between the plan and the built tree, duplicate domain nouns, deferrals whose trigger has fired, gates that have gone blind, and defects no suite can see. Triggers on "phase gate", "finish the phase", "ready to open the PR", "starting phase N", "phase boundary", "pre-PR check", or when a phase's last task is done.
---

# Phase gate

The rituals below exist because **each one caught something no automated check ever
would**, and each one failed to happen on its own. They take about twenty minutes together.
Run them at a phase boundary — after the last task, before the PR.

Work through the sections in order. Report findings as a numbered list with evidence
(`file:line`, a screenshot path, a command and its output). **Do not fix anything while
walking** — collecting first keeps the walk honest; fixing turns it into a debugging
session that never reaches section 6.

## 0. Orient

Read the project's `tasks.md` (which phase just closed, what it claimed), `decisions.md`
(open entries), `plan.md` (the architecture it was supposed to build), and
`lessons-learned.md` if the project has one. Note the phase number and the branch.

## 1. Walk the app as a user — ten minutes

**The single highest-yield item in this file.** Open the product and use it. Signed out,
then signed in. Walk the primary journey end to end, clicking the obvious thing each time.

On one project this ritual — had it existed — would have caught the majority of an entire
review round, phases earlier and for free: a landing page inviting *already signed-in*
users to "create an account", a Download button that ejected the user into a raw storage
URL, and a moderation email instructing recipients to appeal at a URL that 404s. Every one
a click-the-obvious-thing-once defect, sitting under 644 green unit tests, 30 cross-browser
e2e specs, zero axe violations and a clean security review. No automated check was ever
going to catch them, because **tests assert what the code does, and the code did exactly
what it was told.**

Dump every observation — including "is this even a bug?" ones — into `docs/issues/inbox.txt`
verbatim. Don't triage while walking; ambiguity is the point, and the ambiguous notes are
where the product's model and the user's model diverge.

## 2. Diff the built tree against the plan

List the actual routes/modules and compare against the structure `plan.md` specifies. Every
divergence is **either a plan update or a bug** — decide which, in writing. Never leave it
undecided.

This is not busywork. On one project the plan had the correct architecture from day one;
the walking skeleton built something different, the specified route was never created, and
nobody diffed the tree against the plan for six phases. The correction became a phase-sized
refactor. It was never a decision to build the wrong thing — it was drift nobody was
watching for.

## 3. Dedupe the domain nouns

For every noun this phase introduced, ask: **does this already exist under another name?**

Maintain `docs/glossary.md` — nouns plus one-line definitions — and add to it as features
land. It is half a page and it makes duplication visible the moment it appears, while the
fix is still a naming decision rather than a migration.

One project shipped an ad-hoc way to compare items in one phase, and a named, saveable
"combination" of the same items in the next. Same concept, two vocabularies, two
confusingly similar ways to share — which was exactly what the user objected to. Nothing in
the process compared a new feature against the vocabulary of the existing ones, and the
spec carried the duplication too.

## 4. Sweep the decisions ledger

Read every open entry in `decisions.md` and ask which have had their trigger pulled. Then,
for each one:

- **If the trigger is an external fact** — "the network can't reach it", "no tooling exists
  yet", "the library doesn't support it" — **re-test the fact. Do not re-read the entry.**
  It costs a minute. An entry explaining why something wouldn't work is precisely what stops
  anyone trying it again. One such entry sat as a pre-production blocker for twenty-six
  phases; the one-line command in it had started working months earlier.
- **If a task closed part of the deferral, amend the entry.** A stale entry lies in the safe
  direction too: it inflates the backlog and invites the next person to build what already
  exists.
- **Check the framing, not just the status.** An entry filed as "this list is too short" is
  also an assertion that short is the *only* failure mode — which is what stopped anyone
  noticing the same feature was rejecting real users' names.
- **Confirm every open deferral has a placeholder task.** A ledger entry with no task will
  not come back on its own.

## 5. Audit the gates that may have gone blind

Read `${CLAUDE_PLUGIN_ROOT}/references/gate-blindness.md` and check this phase's work against its seven costumes.
The fast version:

- **Reachable?** Is every surface this phase built linked from somewhere a user would be?
  An orphaned page is exempt from every gate you have.
- **Every variant?** If the product ships N schemes / palettes / orientations / auth states,
  did the gate loop N times, or scan one?
- **Image or call log?** Anything that draws needs pixels compared, not calls recorded.
- **Fixture non-empty?** Does any gate added this phase assert its fixture actually has
  content? A scan of an empty page passes exactly like a scan of a clean one.
- **Fixture still tripping?** Did this phase raise a limit — rows, page size, timeout,
  capacity? If so, re-check every fixture calibrated against the old one.
- **Production build?** Is the e2e suite running against what ships?
- **Output read?** Are gates run by exit code, with no `| tail`?

**And: did any test that should have broken this phase stay green?** Treat that as
information and investigate it. Chasing one such case turned up an assertion whose
comparison was backwards, passing only by accident of fixture size.

## 6. Check the paper trail

- **Spec drift:** if this phase changed *specified* behaviour, `git diff main...HEAD --
  docs/specs.md` is non-empty. If the phase came from an issue round, every **Enhancement**
  item closes with either the `FR-x.y` it amended or an explicit reason it needed none. A
  blank spec disposition means the item is not closed. Nothing mechanical will ever tell you
  the spec drifted — every other gate is a *code* gate.
- **Changelog:** every task in this phase is accounted for in `changelog.md` — with a
  consequence-first line, or inside the phase's `Behind the scenes` paragraph.
- **`CLAUDE.md` budget:** still ≤ ~200 lines? Did the phase add only Gotchas/Key-conventions
  lines? **Prune now**: any status line that has become a description of how the product
  works belongs in the code or the spec, not here.
- **Boxes ticked** in `tasks.md`, with files/refs/acceptance intact.

## 7. Run the slow gates

The end-to-end and integration suites, which are too slow to run per task. By exit code.
Report failures verbatim; do not summarise a red suite as "mostly passing".

## Report

Produce:

1. **Blockers** — things that must be fixed before the PR opens, with evidence.
2. **Findings for the inbox** — observations from the walk, appended to `docs/issues/inbox.txt`.
3. **Ledger actions** — entries to amend, re-test, close, or promote to a task.
4. **Drift** — plan-vs-tree divergences, with the decision made about each.
5. **Clean** — which sections found nothing, named explicitly, so the next reader knows the
   walk happened rather than being skipped.

Then stop and let the human decide what blocks the PR.
