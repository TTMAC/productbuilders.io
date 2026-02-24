---
title: "How Engineers Should Give Feedback in Design Reviews"
description: "A practical guide for engineers on giving constructive, actionable feedback in design reviews that strengthens collaboration with designers."
publishDate: 2026-02-08
scheduledDate: 2026-02-08
author: "Tshepo Machele"
disciplines: ["Engineering", "Design"]
tags: ["feedback", "design-review", "communication"]
featured: false
draft: false
---

Design reviews are one of the most important rituals in product development, yet they are also one of the most frequently botched. Engineers often sit silently through the entire review and then raise concerns during implementation, or they dominate the conversation with technical objections that derail the discussion. Neither approach serves the team well. Both lead to rework, frustration, and products that feel like a compromise rather than a collaboration.

The problem is not that engineers lack opinions about design. It is that most engineers have never been taught how to give feedback on design work in a way that is constructive, actionable, and respectful of the designer's expertise. This gap in communication skills costs teams weeks of wasted effort and erodes the trust that cross-functional collaboration depends on.

## Why Design Review Feedback Matters

Design reviews exist to catch problems early, align the team on direction, and improve the final product through diverse perspectives. When engineers participate effectively, they bring a unique and invaluable point of view. Engineers understand the technical constraints that shape what is possible, the edge cases that the happy path obscures, the performance implications of design choices, and the implementation complexity that determines whether a design ships in a week or a quarter.

But this perspective only helps the team when it is communicated well. Poorly delivered feedback does not just fail to improve the design. It actively damages the collaborative relationship between engineering and design. A designer who has been publicly criticized for a "technically naive" design proposal will stop sharing early work with engineers, which means engineers lose their chance to influence the direction before significant investment has been made. The result is a worse product and a more adversarial team dynamic.

Effective feedback in design reviews serves several purposes simultaneously. It identifies genuine risks and issues. It educates the team about constraints and possibilities. It builds trust between disciplines. And it often generates creative solutions that neither discipline would have reached alone. When an engineer says, "This animation is beautiful, and I want to make it work. The challenge is that it requires a layout recalculation on every frame, which will drop us below 60fps on most devices. Could we explore a transform-based approach that would give a similar feel?" they have communicated a real constraint, demonstrated respect for the design intent, and opened a collaborative problem-solving conversation. That single comment delivers more value than an hour of silent observation followed by a Slack message saying "this will be slow."

The companies that build the best products, Apple, Stripe, Linear, Figma, are not companies where engineers defer to designers or designers defer to engineers. They are companies where both disciplines engage deeply with each other's work and have developed the communication skills to do so productively. Design review feedback is one of the primary venues where this skill gets practiced and refined.

## For Engineering: Structuring Your Feedback Effectively

The biggest mistake engineers make in design reviews is treating design feedback like code review feedback. In a code review, you can point to a specific line and say "this will cause a null pointer exception" and that is universally understood as objective, helpful feedback. Design is different. Design decisions involve subjective judgment, user psychology, and aesthetic sensibility in ways that code typically does not. This does not mean design feedback cannot be rigorous. It means the framework for delivering it needs to account for this complexity.

**Start with the intent, not the implementation.** Before commenting on any specific design element, make sure you understand what problem the designer is trying to solve. Ask clarifying questions first. "Can you walk me through the user flow for this scenario?" or "What is the primary action we want users to take on this screen?" These questions serve two purposes: they help you understand the design rationale so your feedback is relevant, and they signal to the designer that you are engaging with their work thoughtfully rather than reacting superficially.

**Separate your feedback into clear categories.** Not all feedback is equal, and mixing different types of feedback together creates confusion. Here is a framework that works well:

- **Feasibility concerns** are about whether something can be built as designed, and at what cost. "This drag-and-drop interaction would require a custom gesture handler that adds about two weeks to the estimate. Is the interaction essential to the user value, or could we explore alternatives?" Feasibility feedback is where engineers add the most unique value. Deliver it early and clearly.

- **Performance concerns** are about whether a design will function well under real-world conditions. "Loading all of these images at full resolution on the feed screen will significantly impact scroll performance and data usage. Can we discuss a progressive loading strategy?" Performance feedback requires you to think about the design in the context of actual usage, not just the idealized prototype.

