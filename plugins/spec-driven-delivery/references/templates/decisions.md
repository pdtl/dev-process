# Decisions

Ledger of **compromises, load-bearing assumptions, and deferred decisions** — logged as they
are made, each with a revisit trigger. Not a design-rationale document: if a choice had no
cost and no alternative worth naming, it doesn't belong here.

**Every entry that defers work also has a placeholder task in `docs/tasks.md`.** This ledger
is a record, not a queue — an entry with no task is only ever found by someone who goes
looking, which in practice means a user, in testing, several phases later.

Swept at every phase boundary by the `phase-gate` skill. Entries whose trigger is an
**external fact** are **re-tested, not re-read**.

---

## D1 — <short title>

**Status:** Open | Closed (`T<n>.<m>`, <date>) | Superseded by `D<n>`
**Phase:** <n>
**Type:** Compromise | Assumption | Deferral

**What we did.** <The choice, in one or two sentences.>

**Why.** <What made the better option unavailable or not worth it *now*. Be specific about
the constraint — "no time" ages badly; "the converter spike wasn't done and this blocked
three tasks" can be checked later.>

**What it costs.** <The consequence someone will actually hit. If you believe the cost is
zero, this probably isn't a decision worth logging.>

**Verified by.** <What you actually ran or read. Required for any claim that something is
fine. "Verified" with nothing behind it is a guess in a decision's clothes — one entry
asserting a component passed contrast was written about a page no gate could reach, and it
failed the first time anything scanned it.>

**Revisit when.** <The trigger. If it is an external fact — "the network can't reach it",
"no tooling exists yet", "the library doesn't support it" — say so explicitly, and expect
`phase-gate` to re-run the check rather than re-read this entry.>

**Task.** `T<n>.<m>` — <the placeholder, or "dropped, not deferred" with the reason.>

---

<!-- When a task closes PART of a deferral, amend the entry. A stale entry lies in the safe
     direction too: it inflates the backlog and invites the next person to rebuild something
     that already exists. One went eighteen phases describing work that was done. -->
