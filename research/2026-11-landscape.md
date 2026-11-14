# The landscape, November 2026

Research notes, not a roadmap. A survey of where spec-driven development with coding agents
had got to, against this plugin, with the goal of keeping the process simple. Ideas are
listed with their status; nothing here is a commitment.

## Where the plugin already stands

The pipeline half of this plugin (spec → plan → tasks) is now the common shape: GitHub's
Spec Kit, Kiro, OpenSpec and BMAD all do a version of it. The other half is where the plugin
is ahead, and it is the half the field's own critics say is missing.

- **The spec is kept current, not just written first.** Böckeler's taxonomy separates
  *spec-first* (write it, build, discard), *spec-anchored* (keep it current as the code
  changes) and *spec-as-source* (humans edit only the spec). Most tools are spec-first.
  Amending the spec in the same change as the code, and closing every issue-round item with
  a spec disposition, make this plugin spec-anchored.
- **Gate blindness is unaddressed elsewhere.** A June 2026 comparison of six frameworks
  found the same weaknesses in all of them: drift between spec and code, excessive trust in
  generated artifacts, and no benchmarks for the whole process. `gate-blindness.md` is
  aimed squarely at the second.
- **Literal examples in acceptance criteria.** Kiro uses EARS notation (`WHEN … THE SYSTEM
  SHALL …`) for structure. The plugin's rule that every criterion carries a literal
  input → output example targets the failure that actually happened (plausible wording built
  into whatever was easiest), which a grammar alone does not prevent.
- **Walking the app and verifying in the product** match Claude Code's own current advice
  to give the agent "a check to run" and to look at the result, not only the suite.
- **The ~200-line budget for `CLAUDE.md`** is the same number Anthropic now recommends.

## Gaps, and the ideas they suggest

### 1. The ledger sweep reads whole entries — *adopted, November 2026*

A long-lived project's ledger reached about two hundred open entries and over four thousand
lines. `phase-gate` §4 asked for every open entry to be read at every boundary; at that size
the sweep is skimmed, and two entries that said in their own text they had been closed were still
filed under Open, four and five phases later. (The first version of this note said six; four of
those were closed only in part.)

The first draft of this idea was wrong. It assumed most open entries were settled decisions
with nothing to revisit, and proposed taking them out of the sweep. Checking showed every
one had a real trigger; most were *events* the project hadn't reached yet ("when a second
feature needs this"). The cost was in reading entries rather than triggers.

What was adopted:
- Each trigger names its kind: **fact** (an external condition, re-tested at every sweep) or
  **event** (something the project will do, checked when work touches it).
- The sweep lists the trigger lines with one grep and opens only the entries this phase
  could have fired, then closes what fired.
- `task-breakdowner` checks event triggers when planning, so the trigger fires when the event
  is planned rather than a phase after it is built.
- Finished phases move out of `tasks.md` into `docs/archive/` at the phase gate. A task list
  that keeps every phase ever finished is read in full by every skill that orients on it.
  OpenSpec's dated archive of completed changes is the same idea.

### 2. Nothing independent reviews the work — *adopted, November 2026*

Every check in `task-close` and `phase-gate` was run by the session that wrote the code.
Spec Kit added a read-only `/analyze` (consistency across spec, plan and tasks) and a
`/converge` that compares the code against the spec and may only append tasks. Claude
Code's guidance makes the underlying point directly: a fresh reviewer helps *because it
hasn't seen your reasoning*, and a reviewer must be told to skip style, or it will always find
something.

What was adopted: a read-only `spec-reviewer` agent (Read, Grep and Glob only), started at the
top of `phase-gate` so it runs during the walk, and collected at the end. It checks
criteria, literal examples, reachability, undocumented shortcuts and tests that assert
nothing. This was adopted on outside evidence; the first phases that run it should record
what it found.

**First trial.** It was run on an eleven-task fix phase that had already passed its own gate,
and reported three gaps:

- **One was a real defect the gate had missed.** An admin card's wording contradicted a spec
  amendment the same phase had made. The list under the card also counted across two
  features while the rule it reported counted one. The gate's walk had recorded that card as
  correct.
