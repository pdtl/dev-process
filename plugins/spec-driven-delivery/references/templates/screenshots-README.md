# Screenshots

Visual evidence for tasks and issues, referenced from `docs/tasks.md`, `docs/decisions.md`
and the issue rounds. Naming follows whatever produced it: `t<phase>.<n>-*` for a task,
`i<n>-*` for an issue.

**These are produced deliberately, not by the test suite.** A suite that writes into this
directory on every run makes unrelated diffs carry binary churn, and a real screenshot
update becomes indistinguishable from noise. Point test captures at the runner's own output
directory instead. Which means:

- a committed screenshot is only as current as the last time someone took it on purpose;
- **if a change makes one wrong, retake it in the same commit.**

Take them at a fixed viewport with `deviceScaleFactor: 2`, and cover **every scheme and
orientation** the surface supports whenever the change touches anything that draws — four
images, not one.

And then **look at them** — specifically at the frame that should have changed, not the one
that already worked. A screenshot capturing a bug was once taken, saved, and never opened,
in the same run that reported success. Capturing an image and moving on is the same as not
capturing it.
