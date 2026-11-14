# Decisions

Ledger of **compromises, load-bearing assumptions, and deferred decisions** — logged as they
are made, each with a revisit trigger. Not a design-rationale document: if a choice had no
cost and no alternative worth naming, it doesn't belong here.

**Every entry that defers work also has a placeholder task in `docs/tasks.md`.** This ledger
is a record, not a queue — an entry with no task is only ever found by someone who goes
looking, which in practice means a user, in testing, several phases later.

Swept at every phase boundary by the `phase-gate` skill, which reads the **Revisit when**
lines, not the entries. So keep each trigger's first line self-contained, and start it with
its kind:

- **(fact)**: an external condition (a library, a network, a limit, a measurement). It is
  **re-tested, not re-read**, at every sweep.
- **(event)**: something the project will do. Name it in the words a future task would use,
  so `task-breakdowner` finds it when that work is planned.

Closed and superseded entries move to `docs/archive/decisions.md` at the next phase gate, so
this file holds only what is open.

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

**Revisit when (fact | event).** <The trigger, self-contained on this first line. A fact, such
as "the network can't reach it", "no tooling exists yet" or "the library doesn't support it",
names the check `phase-gate` will re-run. An event, such as "a second export format is
specified", names the work in the words its task would use.>

**Task.** `T<n>.<m>` — <the placeholder, or "dropped, not deferred" with the reason.>

---

<!-- When a task closes PART of a deferral, amend the entry. A stale entry lies in the safe
     direction too: it inflates the backlog and invites the next person to rebuild something
     that already exists. One went eighteen phases describing work that was done. -->
<!-- An existing ledger without trigger kinds adopts them at its next sweep: tag each trigger
     (fact) or (event) as the sweep reads it. -->