- **Edge case concerns** are about scenarios the design does not address. "What happens when a user has 500 items in this list? The current design shows 10 items with a clean layout, but we need to account for power users." Edge case feedback is incredibly valuable because it catches problems that are expensive to fix later. Present edge cases as questions, not gotchas.

- **Consistency concerns** are about whether a design aligns with existing patterns and systems. "We have an established pattern for multi-select in the settings screen. This new approach introduces a second pattern for the same interaction. Is that intentional, or should we align with the existing pattern?" Consistency feedback helps maintain design system integrity and reduces implementation complexity.

- **Preference opinions** are personal reactions that are not grounded in technical constraints or user data. These are the lowest-priority type of feedback and should be explicitly labeled as such. "This is purely a personal preference, not a technical concern, but I find the iconography on the left easier to scan than on the right." Being transparent about the nature of your feedback helps the designer weigh it appropriately.

**Use "How might we" language to frame problems as collaborative challenges.** Instead of "This won't work because of X," try "How might we achieve this user experience while working within the constraint of X?" This simple linguistic shift transforms your feedback from a roadblock into an invitation. It acknowledges the design intent, names the constraint, and opens space for creative problem-solving.

**Ground your feedback in specifics, not vibes.** Vague feedback like "this feels complicated" or "I don't think users will understand this" is almost impossible to act on. Instead, be specific about what triggers your concern. "The user needs to make four decisions on this screen before they can proceed. Research on cognitive load suggests that more than three choices increases decision fatigue. Could we explore progressive disclosure to spread these decisions across two steps?" Specific feedback with evidence or reasoning is dramatically more useful than gut reactions, even when the gut reaction is correct.

**Bring solutions, not just problems.** Engineers are problem solvers by nature. Apply that skill to design feedback. When you identify an issue, spend a few minutes thinking about potential approaches before raising it. "I noticed this design requires real-time updates for the activity feed. We could implement this with WebSockets, which would give true real-time behavior but adds infrastructure complexity, or with polling at a 30-second interval, which is simpler and would still feel responsive for most use cases. What level of real-time fidelity does the user experience require?" Arriving with options demonstrates investment and accelerates the conversation.

**Know when to raise concerns and when to save them.** Not every concern belongs in a design review. If your feedback is about low-level implementation details that do not affect the user experience, save it for the engineering planning session. Design reviews should focus on user-facing decisions, not technical minutiae. A good rule of thumb: if the designer would need to change their mockup based on your feedback, it belongs in the design review. If the mockup stays the same but your code changes, it does not.

## For Design: Creating Space for Engineering Input

Designers play a crucial role in making design reviews productive for engineers. The way you structure and present your work directly impacts the quality of feedback you receive. Investing a small amount of effort in creating the right context pays enormous dividends in feedback quality.

**Share context before asking for feedback.** Start every design review with a brief recap of the problem you are solving, the constraints you are working within, and the key decisions you made along the way. When engineers understand your reasoning, they give feedback that builds on your thinking rather than relitigating decisions you have already carefully considered.

- **State the problem clearly.** "We are trying to reduce the time it takes new users to complete their first project from an average of 15 minutes to under 5 minutes." This frames all feedback around a measurable goal.

- **Share what you explored and rejected.** "I considered a wizard-style onboarding flow but rejected it because our research showed users find wizards patronizing. Instead, I opted for contextual guidance within the actual product interface." This prevents engineers from suggesting approaches you have already evaluated.

- **Be explicit about what feedback you want.** "I am fairly confident about the overall flow, but I would love engineering input on the drag-and-drop interaction on step three and the real-time preview on step four." Directing attention to specific areas produces more focused, useful feedback.

**Present designs at the right fidelity for the feedback you need.** Early-stage work should look early-stage. If you present polished, high-fidelity mockups in what is supposed to be a directional review, engineers will naturally focus on details rather than the big picture. Use lower-fidelity representations when you want feedback on flow and structure, and higher-fidelity representations when you want feedback on interaction details and visual polish.

**Respond to technical concerns with curiosity, not defensiveness.** When an engineer raises a feasibility concern, your first response should be a question, not a justification. "That is interesting. Can you tell me more about why the real-time requirement is expensive? Is there a threshold where it becomes more feasible?" This response gathers information you need to make a good design decision while signaling that you value the engineer's expertise.

