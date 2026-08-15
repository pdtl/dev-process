# Issue round N — <YYYY-MM-DD>

Triage of `docs/issues/inbox.txt`. Process: `issue-round` skill.

**Every verdict is traced to code (`file:line`), never inferred from the docs.**

## Summary

| ID | Item | Verdict | Size | Conflict | Decision | Spec | Status |
|----|------|---------|------|----------|----------|------|--------|
| I1 | <one line> | Bug | S | — | Accept | Gap | `T<n>.<m>` ✓ |

**Verdicts:** Answer · Bug · Gap · Enhancement · Won't do
**Decision** (the human's gate): Accept · Defer · Reject
**Spec** — required for every Enhancement: the `FR-x.y` amended (`FR-8.1 ✎`), or an explicit
reason none was needed — `Gap`, `below spec altitude`, or a `D<n>` deferring it. **A blank
Spec cell on an Enhancement means the item is not closed.**

---

## I1 — <title>

> <the raw note, verbatim from the inbox>

**Verdict.** <Answer | Bug | Gap | Enhancement | Won't do>

**Evidence.** `<path/to/file.ts:120>` — <what the code actually does.>

**Root cause.** <Why it behaves that way. Often a deliberate, logged deferral — name the
`D<n>`.>

**Conflict.** <None, or: which of identity/routing · access model · data model · spec ·
prior decision · token layer · <project-specific rows from docs/README.md> it collides with,
and what that implies. This is where a "small UI fix" turns out to be an architecture
change.>

**Fix.** <The proposed change.> **Size:** S | M | L

**Decision.** <Left blank for the human. Nothing is promoted until this is filled in.>

---

## Items not filed

Fell out of the review rather than the testing — dead links, unreachable pages, orphaned
components. Testing finds what testing finds; code review finds the rest, and the two sets
barely overlap.

| ID | Item | Verdict | Evidence |
|----|------|---------|----------|
| X1 | <one line> | Bug | `<file:line>` |
