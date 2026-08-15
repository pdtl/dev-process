---
name: visual-pass
description: Iterate on look and feel without regressing behaviour — checkpoint the functional layer, write an aesthetic brief, move every visual value into tokens, then change only tokens. Use when functionality is solid and the work is styling, theming, reskinning, spacing, typography, or a design refresh. Triggers on "visual pass", "reskin", "make it look better", "design refresh", "polish the UI", "new theme", "change the palette", or when the user says functionality is locked and asks for aesthetic work.
---

# Visual pass

Visual exploration is **divergent** — many valid answers, judged by eye. Functional work is
**convergent** — one correct answer, judged by tests. They need different processes, and
mixing them in one turn is what causes regressions: an instruction to "clean this up and
also fix the date bug" reliably produces a worse version of both.

The core principle is **decoupling**. The functional spec governs behaviour; the design
spec governs appearance; you iterate each independently.

## Before any visual work

**1. Lock the functional layer, and checkpoint it.** This is the most important item here.
Don't iterate visually on unstable functionality — visual churn masks functional
regressions, and you will not be able to tell which change broke what. Complete functional
validation, then checkpoint explicitly: an annotated tag, a locked spec version. Now the
guarantee is auditable rather than remembered.

If a functional change genuinely must land during a visual pass, re-checkpoint. Don't let
the tag quietly stop meaning what it says.

**2. Write the aesthetic brief.** Two or three sentences constrains the space enormously and
makes iteration directed instead of random: target mood, reference points, and — the part
people skip — **what not to do**. Put it at the top of `docs/design-spec.md`.

**3. Define a visual acceptance criterion.** Subjective is fine; *absent* is not, because
without one there is no stopping condition and the pass runs until someone gets tired.
Something like: *"reads as professional and minimal, not cluttered; passes a five-second
glance test with a non-technical stakeholder; every scheme passes AA contrast."*

**4. Branch.** Explore variants as branches from the working state, not edits in place, so
you can compare approaches without risking the functional baseline.

## The token layer

**Every visual value — colour, spacing, font size, radius, shadow, duration — is a named
token, never a literal.** Then a visual iteration is a token swap rather than a code
rewrite: the behaviour doesn't move, only the skin.

This is worth enforcing rather than intending, because a token layer's promise is only as
good as its least careful call site. Two failure modes, both seen in the wild:

- **A token that resolves at build time is a constant.** In one framework,
  `theme.palette.divider` inside a style override resolves at *theme-creation* time and
  bakes the default scheme's literal into the rule, while `theme.vars.palette.divider` emits
  a CSS variable that re-resolves per scheme. **They read identically in a diff**, and in
  whichever scheme happens to be the default they behave identically too. Three call sites
  shipped constants inside a theme that "had tokens". Prefer the indirection that survives
  being read, and treat any literal inside the theme's own overrides as suspect.
- **A surface your token system doesn't own** keeps whatever it had. A crash page was still
  rendering the framework's default blue, from before a full reskin, because nothing routed
  it through the theme and nothing scanned it.

If the product draws to a canvas or any non-DOM surface, it gets its **own** token map read
by the painter — same discipline, different consumer — so a recolour never becomes a change
in painter logic.

## Contrast and colour are gates, not taste

- **Colour is never the sole carrier of meaning.** Anything encoded by colour is also encoded
  by shape, position, or a text label.
- **Audit every scheme the product ships, not the default one.** If a theme has N schemes,
  the contrast gate loops N times. A scheme nothing scans is a scheme nobody has checked —
  one project's dark mode drew a light hairline border on every card for seven phases, and
  an unselected control composited to 4.49:1, an AA failure by one hundredth.
- **If a surface can't be reached by the usual accessibility tool, give it its own check.** A
  canvas is one opaque element to axe, so the app's primary surface had no automated contrast
  coverage at all and a palette edit could have pushed a label under threshold with the whole
  suite green. It now has a unit test that composites alpha and measures ratios directly.
  *"Our tool doesn't cover it"* is the reason to write a check, not the reason there isn't
  one.
- **More palettes are an axis, not more schemes.** If you want several palettes and
  light/dark, model it as palette × scheme with an override layer, so every gate loops the
  product and a palette that can't pass contrast can't be added quietly.

## While iterating

- **Keep the pass token-only.** If a change requires touching component or painter logic,
  stop and ask whether it is really a functional change wearing a visual costume.
- **Separate the turns.** "Functionality is locked — iterate only on visual polish: tighten
  spacing, improve typographic hierarchy, make the primary action more prominent." Mixing
  aesthetic and functional instruction in one prompt causes regressions.
- **Screenshot every scheme and orientation, and look at them.** Four images per surface,
  not one. This is where visual work is actually verified — see `task-close`.
- **Record decisions in `docs/design-spec.md`** as you make them: the type scale, the token
  names and their intent, component states. Otherwise every visual decision is
  re-litigated at the next iteration.

## Closing the pass

- The design spec describes the shipped result, not the intention.
- Every scheme and palette has been contrast-scanned, including any surface with its own
  check.
- Screenshots are retaken and committed.
- The functional checkpoint still holds — or was re-cut deliberately, and the tag says so.
