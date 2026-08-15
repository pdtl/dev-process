# dev-process

A Claude Code plugin marketplace holding the development process, extracted so it can be
reused across projects instead of copy-pasted between them.

## Install

```
/plugin marketplace add pdtl/dev-process
/plugin install spec-driven-delivery
```

Or, working locally:

```
/plugin marketplace add ~/Documents/dev/dev-process
```

## Plugins

### [`spec-driven-delivery`](plugins/spec-driven-delivery/) — v1.0.0

Idea → shipped software as a sequence of reviewable artifacts: refine the spec, architect
it, break it into tasks, then build under a working agreement with gates that actually
catch things.

Eight skills covering bootstrap, the three spec stages, per-task and per-phase rituals, the
issue-review loop, and visual passes. Plus `references/gate-blindness.md` — a catalogue of
the seven ways a passing check covers nothing, each with the defect that revealed it.

See its [README](plugins/spec-driven-delivery/README.md) for the short version of the rules.

## Where it came from

Distilled from [Parallel Timelines](https://github.com/pdtl/timelines) — thirty phases, six
hands-on review rounds, and fifteen lessons about the process itself. The rules live here;
the case studies that produced them stay in that repo, where they can be checked against the
code they describe.

The promotion path from a project lesson to a rule here is documented in the plugin README.
