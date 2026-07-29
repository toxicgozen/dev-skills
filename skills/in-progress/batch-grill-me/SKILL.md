---
name: batch-grill-me
description: A relentless interview that asks every frontier question at once, round by round.
disable-model-invocation: true
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask *now* without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Each round the user answers reshapes the tree — settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a *later* round, not this one.

Finding *facts* is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it — don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report — ask the rest of the frontier now. The *decisions* are the user's — put each to them and wait.

Before recommending an answer, distinguish local preference, repository fact, your own synthesis, and external prior art. When the recommendation would introduce or change a framework, record shape, policy, or claimed best practice, treat relevant external prior art as a fact prerequisite and research primary sources first. Skip that research only when the choice is explicitly repository-local and outside practice cannot change it. Say when the recommendation is your synthesis rather than established practice. Treat that research as an unsettled prerequisite only for the questions that depend on it; continue with the rest of the frontier.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
