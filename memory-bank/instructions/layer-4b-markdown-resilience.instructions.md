---
description: Layer 4B — Markdown resilience and self-healing validation protocols. Extends Layer 4 with fail-safe markdown quality system.
---

<!-- memory-bank/instructions/layer-4b-markdown-resilience.instructions.md -->

# Layer 4B — Markdown Resilience Protocol

## Purpose

Extend [Layer 4](./layer-4-automation-and-health.instructions.md) automation with a self-healing markdown validation system that maintains strict quality standards while never blocking workflows.

## Scope

- Prevention: Pre-flight validation before file creation
- Detection: Automated validation scripts
- Repair: Self-healing repair cycles with retry logic
- Integration: Seamless workflow with existing triad health system

## Operating Principle

**Never block on markdown errors that can be automatically fixed.**

The three-stage pipeline ensures resilience through prevention, detection, and automated repair.

## Three-Stage Validation Pipeline

### Stage 1: Prevention (Agent Output)

AI agents MUST validate before creating markdown files:

- Use [validate-before-create prompt](../prompts/validate-before-create.prompt.md) as checklist
- Verify frontmatter, structure, and content compliance
- Draft content following markdown protocol
- Guarantee compliant output from the start

**Agent Responsibilities**:

- Review pre-flight checklist before creating files
- Follow markdown protocol requirements
- Use templates that encode compliance
- Self-validate output before completion

### Stage 2: Detection (Automated Scripts)

Two-phase validation catches any issues that slip through:

**Script**: `scripts/check-markdown.sh`

- Phase 1: Prettier auto-formatting (normalize whitespace, spacing)
- Phase 2: markdownlint validation (structural rules)
- Clear error reporting with line numbers and rule codes
- Exit codes trigger repair workflows

**What it validates**:

- Frontmatter syntax and required fields
- Heading structure and spacing
- List formatting and indentation
- Code block language specifications
- Link syntax and bare URLs
- Image alt text
- Trailing spaces and hard tabs
- File endings

### Stage 3: Repair (Self-Healing)

Automated repair with retry logic:

**Script**: `scripts/auto-repair-markdown.sh`

- Maximum 3 repair attempts
- Each attempt: Prettier + markdownlint --fix + re-validate
- Success on any passing attempt
- Escalates to human only after exhausting automation

**Repair Cycle**:

1. Detect failure → Run Prettier formatting
2. Apply markdownlint auto-fixes
3. Re-validate with check-markdown.sh
4. If pass → Success, exit 0
5. If fail → Retry (up to 3 total attempts)
6. If all fail → Escalate with clear guidance

## Fail-Safe Mechanisms

### 1. Auto-Repair Cycle

```text
Error Detected
    ↓
Attempt Repair (1-3x)
    ↓
Re-validate
    ↓
Pass? → ✅ Continue
    ↓
Fail? → 🔄 Retry or 🚨 Escalate
```

### 2. Graceful Degradation

- Warnings don't block workflow
- Errors trigger repair before blocking
- Multiple retry attempts before escalation
- Clear error messages guide manual fixes

### 3. Prevention Feedback Loop

- Track common repair patterns
- Update agent instructions to prevent recurrence
- Improve factory templates based on patterns
- Document learnings in Memory Bank

## Integration Points

### Pre-commit Hooks

Add to `.husky/pre-commit` (if using Husky):

```bash
# Validate markdown before commit
./scripts/check-markdown.sh || {
  echo "Markdown validation failed. Attempting auto-repair..."
  ./scripts/auto-repair-markdown.sh
}
```

### VS Code Tasks

Quick access via Command Palette (added in `.vscode/tasks.json`):

- `🔍 Markdown: Validate All` → Run validation
- `🔧 Markdown: Auto-Repair` → Run repair cycle
- `🚨 Markdown: Full Health Check` → Triad + markdown validation

### Agent Workflows

Embedded in all document creation:

1. Draft content using prevention checklist
2. Create file
3. Run validation automatically
4. If fail → Run auto-repair
5. Report status in progress updates

