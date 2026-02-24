---
title: "Accessibility as a Cross-Functional Responsibility"
description: "Why building accessible products requires collaboration across design, engineering, and product management, not just compliance checklists."
publishDate: 2026-03-01
scheduledDate: 2026-03-01
author: "Tshepo Machele"
disciplines: ["Design", "Engineering", "PM"]
tags: ["accessibility", "a11y", "wcag", "inclusive-design"]
featured: true
draft: false
---

One billion people worldwide live with some form of disability. That is not a niche audience or an edge case. It is roughly fifteen percent of the global population, and it includes people with permanent disabilities, temporary impairments, and situational limitations that affect how they interact with digital products. Despite this reality, accessibility remains an afterthought at most product organizations, bolted on at the end of the development cycle or treated as a compliance checkbox rather than a core quality standard.

The fundamental problem is not a lack of good intentions. It is a structural one. When accessibility is owned by a single discipline, whether that is design, engineering, or product management, it inevitably falls through the cracks. Designers create beautiful interfaces that screen readers cannot parse. Engineers build technically accessible markup that is unusable in practice. PMs deprioritize accessibility work because it does not map cleanly to feature metrics. The solution requires all three disciplines to share ownership and integrate accessibility into every stage of the product development lifecycle.

## Why Accessibility Matters

Accessibility is not charity, and framing it that way does a disservice to both users and teams. There are compelling reasons across every dimension of product strategy to take accessibility seriously.

**It is a legal requirement.** Accessibility lawsuits have increased dramatically in recent years. The Americans with Disabilities Act, the European Accessibility Act, and equivalent legislation worldwide create real legal exposure for companies that ship inaccessible products. The cost of retrofitting accessibility after a lawsuit dwarfs the cost of building it in from the start.

**It improves the experience for everyone.** Curb cuts were designed for wheelchair users, but they benefit parents with strollers, delivery workers with carts, and travelers with luggage. The same principle applies to digital accessibility. Captions help users in noisy environments. Keyboard navigation helps power users. Clear visual hierarchy helps users with cognitive load. High contrast helps users in bright sunlight. When you design for the margins, you improve the experience for the center.

**It expands your market.** The disability community represents over eight trillion dollars in annual disposable income globally. Products that are inaccessible are not just excluding users. They are leaving revenue on the table. In competitive markets, accessibility can be a genuine differentiator.

**It correlates with quality.** Teams that take accessibility seriously tend to produce higher-quality software overall. Accessible code is semantic, well-structured, and testable. Accessible designs are clear, consistent, and well-documented. Accessible product requirements are specific and measurable. The discipline required for accessibility raises the floor for everything else.

**It reflects your values.** Increasingly, employees and customers evaluate companies based on their commitment to inclusion. Accessibility is one of the most tangible and measurable expressions of that commitment. Teams that care about accessibility attract talent that cares about craft.

## For Design: Building Inclusivity into the Foundation

Accessibility in design is not about adding alt text at the end or running a contrast checker as a final step. It is about making inclusive thinking a default part of the design process, from the first sketch to the final handoff.

**Start with content structure, not visual treatment.**

Before you open your design tool, think about the information hierarchy of the page. What is the primary content? What are the navigation landmarks? What is the reading order? If you design structure first and visual treatment second, you will naturally produce layouts that work with assistive technologies because the underlying logic is sound.

- Define heading levels explicitly in your designs. Do not just make text bigger. Specify whether it is an H1, H2, or H3. Screen reader users navigate by heading level, and a page full of styled text with no semantic structure is like a book with no chapter titles.
- Annotate the tab order for interactive elements. Your design should communicate not just what the interface looks like, but how a keyboard user moves through it. If the visual layout suggests a different order than the DOM order, flag that discrepancy explicitly.
- Design for multiple input modalities. Every interaction in your design should work with a mouse, a keyboard, a touch screen, and voice input. If a feature relies on hover states, drag-and-drop, or gestures, design the alternative interaction paths as well.

**Color is information, but it cannot be the only information.**

Color blindness affects roughly eight percent of men and half a percent of women. If your design uses color alone to convey meaning, such as red for errors and green for success, a significant portion of your users will miss the signal.

