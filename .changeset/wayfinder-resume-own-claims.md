---
"mattpocock-skills": patch
---

Wayfinder now resumes a ticket you claimed and never finished, instead of stepping over it.

A claim exists so competing sessions don't take the same ticket, so the frontier excluded every claimed ticket — including your own. Continuing a map without naming a ticket therefore skipped the one you were in the middle of and started something else. The frontier now excludes only tickets claimed by someone else, and sorts your own unfinished claims to its head. Where a tracker records a claim without recording a claimant, every claim still reads as someone else's; the local-markdown tracker now records the claimant so it can tell the difference.