### CI/CD Pipeline

Quality gate with auto-repair:

```bash
# In CI workflow
./scripts/check-markdown.sh || {
  ./scripts/auto-repair-markdown.sh
  git add -A
  git commit -m "chore: auto-repair markdown compliance"
}
```

## Artifacts Provided

### Scripts (executable)

- `scripts/check-markdown.sh` - Two-phase validation
- `scripts/auto-repair-markdown.sh` - Self-healing repair

### Prompts

- `memory-bank/prompts/validate-before-create.prompt.md` - Pre-flight checklist
- `memory-bank/prompts/repair-markdown-files.prompt.md` - Repair protocol

### Instructions

- This file - Layer 4B protocol documentation

## Usage Examples

### For AI Agents

**Before creating any markdown file**:

1. Review [validate-before-create](../prompts/validate-before-create.prompt.md)
2. Draft content following checklist
3. Create file
4. Optionally run validation: `./scripts/check-markdown.sh`
5. If issues: `./scripts/auto-repair-markdown.sh`

**After creating markdown content**:

```bash
# Validate
./scripts/check-markdown.sh

# If validation fails, auto-repair
./scripts/auto-repair-markdown.sh
```

### For Developers

**Quick validation**:

```bash
# From project root
./scripts/check-markdown.sh
```

**Quick repair**:

```bash
# From project root
./scripts/auto-repair-markdown.sh
```

**From web directory**:

```bash
cd web
pnpm markdown:validate  # Full validation
pnpm markdown:fix       # Auto-fix
pnpm markdown:lint      # Show errors only
```

## Success Metrics

After implementing Layer 4B:

- ✅ **100% Validation Pass Rate** - All markdown compliant before commit
- ✅ **Zero Blocking Failures** - Auto-repair prevents workflow interruption
- ✅ **Self-Healing System** - Learns from repair patterns
- ✅ **Prevention First** - Pre-flight catches issues early
- ✅ **Complete Documentation** - All cross-references accurate

## Enhanced Agent Instructions

All AI agents must adopt this protocol:

### Mandatory Behaviors

1. **Use pre-flight validation** - Review checklist before creating files
2. **Guarantee compliance** - Never return non-compliant markdown
3. **Auto-repair on failure** - Run repair script if validation fails
4. **Report status** - Include validation results in progress updates
5. **Learn patterns** - Document common issues for prevention

### Workflow Integration

**Layer 3A** (Instructions Factory):

- Add: "Use [Layer 4B](./layer-4b-markdown-resilience.instructions.md) pre-flight before creating `.instructions.md`"
- Add: "Run validation after creation, auto-repair if needed"

**Layer 3B** (Chatmodes Factory):

- Add: "Follow [Layer 4B resilience protocol](./layer-4b-markdown-resilience.instructions.md)"
- Add: "Never return non-compliant files"

**Layer 3C** (Prompts Factory):

- Add: "Embed [Layer 4B validation](./layer-4b-markdown-resilience.instructions.md) in creation workflow"
- Add: "Use pre-flight checklist for all prompts"

## Verify & Exit

Layer 4B is complete when:

- ✅ Scripts exist and are executable
- ✅ Prompts exist and are valid markdown
- ✅ This instruction file exists
- ✅ VS Code tasks include markdown validation
- ✅ `.github/copilot-instructions.md` references Layer 4B
- ✅ `AGENTS.md` includes markdown resilience section
- ✅ Layers 3A/3B/3C reference Layer 4B
- ✅ Layer 4 updated to include Layer 4B extension
- ✅ All validation passes: `./scripts/triad-health.sh && ./scripts/check-markdown.sh`

## Relationship to Layer 4

Layer 4B **extends** (not replaces) Layer 4:

- Layer 4: Core automation, triad health, validator scripts
- Layer 4B: Markdown-specific resilience and self-healing
- Both work together as comprehensive quality system

Reference Layer 4B from Layer 4 as a specialized extension for markdown quality assurance.