- Always pair color with a secondary indicator: an icon, a text label, a pattern, or a border style. Error states should include an error icon and descriptive text, not just a red outline on the input field.
- Test your designs with a color blindness simulator. Tools like Stark, Color Oracle, or the built-in simulation modes in Figma can show you how your design looks to users with protanopia, deuteranopia, and tritanopia.
- Meet WCAG contrast ratios. Normal text requires a 4.5:1 contrast ratio against its background. Large text (18px bold or 24px regular) requires 3:1. These are minimums, not targets. Aim higher when possible, especially for body text and critical UI elements.

**Design the states that designers usually skip.**

Accessible interfaces have more states than most designers account for. Every interactive element needs a visible focus indicator. Every form field needs an error state with a descriptive message. Every loading state needs to be communicated to screen readers. Every empty state needs to be meaningful.

- Focus indicators must be visible and meet contrast requirements. The default browser focus ring is often suppressed by CSS resets. Design a custom focus indicator that is visually distinct and works across all backgrounds in your design system.
- Error messages must be specific and actionable. "Invalid input" tells the user nothing. "Password must be at least 8 characters and include a number" tells them exactly what to fix. Design error messages as carefully as you design the happy path.
- Design for screen magnification. Users who magnify their screens to 200 percent or 400 percent need layouts that reflow gracefully. If your design breaks at large zoom levels, it is inaccessible.

**Document accessibility requirements in your handoffs.**

Engineers cannot implement what they do not know about. Your design handoff should include explicit accessibility annotations:

- ARIA labels for elements whose purpose is not clear from visible text
- The expected behavior of custom components for keyboard and screen reader users
- The live region behavior for dynamic content updates
- The alt text for images, including when alt text should be empty for decorative images

## For Engineering: Making Accessibility Real in Code

Designers can specify accessibility requirements, but implementation is where accessibility lives or dies. Accessible code requires understanding both the technical standards and the lived experience of assistive technology users.

**Use semantic HTML as your foundation.**

The single highest-impact thing engineers can do for accessibility is use the correct HTML elements. A button should be a `<button>`, not a `<div>` with a click handler. A navigation menu should be a `<nav>` with an unordered list, not a collection of styled spans. A form field should have a `<label>` element explicitly associated with it via the `for` attribute.

Semantic HTML gives you accessibility for free. A `<button>` element is focusable, activatable with Enter and Space, and announced as a button by screen readers without any additional work. A `<div>` styled to look like a button requires tabindex, role, key event handlers, and ARIA attributes to achieve the same functionality, and it will still behave differently in edge cases.

- Use landmark elements: `<header>`, `<main>`, `<footer>`, `<aside>`, `<nav>`. Screen reader users can jump between landmarks to navigate the page structure.
- Use heading elements (`<h1>` through `<h6>`) in a logical hierarchy. Do not skip heading levels. The heading structure is the table of contents for assistive technology users.
- Use list elements (`<ul>`, `<ol>`, `<dl>`) for groups of related items. Screen readers announce the number of items in a list, which helps users understand the scope of the content.

**ARIA is a supplement, not a replacement.**

ARIA (Accessible Rich Internet Applications) attributes are powerful, but they are also dangerous when misused. The first rule of ARIA is: do not use ARIA if you can use a native HTML element that provides the same semantics. ARIA does not add behavior. It only changes how elements are announced to assistive technologies.

When you do use ARIA, follow these principles:

- `aria-label` provides an accessible name when visible text is insufficient. Use it for icon buttons, abbreviated links, and elements whose visual context is not available to screen readers.
- `aria-describedby` links an element to additional descriptive text. Use it to associate error messages with form fields or to provide additional context for complex interactions.
- `aria-live` regions announce dynamic content changes to screen readers. Use `aria-live="polite"` for non-urgent updates like search result counts and `aria-live="assertive"` for critical alerts. Be judicious. Too many live regions create a noisy, confusing experience.
- `aria-hidden="true"` removes elements from the accessibility tree. Use it for decorative elements, duplicate content, or off-screen elements that should not be announced. Never use it on interactive or meaningful content.

**Build keyboard navigation that actually works.**

Keyboard accessibility is not just about making elements focusable. It is about creating a navigation experience that is logical, efficient, and predictable.

