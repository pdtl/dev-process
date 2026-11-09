# Release notes: the house style

<!-- Copy to docs/release-notes-style.md when the project publishes release notes. Replace the
     example at the bottom with one of the project's own real notes, and adjust "What the page
     allows" to what its renderer accepts. Delete this comment. -->

How a public release note is written. The changelog is the complete record; a release note is for
someone using the product, and says only what they would notice: what they can now do, what works
differently, what was broken and is fixed, and what, if anything, they need to do about it.

**Pick the style on a real note, not in the abstract.** Rewrite one recent note four ways (terse,
warm, playful, thorough) and let the owner choose. This guide is the thorough one: a summary first,
changes grouped by area, and a plain *What to do:* wherever a reader has to act. If the owner
prefers another, change this file before writing a second note.

## The shape

1. **A title that names what the release covers**, most important first, in at most three parts:
   *Saved filters, a shorter checkout, and a duplicate-invoice fix*. A release with one change gets
   a short statement of it: *Exports finish on large accounts*. Never a slogan: no *Introducing…*,
   no exclamation mark.
2. **One sentence saying what the release does**, usually beginning *This release*, naming its two
   or three biggest changes. It is the first thing in the note, before any list or label. For a
   one-change release it can be the whole note.
3. **The changes, one per bullet, most important first.** Each bullet is one to three sentences
   saying what is different now. A fix also says what used to happen ("were sent twice when your
   connection dropped"), so a reader can tell whether it explains something they saw.
4. **Groups, when the changes fall into more than one area and there are more than four of them.**
   Each group has a short label naming the area as a reader would (*Filters*, *Checkout*), followed
   by its bulleted list. A shorter release is one flat list.
5. **Fixes last.** In a grouped note they go under a final *Fixes* label; in a flat list they are
   its last bullets. A fix is something that didn't work as it should and now does. A change that
   only works better is not a fix.
6. **_What to do:_ wherever a reader has to act**, to get a change or to undo the effect of a bug.
   It ends the bullet it belongs to, in italics, followed by the action: *What to do: if a customer
   received two, void the later one.* Link the page where they would act if it has a fixed address.
   A change that needs nothing from the reader has no *What to do:* at all, never *What to do:
   nothing*.

## Voice

- **Second person and neutral.** "You", never "we". No jokes, no apologies, no exclamation marks: a
  reader judges the release by what it says, and a precise sentence reads as care.
- **Present tense for what is true now**, past tense for what used to happen.
- **Exact over approximate:** "30 requests a month, separate from your 15 drafts", not "a generous
  allowance".
- **On-screen names exactly as they appear, in italics:** buttons, steps, options and messages. A
  page is named plainly: your settings, your profile.
- **The changelog's rules still hold:** lead with the consequence, and name the page or control
  people see. No task or decision identifiers, and no file names.

## What the page allows

Paragraphs, bulleted lists, bold, italic and links. Within that:

- **Bold is only for a group label.** Never inside a sentence, and never to lead a bullet. When
  every bullet starts in bold, nothing stands out.
- **A label has to be a real heading, one level below the release's title.** A bold line reads as a
  heading to the eye and as nothing to a screen reader, and no accessibility scan can tell the
  difference (WCAG 1.3.1). On one project the first grouped notes passed every automated scan with
  this defect, and only a phase-gate walk found it.
- **Italics for on-screen names and for _What to do:_.**
- **A link goes to the page where the reader would act**, not to an explanation elsewhere.

## What goes in, and what stays out

- **In:** anything a person using the product would notice, including a small change and a feature
  few people use, if they would notice it.
- **Out:** admin-only pages, tests, tooling, and the changelog's *Behind the scenes* items, unless a
  user would notice their effect. A release with nothing a user would notice records that it has no
  public note, so a skipped release can't be mistaken for a forgotten one.
- **Nothing the changelog section doesn't say.** A note may leave things out of its section, never
  add to it. A *What to do:* is the one exception, since it follows from what the section says.

## Rewording a released note

A released note may be reworded. Its facts stay those of its changelog section; only the wording
changes. Check first whether anyone has edited it in production, so a rewording can't silently
replace a correction.

## How a note ships

- **Write it when the release's PR opens**, from its changelog section, undated like the heading.
- **Date it with the heading**, in the last commit before the merge.
- **Carry it in the PR description, title and text word for word**, so the owner reads exactly what
  the merge will publish.

## What a check can hold, and what the review does

A test can hold the shape. Fail a note that:

- opens with a list or a label rather than a sentence;
- uses bold anywhere but a label;
- has a label with no bulleted list after it.

Prove the check on the notes written before the style existed. On one project it failed six of
nine, which is what shows it reads the real thing.

Everything else is the owner's review of the PR description. No check can judge whether a sentence
is true, whether the most important change comes first, or whether a reader has something to do.

## Example

> **Saved filters, a shorter checkout, and a duplicate-invoice fix**
>
> This release lets you save filters, takes a step out of checkout, and fixes a bug that sent some
> invoices twice.
>
> **Filters**
>
> - You can save any filter on your Invoices page and reuse it from *Saved filters*.
> - A saved filter keeps its date range, so *Last 30 days* stays the last 30 days.
>
> **Checkout**
>
> - Checkout has two steps instead of three. Your billing address is confirmed on *Payment*.
> - A declined card now says why, whenever the bank gives a reason.
>
> **Fixes**
>
> - Invoices sent while your connection dropped were sometimes sent twice. *What to do:* if a
>   customer received two, void the later one.