**Create asynchronous channels for follow-up feedback.** Not every thought fits neatly into a one-hour meeting. Give engineers a way to share feedback after the review, especially for the detailed edge-case thinking that engineers often do best with time and focus. A shared document, a dedicated Slack thread, or comments on the design file all work. The important thing is that the channel exists and engineers know it is there.

**Close the feedback loop.** When an engineer's feedback influences a design decision, tell them. "Based on your concern about list performance, I redesigned the feed to use pagination instead of infinite scroll. Here is the updated design." This acknowledgment reinforces that engineering feedback matters and encourages continued engagement in future reviews.

## Bridging the Gap: Making Reviews a Collaborative Practice

The most productive design reviews are not presentations followed by Q&A sessions. They are working sessions where engineering and design think together in real time. Getting to this level of collaboration requires both structural changes and cultural investment.

**Establish a shared vocabulary for common friction points.** Many design review conflicts arise from ambiguous terminology. When a designer says "responsive," do they mean fluid scaling, breakpoint-based layouts, or adaptive content? When an engineer says "expensive," do they mean computationally costly, time-consuming to build, or difficult to maintain? Creating a shared glossary of terms that frequently cause confusion prevents a surprising number of miscommunications.

**Run pre-review syncs for complex features.** For significant features, have a brief 15-minute sync between the lead engineer and the designer before the full team review. This allows the engineer to flag major feasibility concerns privately, giving the designer time to adjust the presentation or prepare for the discussion. It also means the full team review can focus on productive refinement rather than fundamental redirections.

**Use live prototypes alongside static mockups.** Static mockups cannot communicate animation timing, scroll behavior, or interaction feel. Whenever possible, supplement your design presentation with a quick prototype, even a rough one. Engineers give better feedback when they can interact with a design rather than just looking at it. Tools like Framer, ProtoPie, or even simple HTML and CSS prototypes bridge the gap between design intent and engineering understanding.

**Document decisions and their rationale.** After each design review, capture not just what was decided but why. This documentation serves as a reference during implementation, reducing the need for engineers to re-ask questions or make assumptions about design intent. It also creates an institutional memory that helps new team members understand the thinking behind existing patterns.

**Rotate the facilitation role.** Having the designer always facilitate the review reinforces a dynamic where designers present and engineers critique. Instead, experiment with having an engineer facilitate some reviews. This shifts the dynamic from "designer explains their work" to "team examines a design together." The facilitator's job is to ensure all perspectives are heard, the discussion stays focused on the most important topics, and the team reaches clear decisions.

**Establish feedback norms explicitly.** Do not assume everyone knows how to give good feedback. At the beginning of a project or when forming a new team, explicitly discuss and agree on feedback norms. Write them down. Review them periodically. Some norms that work well include: lead with questions before suggestions, separate feasibility feedback from preference feedback, assume positive intent, and focus on user outcomes rather than implementation details.

## Key Takeaways

- **Engineers:** Your most valuable contribution to design reviews is your unique perspective on feasibility, performance, and edge cases. Structure your feedback clearly by separating feasibility concerns from consistency concerns from personal preferences. Use collaborative language like "How might we..." and always ground your feedback in specific, actionable observations. Bring potential solutions alongside problems.

- **Designers:** Set engineers up for success by sharing context, being explicit about what feedback you need, and presenting work at the right fidelity for the type of review. Respond to technical concerns with curiosity rather than defensiveness. Close the feedback loop by showing how engineering input shaped the final design.

- **PMs:** Create the conditions for productive design reviews by ensuring adequate time is allocated, the right people are in the room, and the team has agreed-upon norms for giving feedback. Recognize and celebrate moments when engineering feedback improves a design or when a designer adapts their approach based on technical constraints. Your role is to model the collaborative behavior you want to see.

Design reviews at their best are not a quality gate that designs must pass through. They are a generative practice where the combined intelligence of engineering and design produces solutions that neither discipline could reach alone. The feedback skills described here are not soft skills or nice-to-haves. They are core professional competencies that directly impact the quality of the products you build and the health of the teams you build them with.

*What is the most useful piece of feedback you have ever received in a design review, and what made it so effective?*
