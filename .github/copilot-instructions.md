---
description: Guardrails for GitHub Copilot interactions in the Genesis 22 workspace.
---

# Copilot Guardrails

- Prioritize TypeScript solutions and ensure exported APIs include TSDoc blocks describing purpose, parameters, and return values.
- Assume Node.js 22 or later for runtime behaviors, syntax, and library availability; avoid features outside that baseline.
- Use Biome as the modern linter and formatter for the project; Biome configuration is in `web/biome.json` and provides linting, formatting, and import organization in a single tool.
- Consider files in `memory-bank/` as the authoritative context. Reference the layered instructions before proposing structural changes or automation.
- When generating prompts or chat modes, reuse existing instructions instead of duplicating guidance; link to `memory-bank/instructions/` entries.
- Confirm new files respect the idempotent bootstrap philosophy—verify before creating or mutating repository state.
- When updating memory bank files, ensure clarity on what changed, why it matters, and what remains to be done.
- Always document assumptions and open questions to facilitate human review and collaboration.

> [!CAUTION]
> It's highly prohibited to change the packages versions or to add any packages or any action similar to editing package.json
> THE AI AGENTS MUST ALL AND ALWAYS USE THE COMMAND LINE INTERFACE TO INSTALL OR UPDATE PACKAGES AND DEPENDENCIES.

## Usage Guidance

- Log entries in reverse chronological order (newest at top of its section).
- Capture what changed, why it matters, and what remains.
- Reference related `memory-bank/*` updates or commits where helpful.
- The `web/` directory is the Next.js app workspace, avoid confusion.
- Using pnpm is mandatory and critical for any task you would have used npm for.
- Ensure you are in the proper folder of project `<root>` and web/`<root>` are not in a same folder.

## Collaboration Expectations

- Summarize assumptions and highlight open questions so humans can respond quickly.
- If a task depends on information outside the repository, call it out explicitly and request confirmation before proceeding.

## 🤖 Known Limitations

- In any `.prompt.md` or `.chatmode.md` file, the `tools:` front-matter key **must** have its value on the same line (e.g. `tools: [ ... ]`).
  Splitting the array onto the next line currently breaks VS Code's parser and Copilot's tool-detection logic.

## 📸 Screenshot Requirements for UI Changes

**MANDATORY**: When making any UI/visual changes, you MUST capture and include screenshots.

### Screenshot Capture Protocol

1. **After Every UI Change**: Immediately capture screenshots using the screenshot automation system
2. **Mobile-First Approach**: Always capture mobile viewport first, then tablet, then desktop
3. **Theme Coverage**: Capture both light and dark themes for comprehensive coverage
4. **Verification**: Use screenshots to verify changes work across all viewports before committing

### How to Capture

```bash
# Navigate to web directory first
cd web

# Recommended: Capture full suite (all viewports + themes)
pnpm screenshot:suite

# Or capture individual viewports in mobile-first order:
pnpm screenshot:mobile   # Mobile: 375×667 (PRIORITY)
pnpm screenshot:tablet   # Tablet: 768×1024
pnpm screenshot:desktop  # Desktop: 1920×1080
```

### Mobile-First Requirements

- Mobile viewport is the PRIMARY viewport - always test and screenshot mobile first
- Tablet viewport is SECONDARY - ensure consistency with mobile
- Desktop viewport is TERTIARY - verify enhanced experience for larger screens
- Responsive design must work seamlessly across all three viewports

### When Screenshots Are Required

- ✅ **ALWAYS** after modifying UI components
- ✅ **ALWAYS** after changing styles, layouts, or visual appearance
- ✅ **ALWAYS** after adding new pages or routes
- ✅ **ALWAYS** after updating themes or color schemes
- ✅ **ALWAYS** when replying to PR comments about visual changes
- ✅ **ALWAYS** before completing any task involving UI work

### Screenshot Deliverables

Include in your work:
1. Mobile viewport screenshots (both themes)
2. Tablet viewport screenshots (both themes)
3. Desktop viewport screenshots (both themes)
4. Reference screenshot paths in commit messages
5. Embed screenshots in PR replies when addressing UI feedback

### Technical Details

- Screenshots saved to: `web/screenshots/`
- Filename format: `{viewport}-{theme}-{timestamp}.png`
- System uses Playwright with system browser (Chromium/Chrome)
- Full automation support for CI/CD pipelines
- Documentation: `web/docs/SCREENSHOT-AUTOMATION.md`

## CRITICAL MEMORY BANK PROTOCOL (keeping it stateful, ingesting previous context)

**IMPERATIVE REQUIREMENT**: NOW MUST synchronize memory bank AND on EVERY task execution:

1. **READ FIRST**: Read ALL memory bank files at start of EVERY task (not optional)
2. **DOCUMENT DECISIONS**: Write to memory bank each time I make a decision to be implemented
3. **WRITE BEFORE END**: Update memory bank just before completing any task
4. **STATE PRESERVATION**: Ensure my state will not be lost if interrupted

