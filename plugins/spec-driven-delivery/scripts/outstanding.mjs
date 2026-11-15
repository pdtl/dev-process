#!/usr/bin/env node
// Writes docs/outstanding.md: one page of everything still open — the inbox, the unticked tasks,
// the deferrals and the ledger's triggers — read from the files the plugin's skills keep.
//
//   node outstanding.mjs [--root <project>] [--out <file>] [--stdout]
//
// It only reads docs/decisions.md, docs/tasks.md and docs/issues/inbox.txt, and writes one file.
// Node built-ins only. It reports what the files say; it cannot tell whether a trigger has fired.
// That stays the phase gate's job (phase-gate §4).

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const root = opt("--root", process.cwd());
const out = opt("--out", join(root, "docs/outstanding.md"));
const toStdout = args.includes("--stdout");

const read = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : null);
const oneLine = (s) => s.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
const clip = (s, n = 200) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const firstSentence = (s) => {
  const flat = oneLine(s);
  const m = flat.match(/^(.+?[.?!])(\s|$)/);
  return clip(m ? m[1] : flat);
};

// ── Tasks ────────────────────────────────────────────────────────────────────────────────────
// `- [ ] T1.2 [P] · Title *(D4)*` under a `## ` heading. Ticked tasks are history.
function parseTasks(text) {
  const open = [];
  let section = "";
  for (const line of text.split("\n")) {
    const h = line.match(/^##\s+(.*)/);
    if (h) section = oneLine(h[1]);
    const t = line.match(/^\s*- \[ \] (T[\w.]+)(?:\s+\[P\])?\s*[·—–-]\s*(.*)/);
    if (t) open.push({ id: t[1], title: oneLine(t[2]), section });
  }
  return open;
}

// ── Inbox ────────────────────────────────────────────────────────────────────────────────────
// Numbered, freeform items; `#` lines are the header's record of what was handled.
function parseInbox(text) {
  const items = [];
  let cur = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("#")) continue;
    const m = line.match(/^(\d+)\.\s+(.*)/);
    if (m) {
      cur = { n: m[1], text: m[2] };
      items.push(cur);
    } else if (cur && line.trim()) cur.text += ` ${line.trim()}`;
    else if (!line.trim()) cur = null;
  }
  return items;
}

// ── Decisions ────────────────────────────────────────────────────────────────────────────────
// Two shapes are read: the template's (`## D1 — Title` with `**Status:**` and `**Type:**` lines)
// and the bracketed one (`### D1 · [deferred] Title`, open while under an Open heading).
const CLOSED_SECTION = /resolved|closed|superseded|archive|done/i;
const SAYS_CLOSED =
  /^(?:\*\*)?(?:✅\s*)?(?:resolved|closed|superseded)\b|\[[^\]]*(?:→|->)\s*(?:resolved|closed|superseded)[^\]]*\]/im;

