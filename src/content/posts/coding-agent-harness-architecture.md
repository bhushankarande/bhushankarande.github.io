---
title: "The Model Is Smart. The Harness Decides Whether It's Useful."
date: 2026-06-24
description: "Why coding-agent reliability depends less on raw model intelligence and more on the operating system around it: instructions, context, tools, sandboxes, memory, and verification."
tags: ["Agentic AI", "Coding Agents", "Production AI", "System Design"]
image: "/assets/images/posts/coding-agent-harness-architecture.png"
math: false
draft: false
---

A coding agent with a strong model but a weak harness feels like giving a brilliant junior engineer root access to production, no tickets, no tests, and a vague instruction like "fix the thing."

Maybe they succeed.

Maybe they delete the wrong file, misunderstand the repo structure, confidently patch the symptom instead of the cause, and then explain their reasoning very politely while the CI pipeline burns.

That's the part we don't talk about enough. Model intelligence matters, obviously. Better reasoning, better code understanding, better tool use - all of that helps. But once the model is good enough to be dangerous, the bigger question becomes: what system are we putting around it?

I've started thinking of this system as the **harness**.

The harness is everything around the model that turns raw capability into operational reliability. Instructions. Context. Tools. Sandboxes. Memory. Workflow rules. Verification. Logging. Escalation. The boring stuff, basically.

And in production engineering, the boring stuff is usually what keeps things alive.

<figure class="post-figure">
  <img src="/assets/images/posts/coding-agent-harness-architecture.png" alt="Coding agent harness architecture diagram showing model, context, tools, sandbox, memory, and verification layers.">
  <figcaption>Coding agent harness architecture: model, context, tools, sandbox, memory, and verification.</figcaption>
</figure>

## The soldier analogy

A useful mental model is a soldier.

Imagine you have a soldier with excellent fighting skills. Great reflexes, good aim, strong endurance, fast decision-making under pressure. That sounds valuable.

But now imagine that same soldier has low strategic judgment. They don't know which battles matter. They don't know when to retreat. They don't know when to ask for air support. They don't know the difference between a training exercise and an active battlefield.

That's a lot less useful.

The answer is not only "make the soldier stronger." You also need command structure, maps, objectives, rules of engagement, communication channels, supply lines, and after-action reviews.

That's the harness.

For AI agents, especially coding agents, the model is the soldier. The harness is the operational system that tells it what to do, what not to do, where to look, when to stop, and how to prove it actually succeeded.

## Instructions are not decoration

Most people start with instructions because they're the most visible part of the harness.

"You are a senior backend engineer."

"Follow the existing code style."

"Do not modify public APIs without approval."

"Run tests before claiming the task is done."

This is useful, but instructions are not magic spells. They're closer to standing operating procedures.

Good instructions move repeated guidance out of the user's prompt and into the environment. The agent shouldn't need to be reminded every time that it must avoid unrelated refactors, preserve formatting, or ask before touching migration files. That should already be encoded.

For a coding agent, instructions define the operating posture. Is it allowed to make broad changes? Should it prefer minimal diffs? Should it explain tradeoffs before editing? Should it treat failing tests as blockers or warnings?

A model without this guidance may still write good code. But it won't behave consistently.

## Context delivery: give the agent the map

A lot of agent failures are not reasoning failures. They're context failures.

The agent changes the wrong function because it didn't see the relevant caller. It adds a new utility because it didn't know one already existed. It patches a test instead of the bug because it didn't have the failing logs. It makes an architectural decision without reading the design doc sitting three folders away.

Context delivery is the harness deciding what the model needs before it acts.

For a coding task, that might mean automatically providing:

- The failing test output.
- The files related to the stack trace.
- The README or architecture notes for that module.
- Recent commits touching the same area.
- Relevant lint rules or style conventions.
- API contracts, schema definitions, or generated types.

The important bit is that the model should not have to discover everything from scratch every time. Discovery is expensive, unreliable, and easy to mess up when the context window is already crowded.

## Context management: protect the model's attention

Giving an agent more context is not always better. Past a point, you're just handing it a junk drawer.

Large context windows are useful, but attention is still limited. If you dump twenty files, three logs, two docs, and a Slack thread into the prompt, the model may miss the one line that actually matters.

Context management is the harness acting like a staff engineer who knows what to include and what to leave out.

This is where retrieval, ranking, summarization, and compaction matter. The harness should be able to say: "These three files are probably relevant. This old log is noise. This design doc matters, but only the section on retry behavior. This previous agent trace can be summarized into two facts."

For coding agents, this is a big deal. Repositories are full of traps: deprecated modules, old experiments, duplicate utilities, dead tests, stale docs. The agent needs context, but it also needs context hygiene.

## Tools turn talk into work

A chat model can explain how to fix a bug. A coding agent needs to inspect files, edit code, run tests, call APIs, open pull requests, and maybe check deployment status.

That means tool interfaces are part of the harness.

A good tool interface gives the model structured, safe ways to act. Instead of "do anything on this machine," the agent gets bounded capabilities: read file, search repo, edit file, run unit tests, inspect logs, create patch, request approval.

