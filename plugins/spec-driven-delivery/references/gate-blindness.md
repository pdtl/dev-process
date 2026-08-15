# Gate blindness

**A catalogue of the ways a passing check covers nothing.**

Every entry below was found the same way: something was obviously broken to a person
using the product, and the suite that was supposed to own it was green at the time. They
are not separate bugs. They are one bug wearing seven costumes:

> **A gate was assumed to be doing work it wasn't, because the way it fails is by
> passing.**

That is what makes this class expensive. A red test tells you where to look. A gate
scanning an empty page, a call log, one of two colour schemes, or a build you don't ship
reports success — truthfully — about nothing. Nobody investigates a pass.

Read this before writing a test that is meant to *protect* something, and at every phase
boundary (`phase-gate` walks it).

---

## The seven costumes

### 1. The gate can't reach the surface

An orphaned page — built, correct, linked from nowhere — is exempt from every check you
believe protects you, because e2e, accessibility, performance and error-path gates all
*walk the app*. Reachability and coverage are the same property.

*Evidence:* an object editor sat unlinked for eight phases. The phase that finally linked
it ran axe over it for the first time and found a WCAG AA failure — under a written
decision entry asserting the component was fine.

**Check:** every user-facing capability has an entry point from a page a user would
plausibly be on. "Done" means *reachable*, not *implemented*.

### 2. The gate scans one variant of several

If the product ships N colour schemes, N palettes, N orientations, N locales — the gate
loops N times or you have audited one of them. A variant nothing scans is a variant nobody
has checked, and it drifts silently until someone changes something nearby.

*Evidence:* dark mode drew a light hairline border on every card for seven phases. Portrait
orientation printed every label over its neighbour's and had been broken since the task
before. Both were visible instantly to anyone who looked in that mode; nothing looked.

**Check:** enumerate the axes your product varies along (scheme × palette × orientation ×
auth state) and make the gate iterate the product, not a representative sample.

### 3. The gate records the calls, not the result

A test over drawing code asserts *what the renderer was asked to do*. That catches "the
mark is missing" and "the mark used the wrong token" — genuinely most of what goes wrong.
It cannot catch **composition**: whether two marks overlap, whether one occludes another,
whether the result is legible, whether a pointer can reach it. Occlusion is a property of
the image, and a call log is not an image.

*Evidence:* a dashed "approximate date" indicator was drawn along a baseline, underneath
both the marker and the baseline's own stroke. Invisible on screen. Its test asserted a
dashed stroke was issued in the right colour, which was true.

**Check:** for anything that draws, compare pixels either side of the interaction
(`expect(before).not.toEqual(after)` on two screenshots) and **look at the after image** —
the frame that should have changed, not the one that already worked.

### 4. The gate's fixture is empty

A scan of an empty surface is indistinguishable from a scan of a clean one. Both report
zero violations, and one of them is lying.

*Evidence:* two independent seed files wrote fixture rows with hand-written constant UUIDs
that overlapped, both using `ON CONFLICT DO NOTHING`. Whichever ran second wrote nothing.
The accessibility scan added specifically to close a known contrast debt had been auditing
a blank page ever since — reporting zero violations, truthfully, about nothing. The defect
existed only in the relationship between two files that never import each other, so no
type, no constraint, and no review of either file could have caught it.

**Check:** a gate over a fixture fails if the fixture is empty (`expect(rows.length)
.toBeGreaterThan(0)` is one line). Independent seeds sharing an id space get a disjointness
test. Any upsert keyed on a guessable constant id carries a scope predicate, or it will
eat somebody else's row.

### 5. The gate's fixture stopped exercising the feature

A capacity change silently widens every fixture calibrated against the old capacity. The
test still passes; it just no longer reaches the condition it was written to test. This is
the same failure as an empty fixture, arriving by a different route.

*Evidence:* a clustering fixture had three events, which stopped crowding the moment a
taller lane could hold eight rows. Investigating why it hadn't broken revealed its central
assertion had the comparison backwards, and had only ever passed by accident of fixture
size.