function parseDecisions(text) {
  const lines = text.split("\n");
  const entries = [];
  let section = "";
  let cur = null;
  for (const line of lines) {
    const head = line.match(/^(#{2,4})\s+(D\d+)\s*[·—–:-]\s*(.*)/);
    if (head) {
      cur = { id: head[2], heading: head[3], body: [], section };
      entries.push(cur);
      continue;
    }
    const sec = line.match(/^##\s+(.*)/);
    if (sec) {
      section = sec[1];
      cur = null;
      continue;
    }
    if (cur) cur.body.push(line);
  }
  return entries.map((e) => {
    const body = e.body.join("\n");
    const bracket = e.heading.match(/^\[([^\]]+)\]\s*(.*)/);
    const typeLine = body.match(/\*\*Type:\*\*\s*([^\n]+)/);
    const statusLine = body.match(/\*\*Status:\*\*\s*([^\n]+)/);
    const kind = oneLine(bracket ? bracket[1] : typeLine ? typeLine[1] : "untyped")
      .toLowerCase()
      .replace(/\s*(?:→|->).*$/, "");
    const title = oneLine(bracket ? bracket[2] : e.heading);
    const status = statusLine ? oneLine(statusLine[1]) : "";
    const closedByStatus = /^(closed|superseded)/i.test(status);
    const closedBySection = CLOSED_SECTION.test(e.section) && !/open/i.test(e.section);
    const firstPara = body.trim().split(/\n\s*\n/)[0] ?? "";
    const saysClosed = SAYS_CLOSED.test(e.heading) || SAYS_CLOSED.test(firstPara);

    const triggers = [];
    const tre = /Revisit when\s*(?:\(([^)]*)\))?[^:\n]*?(?::\*\*|\.\*\*|:)\s*([\s\S]*?)(?=\n\s*\n|\n\s*- \*\*|\n\*\*|$)/g;
    for (const m of body.matchAll(tre)) {
      const tag = (m[1] ?? "").toLowerCase();
      const k = /\bfact\b/.test(tag) && !/\bevent\b/.test(tag) ? "fact" : /\bevent\b/.test(tag) && !/\bfact\b/.test(tag) ? "event" : "untagged";
      triggers.push({ kind: k, text: clip(oneLine(m[2]), 220) });
    }
    const taskRefs = [...new Set(body.match(/\bT(?:X|\d+)\.\d+\b/g) ?? [])];
    return {
      id: e.id,
      kind,
      title,
      open: !closedByStatus && !closedBySection,
      saysClosed,
      triggers,
      taskRefs,
    };
  });
}

// ── Assemble ─────────────────────────────────────────────────────────────────────────────────
const tasksText = read("docs/tasks.md");
const inboxText = read("docs/issues/inbox.txt");
const decisionsText = read("docs/decisions.md");

const openTasks = tasksText ? parseTasks(tasksText) : [];
const openTaskIds = new Set(openTasks.map((t) => t.id));
const inbox = inboxText ? parseInbox(inboxText) : [];
const entries = decisionsText ? parseDecisions(decisionsText).filter((e) => e.open) : [];
const isDeferral = (e) => /defer/.test(e.kind);
const deferrals = entries.filter(isDeferral);
const untasked = deferrals.filter((e) => !e.taskRefs.some((id) => openTaskIds.has(id)));
const saysClosed = entries.filter((e) => e.saysClosed);
const facts = entries.flatMap((e) => e.triggers.filter((t) => t.kind === "fact").map((t) => ({ e, t })));
const untagged = entries.filter((e) => e.triggers.length && e.triggers.every((t) => t.kind === "untagged"));
const noTrigger = entries.filter((e) => !e.triggers.length);

const byKind = {};
for (const e of entries) byKind[e.kind] = (byKind[e.kind] ?? 0) + 1;

const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const L = [];
L.push("# Outstanding", "");
L.push(
  `As of ${date}. Generated from \`docs/decisions.md\`, \`docs/tasks.md\` and \`docs/issues/inbox.txt\` by the`,
  "`spec-driven-delivery` plugin at the end of each phase. Don't edit it by hand: change those files,",
  "and the next phase's copy follows. It lists what the files say; whether a trigger has fired is the",
  "phase gate's call.",
  "",
);

L.push("## Needs a look", "");
const flags = [];
if (saysClosed.length)
  flags.push(
    `**Filed as open, but says it's closed** (archive at the next gate): ${saysClosed.map((e) => e.id).join(", ")}.`,
  );
if (untasked.length)
  flags.push(
    `**Deferrals with no open placeholder task** (${untasked.length}): ${untasked.map((e) => e.id).join(", ")}. Each needs a task, or a note that it was dropped.`,
  );
if (facts.length)
  flags.push(
    `**Fact triggers, re-tested at every gate** (${facts.length}): ${[...new Set(facts.map(({ e }) => e.id))].join(", ")}. Listed in full below.`,
  );
if (untagged.length)
  flags.push(
    `**Triggers that don't say whether they're a fact or an event** (${untagged.length} entries). Tag each as the sweep reads it.`,
  );
if (noTrigger.length)
  flags.push(`**Open entries with no Revisit-when line** (${noTrigger.length}): ${noTrigger.map((e) => e.id).join(", ")}.`);
L.push(...(flags.length ? flags.map((f) => `- ${f}`) : ["Nothing."]), "");

L.push(`## Inbox: ${inbox.length} open`, "");
if (!inboxText) L.push("No `docs/issues/inbox.txt`.", "");
else L.push(...(inbox.length ? inbox.map((i) => `- **${i.n}.** ${firstSentence(i.text)}`) : ["Empty."]), "");

L.push(`## Open tasks: ${openTasks.length}`, "");
if (!tasksText) L.push("No `docs/tasks.md`.", "");
else if (!openTasks.length) L.push("None.", "");
else {
  let section = null;
  for (const t of openTasks) {
    if (t.section !== section) {
      section = t.section;
      L.push("", `**${section || "(no section)"}**`, "");
    }
    L.push(`- ${t.id} · ${t.title}`);
  }
  L.push("");
}

L.push(`## Deferrals: ${deferrals.length}`, "");
if (!deferrals.length) L.push("None.", "");
for (const e of deferrals) {
  const tasks = e.taskRefs.filter((id) => openTaskIds.has(id));
  const trig = e.triggers[0];
  L.push(
    `- **${e.id}** ${e.title}${tasks.length ? ` (${tasks.join(", ")})` : " *(no open task)*"}`,
    `  - Revisit when${trig ? ` (${trig.kind}): ${trig.text}` : ": *(no trigger)*"}`,
  );
}
L.push("");

if (facts.length) {
  L.push("## Fact triggers", "");
  for (const { e, t } of facts) L.push(`- **${e.id}** ${clip(e.title, 90)}: ${t.text}`);
  L.push("");
}

L.push("## The ledger", "");
L.push(
  `${entries.length} open entries: ${Object.entries(byKind)
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${n} ${k}`)
    .join(", ")}.`,
  "",
);

const md = `${L.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
if (toStdout) process.stdout.write(md);
else {
  writeFileSync(out, md);
  console.log(
    `${relative(root, out)}: ${inbox.length} inbox, ${openTasks.length} open tasks, ${deferrals.length} deferrals (${untasked.length} without a task), ${entries.length} open entries.`,
  );
}
