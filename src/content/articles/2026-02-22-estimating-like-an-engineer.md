---
title: "Estimating Like an Engineer: A PM's Perspective"
description: "Learn how PMs and engineers can align on effort estimation to build more predictable and trustworthy product delivery cycles."
publishDate: 2026-02-22
author: "Tshepo Machele"
disciplines: ["PM", "Engineering"]
tags: ["estimation", "planning", "sprint"]
featured: false
draft: false
---

Every product team has lived through this moment: a PM presents a feature to stakeholders with a confident timeline, only for engineering to push back with an estimate that is two or three times longer. The resulting tension erodes trust, derails planning, and ultimately slows the team down. The root cause is rarely laziness or sandbagging on either side. It is a fundamental mismatch in how PMs and engineers think about effort, risk, and complexity.

Estimation is one of the most deceptively difficult skills in product development. It sits at the intersection of technical depth, product intuition, and organizational communication. Getting it right requires both disciplines to step outside their defaults and build a shared language for what "done" actually means.

## Why Estimation Matters

Poor estimation is not just an inconvenience. It has cascading consequences that compound across quarters and erode a team's ability to deliver.

When estimates are consistently wrong, several things happen:

- **Stakeholder trust erodes.** Leadership begins to discount everything the team says about timelines, making it harder to secure resources or defend scope decisions.
- **Teams burn out.** When a two-week estimate turns into six weeks, the team absorbs the difference through overtime, cut corners, or deferred quality. None of these are sustainable.
- **Planning becomes theatrical.** If nobody trusts the numbers, sprint planning degrades into a ritual that teams endure rather than a process that guides execution. Backlogs balloon, priorities shift mid-sprint, and the feedback loop between delivery and strategy breaks down.
- **Opportunity cost goes unnoticed.** Bad estimates do not just delay the current project. They make it nearly impossible to reason about what the team should work on next, because nobody has a reliable picture of capacity.

The goal of estimation is not to predict the future with certainty. It is to create a shared understanding of effort, risk, and trade-offs that allows the team to make better decisions together. When PMs and engineers approach estimation as a collaborative exercise rather than a negotiation, the entire product development cycle improves.

## For PMs: Understanding the Engineering Mindset

The most common mistake PMs make in estimation conversations is treating complexity as a single dimension. When a PM looks at a feature, they tend to see it through the lens of user outcomes: how many screens, how many states, how visible is the change. Engineers see a different landscape entirely. They see database migrations, API contracts, edge cases, test coverage, deployment risk, and the accumulated weight of technical decisions made months or years ago.

**Learn to ask better questions.**

The best PMs do not ask "How long will this take?" as their opening move. That question forces engineers to collapse uncertainty into a single number before they have had time to think through the problem space. Instead, start with questions that surface the shape of the work:

- "What are the major pieces of work involved in this?" This invites engineers to decompose the problem rather than estimate it as a monolith. You will often discover that a feature you thought was one thing is actually five distinct pieces of work with different risk profiles.
- "Where are the unknowns?" Explicitly asking about uncertainty gives engineers permission to flag risks without feeling like they are making excuses. A PM who understands that the authentication integration is an unknown but the UI layer is well-understood can make better scope decisions.
- "What would a simpler version look like?" This question is gold. It signals that you are open to trade-offs and invites engineers to participate in shaping the solution rather than just pricing a spec. Often the simpler version delivers eighty percent of the value at thirty percent of the cost.
- "What could go wrong?" This is not pessimism. It is risk management. Engineers who have been through enough projects can usually identify the two or three things most likely to blow up a timeline. Surfacing those early is a gift to the planning process.

**Resist the urge to anchor.**

When you walk into an estimation session with a deadline already in mind, you contaminate the process. Even well-intentioned engineers will unconsciously adjust their estimates toward the number you have signaled. If you have a hard deadline, state it as a constraint, not an expectation. Say "We have a conference on March 15 and would love to demo this. What is realistic?" rather than "We need this by March 15."

**Respect the difference between effort and duration.**

A task that requires three days of focused engineering work might take two weeks of calendar time if the engineer is also handling on-call rotations, reviewing pull requests, and attending meetings. PMs who plan based on effort without accounting for context-switching and organizational overhead will always be surprised by outcomes.

**Build estimation literacy over time.**

Track your team's estimates against actuals. Not to punish misses, but to calibrate. Over time, you will develop an intuition for how your specific team estimates. Some teams consistently underestimate by thirty percent. Some overestimate short tasks and underestimate long ones. This data is incredibly valuable, and most teams never bother to collect it.

## For Engineers: Communicating Complexity Effectively

Engineers frequently complain that PMs do not understand technical complexity, but the truth is that engineers often do a poor job of communicating it. Saying "it is complicated" without explaining why is not helpful. Neither is retreating into jargon that your PM cannot follow.

**Break the work down visibly.**

When you estimate a feature, do not hand back a single number. Show your work. Break the feature into its component tasks and estimate each one. This serves multiple purposes: it gives the PM a map of the work, it identifies the riskiest pieces, and it creates natural points where scope can be adjusted.

For example, instead of saying "the search feature will take four sprints," try:

- Basic search query endpoint: 3 points
- Result ranking and relevance tuning: 5 points
- Search indexing pipeline: 8 points
- UI implementation with filters: 5 points
- Performance testing and optimization: 3 points
- Edge cases (empty states, special characters, pagination): 3 points

This breakdown immediately reveals that the indexing pipeline is the big-ticket item. The PM might ask whether an existing service could be leveraged, or whether a simpler ranking algorithm would suffice for version one. That conversation only happens when the work is visible.

**Distinguish between known and unknown work.**

