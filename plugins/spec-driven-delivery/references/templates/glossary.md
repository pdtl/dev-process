# Glossary

The product's domain nouns, one line each. Half a page, added to as features land.

**Why it exists:** nothing else in the process compares a *new* feature's vocabulary against
the *existing* one. On one project, phase 5 shipped an ad-hoc way to compare items and phase
6 shipped a named, saveable "combination" of the same items — the same concept under two
names, producing two confusingly similar ways to share, which is exactly what the user
objected to. The spec carried the duplication too, because each feature was derived
top-down from its own section.

A glossary makes duplication visible the moment it appears, while the fix is still a naming
decision rather than a migration. `phase-gate` checks new nouns against it every phase.

| Noun | Definition | Not to be confused with |
|---|---|---|
| **<Noun>** | <One line. What it *is*, not how it's stored.> | <the near-miss> |