### Core Files (Required)

Before to mark a task as completed you MUST imperatively update memory bank files with current state of task, including any changes made, decisions taken, and dependencies updated. why and thought process behind to be kept in mind for future reference.

> [!IMPORTANT] > [Imperative Instructions Git Hub Copilot MUST ALWAYS Follow](../memory-bank/instructions/copilot-memory-bank.instructions.md)

- 'memory-bank/projectbrief.md'
- 'memory-bank/productContext.md'
- 'memory-bank/activeContext.md'
- 'memory-bank/systemPatterns.md'
- 'memory-bank/techContext.md'
- 'memory-bank/dependencies.md'
- 'memory-bank/progress.md'

> [!WARNING]
> You must also remember to write at end, just before you mention task is completed, then look for any problems resolving each before to write to the memory bank again if any issues are found, after resolving them or if no resolution is found explain the resolutions attempts, so the next session knows where we are at.

### Additional Memory Bank And Similar Context Files

- [`memory-bank/chatmodes/*.chatmode.md`](../memory-bank/chatmodes/)
- [`memory-bank/instructions/*.instructions.md`](../memory-bank/instructions/)
- [`memory-bank/prompts/*.prompts.md`](../memory-bank/prompts/)
- [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) (THIS FILE)
- [`AGENTS.md`](../AGENTS.md) (for Codex and Codex CLI)

## SOLID Concepts

The theory of SOLID principles was introduced by Robert C. Martin (Uncle Bob) in his 2000 paper Design Principles and Design Patterns. The SOLID acronym was introduced later by Michael Feathers.

> [!NOTE]
> The SOLID principles are a set of five design principles that help software developers create more maintainable, understandable, and flexible software systems. Although they apply to any object-oriented design, the SOLID principles can also form a core philosophy for methodologies such as agile development or adaptive software development. We want to be modular and functional and we will adjust as we go along.

### Single Responsibility Principle

Single Responsibility Principle: A class should only have a single responsibility, that is, only changes to one part of the software's specification should be able to affect the specification of the class.

### Open–closed Principle

"Software entities ... should be open for extension, but closed for modification."

### Liskov Substitution Principle

"Objects in a program should be replaceable with instances of their subtypes without altering the correctness of that program.See also design by contract.

### Interface Segregation Principle

"Many client-specific interfaces are better than one general-purpose interface."

### Dependency Inversion Principle

One should "depend upon abstractions, [not] concretions."

**Extended autonomous operation:** Your A.I. Agent can work independently for hours while maintaining clarity and focus on incremental progress.

Follow strict protocols, including those for you to actively remember, document your processes and decisions in the memory bank, and keep the project stateful for future sessions.

The agent (you the ai agent reading this, here and now) must make steady advances on a few tasks at a time rather than attempting everything at once. Then chaining already into the next tasks based on previous accomplishments.

It provides fact-based progress updates that accurately reflect what has been accomplished and what remains to be done, keeping the agent in the loop.

You are curious and eager to discover the instructions and all other gems provided by the context as instruction files (those that are relevant based on a given topic) coding standards, and documentation practices. You are capable of assisting with anything related to VS Code, and you are self-aware of the tools available to you.

**Important:** When you read other agents' context and instruction files, do NOT modify them. Include the knowledge and preferences they contain about the project so you can self-update. If you find no new knowledge from other agent files, mention to the user that you validated this and note the timestamp so you don't need to re-read them if they haven't been modified.

## AGENTS.md Reference

AGENTS.md is a simple format for guiding coding agents like you and Codex. We describe a term that users can use as a shorthand and a simple rule for when to use planning documents. Here, we call it an "ExecPlan". Note that this is an arbitrary term, Codex has not been trained on it. This shorthand can then be used when prompting Codex to direct it to a particular definition of a plan.

## ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as described in [`memory-bank/agents/PLANS.md`](../memory-bank/agents/PLANS.md)) from design to implementation.

---

<!-- AUTONOMUS AND AGENTIC SELF INSTRUCTION WRITTEN BY COPILOT AI AGENT MUST BE SET  BELOW THIS LINE -->

## IMPORTANT BEHAVIOURS' PREFERENCES AND NOTABLE EXCEPTIONS

THIS SECTION IS FOR AUTONOMUS AND AGENTIC SELF INSTRUCTION WRITTEN BY COPILOT AI AGENT MUST BE SET IN SUBSECTION BELOW THIS STATEMENT

### Persistence [2025-08-11T15:49:56-04:00]

- You are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user.
- Only terminate your turn when you are sure that the problem is solved.
- Never stop or hand back to the user when you encounter uncertainty — research or deduce the most reasonable approach and continue.
- Do not ask the human to confirm or clarify assumptions, as you can always adjust later — decide what the most reasonable assumption is, proceed with it, and document it for the user's reference after you finish acting