**Check:** when a change raises a limit — rows, spacing, tiers, page size, timeout —
re-check the fixtures sized against the old one. Prefer fixtures with an order of magnitude
of headroom over ones sized to just barely trip. **When a test that should have broken
doesn't, that is information** — investigate it rather than enjoying it.

### 6. The gate runs against a build you don't ship

A dev build has attributes, error overlays, warnings, and relaxed behaviour that production
does not. A gate exercising it is testing a different program.

*Evidence:* two e2e specs were clicking a `data-testid` the UI framework emits **only when
`NODE_ENV !== "production"`**. The tests had been driving a control that does not exist in
the shipped app — and underneath it, the real control had no accessible name at all.

**Check:** e2e builds and serves a production bundle on its own port. It should be
impossible for it to accidentally attach to a running dev server.

### 7. The gate's output is swallowed

A check that runs, fails, and prints into a void is not a check. The two common ways:
piping through `tail` or `grep`, and treating a warning as decoration.

*Evidence:* gates were being run as `npm run lint 2>&1 | tail -1` — blank on success, and
blank when the summary is one line further up. An `exhaustive-deps` warning naming the
exact missing variable in the exact render effect scrolled past unread, and the feature it
described shipped broken: a toggle that changed its own label and did not repaint the
canvas. A hard lint *error* in the same file was invisible the same way.

**Check:** never pipe a gate through `tail`, `head`, or `grep`. Use the exit code. And
treat an exhaustive-deps warning about a value read in a render effect as an error — it is
the compiler describing a stale-render bug in advance.

---

## The eighth: a written reason goes stale

Not a test gate, but the same shape — a recorded fact that stops being true and keeps being
trusted, because it reads like a finding.

*Evidence:* a decision entry said the environment could not fetch a password blocklist. It
could, probably for months. A one-line `curl` sat in the ledger as a pre-production blocker
for twenty-six phases while the app shipped 120 passwords in place of 10,000 — accepting
`iloveyou`, `sunshine` and `trustno1` as fine choices. Nobody re-ran the command, *because
the entry explained why it wouldn't work.*

Two more from the same sweep: an entry describing work that had already been done eighteen
phases earlier (a stale entry lies in the safe direction too — it inflates the backlog and
invites someone to rebuild what exists), and a documented pre-PR habit that quietly lapsed
for ten phases, ending in seven high-severity advisories including an auth-bypass in the
framework enforcing the app's auth gate.

**Check:**

- An entry blocked on an **external fact** ("can't fetch it", "no tooling exists", "the
  library doesn't support it") is **re-tested, not re-read**. Costs a minute. Entries
  expressing a *judgement* ("we prefer X to Y") age fine; entries asserting a *fact* rot.
- When a task closes *part* of a deferral, amend the deferral. Don't leave it describing
  work that is done.
- **A documented habit is not a control.** If a pre-PR step matters, put it in CI, where a
  lapse fails the build instead of passing silently.

---

## Why redundancy doesn't save you

The pattern across all eight: *the missing check was assumed to be covered by the check
next to it.* Reachability was assumed to be covered by e2e. Composition was assumed to be
covered by painter tests. The second colour scheme was assumed to be covered by the first.

Adding more of a check you already have does not close these. Each costume needs a
**different kind** of observation than the gate beside it:

| If the gate is… | it cannot see… | so add… |
|---|---|---|
| a suite that walks the app | anything unlinked | a link-integrity / reachability test |
| a scan of the default variant | every other variant | a loop over the variant axes |
| a log of render calls | the rendered image | screenshots, read by a person |
| a scan of a fixture | an empty fixture | a non-emptiness assertion |
| a fixture sized to trip | a raised limit | headroom, and re-calibration on limit change |
| a dev-server run | production-only behaviour | a production build under test |
| a piped command | its own failure | the exit code |
| a written decision | the world changing | a re-test of the underlying fact |

**And the one that catches what none of them do:** open the thing you changed and look at
it. Every defect in this catalogue was found that way, most of them in seconds, several of
them while verifying a one-line fix whose tests were green.
