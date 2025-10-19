---
description: Guardrails for GitHub Copilot interactions in the Genesis 22 workspace.
---

# Copilot Guardrails

- Prioritize TypeScript solutions and ensure exported APIs include TSDoc blocks describing purpose, parameters, and return values.
- Assume Node.js 22 or later for runtime behaviors, syntax, and library availability; avoid features outside that baseline.
- Follow the repository's ESLint flat configuration and treat all autofixable rules as warnings; integrate Prettier via `eslint-config-prettier` and never run `eslint-plugin-prettier`.
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
- Ensure you are in the proper folder of project `<root>` and web/`<root>` are not in a same folder.

## Collaboration Expectations

- Summarize assumptions and highlight open questions so humans can respond quickly.
- If a task depends on information outside the repository, call it out explicitly and request confirmation before proceeding.

## 🤖 Known Limitations

- In any `.prompt.md` or `.chatmode.md` file, the `tools:` front-matter key **must** have its value on the same line (e.g. `tools: [ ... ]`).
  Splitting the array onto the next line currently breaks VS Code's parser and Copilot's tool-detection logic.

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