Not all tasks carry the same level of uncertainty. A CRUD endpoint that follows established patterns in your codebase is highly predictable. An integration with a third-party API you have never used before is not. Make this distinction explicit in your estimates. You might say "The UI work is a confident estimate. The payment provider integration has significant unknowns because we have not worked with their sandbox environment before, and their documentation is sparse."

**Use ranges instead of points.**

A single number creates a false sense of precision. A range communicates uncertainty honestly. "This will take between two and five days" is more useful than "This will take three days" if the variance is real. The width of the range itself is information. A narrow range means you understand the work well. A wide range means there are unknowns that need investigation.

**Propose spikes for genuinely uncertain work.**

When you truly do not know how long something will take, the honest answer is "I need to investigate before I can estimate." Propose a time-boxed spike: a day or two of focused exploration to answer the key technical questions. This is not a failure of estimation. It is a mature response to genuine uncertainty, and it produces much better estimates than guessing.

**Account for quality work in your estimates.**

Tests, documentation, code review, refactoring, and deployment are all part of shipping a feature. If your estimates only cover writing the initial code, you are systematically underestimating. Be explicit about what is included: "My estimate includes unit tests and integration tests but not load testing. If we need load testing, add two more days."

**Flag dependencies early and loudly.**

If your estimate depends on another team's API being ready, or a design being finalized, or an infrastructure change being deployed, say so immediately. Dependencies are the number one killer of estimates. A task that takes three days of engineering work but requires sign-off from a team that has a two-week review cycle does not take three days. It takes at minimum two weeks and three days.

## Bridging the Gap: Collaborative Estimation Practices

The best estimation happens when PMs and engineers stop treating it as a handoff and start treating it as a conversation. Here are practices that effective teams use to build shared understanding.

**Three Amigos estimation sessions.** Before committing to an estimate, bring together a PM, an engineer, and a designer (if relevant) to walk through the feature together. The PM explains the user problem and success criteria. The engineer identifies the technical approach and risks. The designer clarifies interaction details that affect complexity. This fifteen-minute conversation often saves weeks of misaligned work.

**Reference-based estimation.** Instead of estimating in abstract units, compare new work to completed work. "This is about as complex as the notification preferences feature we shipped last month, which took three weeks." Referencing shared history grounds the conversation in reality rather than optimism.

**Confidence levels.** Attach a confidence percentage to each estimate. "I am ninety percent confident we can ship the core flow in two weeks, but only fifty percent confident about the admin dashboard." This gives PMs the information they need to plan around uncertainty rather than pretending it does not exist.

**Pre-mortem exercises.** Before committing to an estimate, ask the team: "Imagine it is four weeks from now and this feature took twice as long as we estimated. What went wrong?" This exercise surfaces risks that people are reluctant to raise during normal estimation, because it reframes risk identification as a thought exercise rather than a complaint.

**Iterative refinement.** Accept that early estimates are rough and will improve as you learn more. A healthy process looks like this: initial ballpark at the roadmap level, refined estimate during sprint planning, updated estimate after the first day of implementation. Each iteration narrows the range. PMs should plan for this refinement rather than locking in the first number they hear.

**Velocity tracking with honesty.** Track your team's velocity, but do it honestly. Do not inflate points to look productive or deflate them to seem humble. Consistent, honest tracking over multiple sprints gives you a powerful planning tool. When a PM asks "Can we fit these twenty points into the next sprint?" and the team's average velocity is fifteen, the data speaks for itself.

## Common Anti-Patterns to Avoid

Recognizing what breaks estimation is just as important as knowing what helps.

- **The negotiation dance.** Engineer says eight points, PM says "Can we do it in five?" Engineer reluctantly agrees. The work still takes eight points of effort, but now the team has committed to an unrealistic plan. Estimation should be a discovery process, not a bargaining session.
- **Estimation by authority.** A senior leader says "This should only take a week" without understanding the technical details. The team agrees because disagreeing feels risky. This is a cultural problem that requires leadership to model intellectual humility.
- **Padding as a strategy.** When engineers do not trust that their estimates will be respected, they pad everything by fifty percent as a defensive measure. This is rational behavior in a low-trust environment, but it makes planning unreliable and erodes the PM's ability to prioritize effectively. The fix is not to demand leaner estimates. It is to build trust by respecting the estimates engineers give.
- **Ignoring historical data.** Teams that do not track estimates against actuals are doomed to repeat the same mistakes. Even a simple spreadsheet that logs estimated versus actual effort per feature, reviewed quarterly, can transform a team's estimation accuracy.
- **Conflating estimation with commitment.** An estimate is a forecast based on current information. A commitment is a promise. These are different things, and treating them as identical creates perverse incentives. Engineers stop giving honest estimates because every number becomes a deadline they will be held to.

## Key Takeaways

- **PMs:** Ask decomposition questions instead of timeline questions. Learn to hear the difference between "this is complex" and "I need more information before I can estimate." Respect the gap between effort and calendar time, and track your team's estimation accuracy over multiple sprints to build calibration.
- **Engineers:** Show your work by breaking estimates into visible components. Use ranges to communicate uncertainty honestly. Distinguish between known and unknown work, and propose spikes when genuine investigation is needed before you can estimate responsibly.
- **Designers:** Provide detailed interaction specifications early in the process. Flag design complexity that might not be obvious from a mockup, such as animation states, responsive breakpoints, or accessibility requirements that add engineering effort. Your input during estimation prevents rework later.

Estimation will never be perfect, and that is fine. The goal is not precision. The goal is shared understanding, honest communication, and a planning process that teams trust enough to engage with fully. When PMs learn to think about effort the way engineers do, and engineers learn to communicate complexity the way PMs need to hear it, the entire team moves faster with less friction.

*What estimation practice has made the biggest difference for your team, and what is one thing you would change about how your team estimates today?*