Frameworks like MCP-style tool interfaces are useful here because they make tools explicit and composable. The model can interact with the outside world, but through a controlled contract.

That contract matters. A vague shell tool is powerful, but risky. A typed tool like `run_tests(target="payments")` is less flexible, but often much safer. The harness decides where flexibility is worth the risk.

## Execution environments are the blast shield

Sooner or later, an agent will run something weird.

Maybe it installs the wrong package. Maybe it executes a script with side effects. Maybe it tries to "clean up" generated files and removes something important. Not because it's malicious. Because software is messy and the model is guessing.

This is why execution environments matter.

A coding agent should run inside a secure, bounded workspace: sandbox, container, temporary checkout, restricted network, limited credentials. The agent should be able to make mistakes without damaging real systems.

The harness should assume failure is normal. Not catastrophic. Normal.

That one mindset shift changes the design. You stop asking, "How do we make sure the agent never messes up?" and start asking, "When it messes up, what can it touch?"

## Durable state: memory outside the model

The model's context is transient. The task is not.

A reliable agent needs durable state: task plans, attempted fixes, test results, logs, diffs, approvals, generated artifacts, and open questions. This state should live outside the model so progress survives across retries, interruptions, compaction, and handoffs.

Think of it like a work journal.

If an agent tried three approaches and two failed, the next loop should not rediscover those failures. If a human approved a risky migration plan, that approval should be recorded. If the agent generated a patch, test output should be attached to it.

Without durable state, agents get amnesia. And amnesic engineers are expensive.

## Orchestration: the workflow around the loop

The common picture of an agent is a loop: think, act, observe, repeat.

Real systems need more than that.

They need lifecycle hooks. Retry policies. Timeouts. Approval gates. Escalation paths. Rollback behavior. Budget limits. Stop conditions. Human review checkpoints.

For example, a coding agent could be allowed to freely edit test files and implementation files in a sandbox. But if it wants to touch database migrations, authentication middleware, billing logic, or deployment config, the harness should require approval.

That's not slowing the agent down. That's putting guardrails around high-impact actions.

## Sub-agents and skills: don't make one model do every job

As tasks grow, one giant agent loop becomes clumsy. Too much context. Too many objectives. Too many ways to drift.

Sub-agents help by splitting work into smaller bounded loops. One agent investigates the bug. Another writes the patch. Another reviews the diff. Another runs verification. Each has a narrower job and a smaller context footprint.

Skill layers are related. They're reusable procedures or playbooks the system can call instead of making the agent invent a process every time.

For example, "fix failing Python test" can become a skill:

1. Reproduce the failure.
2. Identify the smallest relevant code path.
3. Patch implementation, not the test, unless the test is clearly wrong.
4. Run the targeted test.
5. Run the surrounding test file.
6. Summarize the diff and evidence.

That sounds mundane. Good. Reliable systems are built out of mundane procedures.

## Concrete example: the billing bug

Imagine a coding agent gets this task:

"Fix the rounding bug in invoice totals."

A weak harness gives it the repo and says, "Go."

The agent searches for "invoice," finds a function called `calculate_total`, changes float rounding, updates a snapshot test, and reports success.

But the real system uses a separate tax calculation path for enterprise accounts. The failing bug was in a shared decimal utility, not the invoice formatter. The agent patched the visible symptom.

A stronger harness behaves differently.

It attaches the production error report, failing test logs, relevant billing docs, ownership metadata, and files from the stack trace. It tells the agent billing changes require minimal diffs and targeted tests. It runs the agent in a sandbox. It blocks edits to migration files. It requires the agent to run billing unit tests and include the output. If the agent updates snapshots, it must explain why the expected behavior changed.

Same model. Very different reliability profile.

## Concrete example: asking for help is a feature

Another common failure mode: the agent sees something confusing and plows ahead anyway.

A good harness makes uncertainty operational.

Suppose the agent is asked to refactor an internal API, but it detects two conflicting patterns in the codebase. Half the callers use `client.execute()`, the other half use `client.run()`, and there's no obvious migration note.

The wrong behavior is to guess.

The better behavior is to stop and ask: "There are two active calling conventions. Should I preserve both, migrate one to the other, or limit this change to the new module?"

That requires instruction, but also workflow support. The harness needs a state like `blocked_on_human`, a way to surface the question, and a way to resume after the answer.

Asking for help is not weakness. For agents, it's a reliability primitive.

## Failure improves the harness

The best part of harness engineering is that failures become actionable.

If the agent missed a relevant file, add a retrieval rule.

If it made an unsafe change, add a permission gate.

If it claimed success without evidence, require test output.

If it got lost in context, improve ranking or compaction.

If it repeated a failed approach, write durable state.

If it kept solving the wrong subproblem, add a planning checkpoint.

This is a much healthier loop than simply blaming the model.

Yes, better models will help. But even very strong models need operating systems around them. The harness is where engineering judgment goes: what to expose, what to hide, what to automate, what to verify, and when to bring in a human.

That's the concept I find most useful: a coding agent is not just a model that writes code. It's a model embedded inside an engineered environment that shapes its behavior.

The model provides capability.

The harness provides discipline.

And discipline is what turns a clever demo into something you can actually trust with a repo.
