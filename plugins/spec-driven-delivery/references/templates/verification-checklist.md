<!-- TEMPLATE for docs/operations/<accessibility|security|performance>-checklist.md.
     The shape matters more than the content: every claim names what verified it. -->

# <Accessibility | Security | Performance> checklist — <Project>

Checklist of the controls this project relies on **and how each one is verified**. Re-run
the automated checks before every release; walk the manual items whenever a change touches
<the relevant subsystems>.

**The rule this template exists to enforce:** every line says what *verified* it. A checked
box with no evidence behind it is a guess. One project carried a decision entry asserting a
component met contrast requirements, written about a page no gate could reach — it failed
the first time anything actually scanned it.

## Automated

- `<command>` — <what it covers>, asserted in `<path/to/test>`.
- `<command>` — <what it covers>, asserted in `<path/to/test>`.

**What these are blind to:** <state it explicitly. Every gate has a blind spot, and the
blind spot is where the defects are. See the plugin's `references/gate-blindness.md`.>

---

## 1. <Control group>

- [ ] **<Control, stated as a property that holds>** — <how it's implemented, `path/to/file`>.
      _Verified:_ `<test file>` / `<command>` / <a manual step, with the date it was walked>.

- [ ] **<Control>** — <implementation>. _Verified:_ <evidence>.
      _Not covered:_ <the residual gap, if any, and the `D<n>` that owns it.>

## 2. <Control group>

...

---

## Coverage notes

<Where a check is deliberately absent and why, each with a `D<n>`. This section is more
useful than a page of ticks: it is the only place that records what nobody is watching.>