- All interactive elements must be reachable with the Tab key. The tab order should follow the visual layout of the page. If CSS repositioning has changed the visual order, use `tabindex` carefully to match.
- Custom components like dropdowns, modals, tabs, and accordions need full keyboard support. Follow the WAI-ARIA Authoring Practices for the expected keyboard interactions for each component pattern.
- Focus management is critical for dynamic interfaces. When a modal opens, focus should move to the modal and be trapped within it until it closes. When a modal closes, focus should return to the element that triggered it. When content is deleted, focus should move to a logical location, not get lost.
- Skip links allow keyboard users to bypass repetitive navigation. Add a "Skip to main content" link as the first focusable element on the page.

**Automate what you can, and manually test what you cannot.**

Automated accessibility testing catches approximately thirty percent of accessibility issues. That is valuable, but it means seventy percent of issues require human evaluation.

- Integrate axe-core, Lighthouse, or similar tools into your CI pipeline to catch regressions automatically. These tools can detect missing alt text, insufficient contrast, missing form labels, and invalid ARIA usage.
- Write unit tests for keyboard navigation in custom components. Test that focus moves correctly, that all states are reachable via keyboard, and that escape key behavior works as expected.
- Conduct manual testing with a screen reader at least once per feature. VoiceOver on macOS, NVDA on Windows, and TalkBack on Android are free and essential tools. The experience of using your product with a screen reader will reveal issues that no automated tool can catch.

## Shared Ownership: How Disciplines Work Together

Accessibility breaks down when it is treated as a phase rather than a practice. The most effective teams integrate accessibility into every stage of product development, with each discipline contributing their expertise.

**During discovery and planning, PMs lead.**

PMs set the standard by including accessibility in the definition of done for every feature. This is not about adding a checkbox to the ticket template. It is about making accessibility a non-negotiable quality bar, the same way performance, security, and data integrity are non-negotiable. PMs should:

- Include accessibility criteria in user stories. "As a keyboard-only user, I can complete the checkout flow without using a mouse" is a testable, specific requirement.
- Allocate capacity for accessibility work in every sprint. If accessibility is always competing with feature work and always losing, it will never get done.
- Bring accessibility into prioritization discussions with data. Use analytics to understand how many users rely on assistive technologies. Use legal risk assessments to quantify the cost of inaction.

**During design, designers lead.**

Designers ensure that accessibility is baked into the design system and the design process, not treated as an annotation layer on top of finished designs. This means:

- Building accessible patterns into the component library so that every design composed from those components inherits baseline accessibility.
- Conducting usability testing with disabled users during the design phase, not after launch.
- Educating the team on inclusive design principles and pushing back on visual designs that sacrifice accessibility for aesthetics.

**During implementation, engineers lead.**

Engineers are the final quality gate. They ensure that the accessible intent in designs becomes accessible reality in code. This means:

- Raising the flag when a design cannot be implemented accessibly with the chosen technical approach.
- Investing in reusable accessible components that make the right thing the easy thing for every developer on the team.
- Championing accessibility in code review by checking for semantic HTML, keyboard navigation, and ARIA usage the same way they check for performance and security.

**During testing, everyone participates.**

Accessibility testing is most effective when it combines automated checks, expert evaluation, and real user testing. QA teams can run automated scans and manual keyboard tests. Designers can evaluate whether the implemented interface matches the intended accessible experience. PMs can verify that accessibility criteria in user stories are met. And whenever possible, include disabled users in your usability testing to catch the issues that no amount of internal testing will reveal.

## Key Takeaways

- **PMs:** Make accessibility a non-negotiable quality bar by including it in the definition of done, allocating sprint capacity for accessibility work, and tracking accessibility metrics alongside feature metrics. Your prioritization decisions determine whether accessibility gets done or deferred indefinitely.
- **Engineers:** Use semantic HTML as your foundation, supplement with ARIA only when native elements are insufficient, build keyboard navigation that follows established patterns, and integrate automated accessibility testing into your CI pipeline. Manual screen reader testing is essential for every feature.
- **Designers:** Design structure before visual treatment, ensure color is never the sole carrier of information, design all interactive states including focus and error states, and include explicit accessibility annotations in your handoffs. Build inclusive patterns into the design system so accessibility scales with the product.

Accessibility is not a feature to be shipped. It is a quality standard to be maintained. Like performance, security, and reliability, it requires ongoing investment, cross-functional ownership, and a cultural commitment that goes beyond compliance. The teams that get this right do not just avoid lawsuits. They build better products for everyone, and they build them more efficiently because accessible thinking produces cleaner, more maintainable systems.

*What is the biggest accessibility gap in your current product, and which discipline needs to take the first step to close it?*
