# dev-process

A Claude Code plugin marketplace holding the development process, extracted so it can be
reused across projects instead of copy-pasted between them.

## Plugins

### [`spec-driven-delivery`](plugins/spec-driven-delivery/)

Idea → shipped software as a sequence of reviewable artifacts: refine the spec, architect
it, break it into tasks, then build under a working agreement with gates that actually
catch things.

Eight skills covering bootstrap, the three spec stages, per-task and per-phase rituals, the
issue-review loop, and visual passes. A read-only `spec-reviewer` agent that checks each
phase against its spec. Plus `references/gate-blindness.md` — a catalogue of the seven ways
a passing check covers nothing, each with the defect that revealed it.

See its [README](plugins/spec-driven-delivery/README.md) for the short version of the rules.

Research notes (surveys of the field and ideas not yet adopted) are in [`research/`](research/).
They aren't part of the installed plugin.

---

# Installation

Needs Claude Code and git. Nothing else — the plugin is Markdown; there is no build step and
nothing to compile.

## 1. Add the marketplace

In a Claude Code session:

```
/plugin marketplace add pdtl/dev-process
```

Or from a shell:

```sh
claude plugin marketplace add pdtl/dev-process
```

Both accept a **GitHub `owner/repo`, a URL, or a local path** — so if you have the repo
cloned already, `claude plugin marketplace add ~/Documents/dev/dev-process` works and tracks
your working copy instead of GitHub. See [Working on the plugin](#working-on-the-plugin)
below for when that's what you want.

## 2. Install the plugin

```
/plugin install spec-driven-delivery
```

```sh
claude plugin install spec-driven-delivery
```

If more than one marketplace offers a plugin by that name, disambiguate with
`spec-driven-delivery@dev-process`.

### Choosing a scope

`--scope` (CLI) decides who gets it:

| Scope | Effect | Use when |
|---|---|---|
| `user` *(default)* | Every project you open | It's your personal process |
| `project` | Recorded in the repo's `.claude/settings.json` and committed | The whole team should get it on clone |
| `local` | This project, this machine, uncommitted | Trying it out on one repo |

```sh
claude plugin install spec-driven-delivery --scope project
```

**Restart Claude Code** after installing — plugin components are loaded at session start.

## 3. Verify

```sh
claude plugin list
claude plugin details spec-driven-delivery
```

`details` prints the component inventory and its **projected token cost**, which is worth
looking at: the eight skills are cheap because only their frontmatter descriptions load into
a session. The references and templates cost nothing until a skill reads one.

Then confirm it's live — in a session, `/spec-refiner` should resolve, and asking for a
"phase gate" should pull in `phase-gate`.

## 4. Remove any stale loose skills

**If you used `spec-refiner`, `spec-architect` or `task-breakdowner` before this plugin
existed**, they are sitting in `~/.claude/skills/` as unversioned copies. Anything under
that directory auto-loads as a `<name>@skills-dir` plugin, so leaving them there gives you
two skills with the same name and no way to tell which one answered.

The plugin's copies have edits the loose ones don't — the literal-example rule in
`spec-refiner`, vertical slicing and hybrid-TDD ordering in `task-breakdowner`, and
cross-links into `references/` in all three.

```sh
rm -rf ~/.claude/skills/spec-refiner \
       ~/.claude/skills/spec-architect \
       ~/.claude/skills/task-breakdowner
```

Do this **after** step 3 confirms the plugin versions are loading, not before.

## 5. Use it

On a new project:

```
/project-bootstrap
```

On an existing one, start wherever you are — the skills are independent. `phase-gate` and
`task-close` work on any repo with a `docs/` paper trail; `issue-round` needs somewhere to
put an inbox.

## Updating

**The plugin has no version number, and every push to `main` is a release.** Claude Code takes
the commit as the version when `plugin.json` names none, so there is nothing to bump. It used to
carry one, and a push that forgot to bump it never reached any project: Claude Code fetches a new
copy only when the version string changes. `claude plugin validate` warns "No version specified";
that warning is this decision, so don't add one back.

**Turn on auto-update once per machine.** Claude Code leaves it off for any marketplace that
isn't Anthropic's, so without it an install stays on whatever it first fetched. Either select
`dev-process` under **Marketplaces** in `/plugin` and choose **Enable auto-update**, or set it in
`~/.claude/settings.json`:

```json
"extraKnownMarketplaces": {
  "dev-process": {
    "source": { "source": "github", "repo": "pdtl/dev-process" },
    "autoUpdate": true
  }
}
```

Each interactive session then checks GitHub in the background a few minutes after your first
message and downloads any new commit. The session already running keeps the copy it loaded:
`/reload-plugins` switches it, and the next session starts on the new one.

To update by hand instead, it is two steps, because the marketplace caches its source:

```sh
claude plugin marketplace update dev-process   # refetch the catalogue
claude plugin update spec-driven-delivery      # update the plugin
```

Restart, or `/reload-plugins`, to apply.

## Uninstalling

```sh
claude plugin uninstall spec-driven-delivery
claude plugin marketplace remove dev-process
```

Or disable without removing: `claude plugin disable spec-driven-delivery`.

## Working on the plugin

To edit the process and see the change immediately, point the marketplace at your clone
rather than GitHub:

```sh
claude plugin marketplace add ~/Documents/dev/dev-process
```

For a one-session try-out with no install at all:

```sh
claude --plugin-dir ~/Documents/dev/dev-process/plugins/spec-driven-delivery
```

And before committing a change to a manifest or a skill's frontmatter:

```sh
claude plugin validate .                                  # the marketplace
claude plugin validate plugins/spec-driven-delivery       # the plugin
claude plugin validate plugins/spec-driven-delivery/skills
```

---

## Where it came from

Distilled from work on a personal project — thirty phases, six
hands-on review rounds, and fifteen lessons about the process itself. The rules live here;
the case studies that produced them stay in that repo, where they can be checked against the
code they describe.

The promotion path from a project lesson to a rule here is documented in the
[plugin README](plugins/spec-driven-delivery/README.md#adding-to-this-plugin).