- **Two were criteria not met as written.** In both, the exception was explained only in a
  task's close note, never in the ledger.
- **Half of one finding was overstated.** It missed a code comment explaining a deliberate
  wait. That is the case for confirming each gap before it goes into the report.

Cost: about 90 turns and seven minutes, roughly $3 at list price. It runs in the background
during the walk, so it adds nothing to the gate's length.

### 3. Habits the plugin itself doesn't enforce

The plugin's own rule is *make habits controls*, but it ships no hooks, so every rule is
advice. Anthropic: "If something has to happen every time, make it a hook." Plugins can ship
`hooks/hooks.json`. Two candidates small enough to hold in any project:

- block a gate command piped through `tail`, `head` or `grep`;
- warn when a commit naming a task touches neither `tasks.md` nor `changelog.md`.

Caveat: with auto-update on, every push of hook code executes in every project that has the
plugin enabled. Keep hooks short enough to read in full.

### 4. The plugin is untested, and every push is a release

Since the plugin dropped its version, each push to `main` reaches every install.
`claude plugin eval` runs realistic prompts with and without the plugin and reports the
difference (Δ), which is the only way to tell whether a skill contributes anything. Five to
eight cases would cover the rules most likely to regress: "close the task" with a red lint
reports the failure and does not commit; `phase-gate` collects findings without fixing them;
`spec-refiner` output gives every criterion a literal example. Run before pushing, and when
the model changes. Runs count against usage, and the command may still be in early access.

### 5. `CLAUDE.md` overflow has only one place to go

The lean-`CLAUDE.md` rule sends overflow to `decisions.md`. Claude Code now loads
`.claude/rules/*.md` files whose frontmatter has `paths:` only when matching files are touched,
which is the right home for a convention that binds one area of the code. Suggested rule:
*area-specific convention → path-scoped rule*.

### 6. Verifying in the product depends on remembering how to start it

Claude Code's `/verify` and `run` skills look for a project skill that launches the app. A
project whose dev environment needs several processes running together should have one, so
"open the thing you changed" is one step and no process gets forgotten. Belongs in
`project-bootstrap` as a suggestion.

### 7. Optional: automate "prove the test fails"

Reverting a feature to watch its test go red is manual mutation testing; Stryker (JS) and
similar tools automate it. Property-based tests suit date, money and unit arithmetic, the
risk centres the hybrid TDD rule already names, and Kiro now generates them from
requirements. Worth adding only at the risk centres, and only if the manual habit lapses.

### Housekeeping

- The README and marketplace text still say "thirty phases".
- The README says to restart Claude Code after installing; `/reload-plugins` does it.
- There is no `LICENSE`. Public without one means readable but not legally reusable.

## Considered and not adopted

- **EARS or another requirements grammar.** Ceremony on top of a rule that already prevents
  the failure.
- **Switching to Spec Kit, Kiro or BMAD.** More process depth and multi-agent personas; none
  carries the gates that make this one work. The comparison paper found a trade-off between
  process depth and portability, and no framework strong on everything.
- **Spec-as-source.** Humans not editing code is a different product, not a refinement.
- **A JSON feature list and progress file** (Anthropic's long-running harness). Built for
  unattended multi-session runs; `tasks.md` plus a commit per task already gives an
  interactive session the same handoff.

## Sources

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [Steering Claude Code: CLAUDE.md, skills, hooks, subagents](https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more) (June 2026)
- [Test plugins with evals](https://code.claude.com/docs/en/plugin-evals.md)
- [Plugin manifest reference](https://code.claude.com/docs/en/plugins/manifest-reference.md)
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents.md)
- [Spec Kit: agentic SDD workflow](https://github.github.io/spec-kit/reference/agentic-sdd.html)
- [OpenSpec core concepts](https://openspec.dev/docs/core-concepts)
- [Kiro specs and EARS](https://kirotutorial.com/concepts/specs/)
- [Böckeler, Understanding Spec-Driven Development](https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [From Prompt to Process: a process taxonomy of agent frameworks](https://arxiv.org/abs/2606.04967) (arXiv 2606.04967)
- [Effective harnesses for long-running agents](https://anthropic.com/engineering/effective-harnesses-for-long-running-agents)
