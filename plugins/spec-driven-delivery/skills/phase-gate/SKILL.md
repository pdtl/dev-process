---
name: phase-gate
description: The phase-boundary ritual — the checks that only work if something schedules them. Run before opening a phase's PR and before starting the next phase. Catches drift between the plan and the built tree, duplicate domain nouns, deferrals whose trigger has fired, gates that have gone blind, and defects no suite can see, and has a read-only reviewer check the phase against its spec. Triggers on "phase gate", "finish the phase", "ready to open the PR", "starting phase N", "phase boundary", "pre-PR check", or when a phase's last task is done.
---

# Phase gate

The rituals below exist because **each one caught something no automated check ever
would**, and each one failed to happen on its own. They take about twenty minutes together.
Run them at a phase boundary — after the last task, before the PR.

Work through the sections in order. Report findings as a numbered list with evidence
(`file:line`, a screenshot path, a command and its output). **Do not fix anything while
walking** — collecting first keeps the walk honest; fixing turns it into a debugging
session that never reaches the last section.

## 0. Orient

Read the project's `tasks.md` (which phase just closed, what it claimed), `decisions.md`
(its open triggers; see §4), `plan.md` (the architecture it was supposed to build), and
`lessons-learned.md` if the project has one. Note the phase number and the branch.

**Then start the independent review, before anything else**, so it runs while you walk. Give
the `spec-driven-delivery:spec-reviewer` agent the phase's heading in `tasks.md` and the files
the phase changed (`git diff --name-only <base>...HEAD`). It only reads, and it compares the
work with the criteria it was built against, in a context that never saw it being written.
Collect its report in §9.

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

**Sweep the triggers, not the entries.** List every open entry's trigger in one command
(`grep -n 'Revisit when' docs/decisions.md`) and open only the entries this phase could have
fired:

- every **fact** trigger: an external condition such as a library, a network, a limit or a
  measurement. Re-test it every time, because a fact changes without anyone deciding it
  should;
- every **event** trigger that names something this phase built, planned or touched.

Reading every entry instead is how the sweep stops happening. On one project the open
section grew to about two hundred entries and over four thousand lines, most of them settled
decisions waiting on events the project hadn't reached. At that size the sweep was skimmed,
and six entries that said in their own text they were closed were still filed under Open.

Then, for each entry you opened:

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
- **Close what fired.** An entry whose event has happened is amended to describe the new
  state, or closed with the date and the task that settled it. A ledger whose open entries
  only ever grow is being read, not swept.
- **Confirm every open deferral has a placeholder task.** A ledger entry with no task will
  not come back on its own.
- **Read any "harmless today" verdict on a warning against every reader of the setting it
  names.** A warning speaks for the program that raised it. One about a connection string's
  `sslmode` was filed as a future upgrade's problem while the app's *other* database client
  had been skipping the certificate check since launch.

## 5. Audit the gates that may have gone blind

Read `${CLAUDE_PLUGIN_ROOT}/references/gate-blindness.md` and check this phase's work against its seven costumes.
The fast version:

- **Reachable?** Is every surface this phase built linked from somewhere a user would be?
  An orphaned page is exempt from every gate you have.
- **Every variant?** If the product ships N schemes / palettes / orientations / auth states,
  did the gate loop N times, or scan one? And the environment's axes: do the e2e browser and
  server run in **different time zones**, so a page rendered in the reader's zone fails?
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
- **Release note:** if the project publishes them, this release has one in its house style
  (`${CLAUDE_PLUGIN_ROOT}/references/templates/release-notes-style.md`), and the PR description
  will carry it word for word.
- **`CLAUDE.md` budget:** still ≤ ~200 lines? Did the phase add only Gotchas/Key-conventions
  lines? **Prune now**: any status line that has become a description of how the product
  works belongs in the code or the spec, not here.
- **Boxes ticked** in `tasks.md`, with files/refs/acceptance intact.
- **Archive what's finished.** Once the PR is ready, move every phase whose boxes are all
  ticked from `tasks.md` to the end of `docs/archive/tasks.md`, and every closed or superseded
  ledger entry to `docs/archive/decisions.md`. First move any unticked placeholder task into a
  `## Deferred` section at the end of `tasks.md`, so it isn't archived with its phase. IDs never
  change, so every reference still resolves by grep. `tasks.md` then holds what's next, not
  everything that ever was, and every skill that orients on it reads that, not the history.

## 7. Run the slow gates

The end-to-end and integration suites, which are too slow to run per task. By exit code.
Report failures verbatim; do not summarise a red suite as "mostly passing".

## 8. Audit the dependencies — before the PR, not because of it

Run the project's dependency audit (`npm audit --audit-level=high`, `pip-audit`, `cargo
audit`, whatever CI runs) **and run it at the same threshold CI does**. Read the exit code:
a summary line saying "5 vulnerabilities" tells you nothing about whether the gate CI
applies has failed.

This step exists because **nothing else in this walk looks at the dependency tree**. Sections
1–7 examine code, docs, ledger and suites — all things the phase touched. A supply-chain
advisory arrives on a schedule that has nothing to do with your phase, so the first thing to
notice it is CI, *after* the work is finished and the PR is open. That is the most expensive
moment to find out and the easiest one to prevent.

Two failure modes to name, because both look like the other one:

- **A finding that is real but unreachable.** Most are: a dev-only or build-time dependency,
  in a path that never runs in production and never sees untrusted input. Trace the actual
  path (`npm ls <pkg>`) before deciding — "it's only a dev dependency" is a claim, not an
  observation. **Then fix it anyway if CI's threshold catches it.** The reachability
  argument justifies not panicking; it does not make CI green, and a permanently red CI
  trains everyone to stop reading it — gate blindness applied to the one check nobody owns.
- **A finding that is reachable.** Stop and treat it as a blocker, not a note in the report.

Whatever you decide, **record it** — the project's ledger should carry a dated audit entry
per phase, naming the findings, the reachability argument, and what was done. A finding
accepted twice without a written reason is a finding nobody is deciding about any more.

## 9. Collect the independent review

Read the report from the reviewer you started in §0 and fold it into yours.

- **Confirm each gap before passing it on.** Open the `file:line` it cites. You can run the
  code; the reviewer can only read it, and a gap you haven't checked is the reviewer's guess
  in your report.
- **Take its "not checkable" list to the app.** Anything §1 didn't already cover gets clicked
  now, or named in the report as not walked.
- **Don't re-verify its clean list.** That is the point of having it.

This section exists because every other one is run by the session that built the phase,
which its own reasoning has already persuaded. The reviewer is the only check in this walk
that never saw the work being written. It was adopted on outside evidence, not a lesson from
a project, so record what it finds in `lessons-learned.md` for the first few phases, and
whether anything else would have caught it.

## Report

Produce:

1. **Blockers** — things that must be fixed before the PR opens, with evidence.
2. **Findings for the inbox** — observations from the walk, appended to `docs/issues/inbox.txt`.
3. **Ledger actions** — entries to amend, re-test, close, or promote to a task.
4. **Drift** — plan-vs-tree divergences, with the decision made about each.
5. **Dependency audit** — the exit code, the findings, and the decision for each with its
   reachability traced rather than asserted.
6. **Independent review**: the reviewer's gaps, each confirmed or rejected with evidence. A
   gap the human accepts becomes a task in this phase if it blocks, or a ledger entry with a
   placeholder task if it is deferred.
7. **Clean** — which sections found nothing, named explicitly, so the next reader knows the
   walk happened rather than being skipped.

Then stop and let the human decide what blocks the PR.
