# Decision Log — Biome Migration

## Context
- Repository was documented to use ESLint flat config with eslint-config-prettier for formatting
- Next.js workspace (`web/`) was already scaffolded with Biome 2.2.0 from create-next-app template
- User requested migration to modern Biome linter tool (October 2025)
- Need to update all documentation and instructions to reflect Biome as the standard

## Decision
- Adopt Biome 2.2.0 as the primary linter and formatter for the entire project
- Remove all references to ESLint and Prettier from documentation
- Configure VS Code to use Biome as default formatter with automatic code actions
- Create comprehensive documentation for Biome usage, best practices, and troubleshooting
- Add Biome to VS Code recommended extensions

## Rationale
- **Performance**: Biome is 10-100x faster than ESLint due to Rust implementation
- **Simplicity**: Single tool replaces ESLint + Prettier + import organizers
- **Modern**: Biome represents the state-of-art (October 2025) for JavaScript/TypeScript tooling
- **Already installed**: The Next.js scaffold included Biome 2.2.0, reducing migration effort
- **Better DX**: Biome provides better error messages with contextual suggestions
- **Native TypeScript**: Built-in TypeScript support without requiring plugins

## Implementation Details

### Files Modified
1. `.github/copilot-instructions.md`
   - Replaced ESLint flat config reference with Biome
   - Updated guardrails to reflect modern tooling

2. `memory-bank/techContext.md`
   - Updated stack baseline to document Biome v2.2.0+
   - Removed ESLint/Prettier references

3. `memory-bank/instructions/layer-2-verify-and-bootstrap.instructions.md`
   - Renamed section D from "ESLint + Prettier Posture" to "Biome Linting and Formatting Posture"
   - Updated procedure to document Biome expectations
   - Added Biome usage commands and performance notes

4. `.vscode/settings.json`
   - Set `editor.defaultFormatter` to `biomejs.biome`
   - Added `quickfix.biome` and `source.organizeImports.biome` code actions
   - Configured Biome for all TypeScript/JavaScript file types

### Files Created
1. `.vscode/extensions.json`
   - Added Biome VS Code extension to recommendations
   - Includes GitHub Copilot extensions

2. `memory-bank/instructions/biome-linting-formatting.instructions.md`
   - Comprehensive guide covering:
     - Why Biome and its benefits
     - Common commands and usage
     - Configuration structure and explanation
     - VS Code integration details
     - Package.json scripts
     - CI/CD integration patterns
     - Migration notes from ESLint/Prettier
     - Troubleshooting guide
     - Best practices
     - References and related instructions

### Existing Configuration
- `web/biome.json` (already present from create-next-app)
  - Git integration enabled
  - Recommended rules for React and Next.js
  - Import organization enabled
  - Proper file exclusions (node_modules, .next, dist, build)

### Testing Performed
1. Verified Biome installation and version (2.2.0)
2. Ran `pnpm biome check` on existing codebase - all files pass
3. Created test file with intentional issues:
   - Unused imports detected and auto-fixed
   - Unused variables caught with helpful suggestions
   - Formatting issues corrected
   - React accessibility issues identified (button type)
4. Verified auto-fix functionality with `--write` flag
5. Confirmed import organization works correctly

## Benefits Realized
- **Faster linting**: Biome checks complete in ~5ms vs typical ESLint runs
- **Unified tooling**: Single command for lint + format + import organization
- **Better errors**: Clear, actionable error messages with fix suggestions
- **Simpler config**: One `biome.json` file instead of multiple config files
- **Editor integration**: Seamless VS Code integration with format-on-save

## Migration Path
For future repositories or projects still using ESLint/Prettier:
1. Install `@biomejs/biome` as dev dependency
2. Create `biome.json` with recommended configuration
3. Update VS Code settings to use Biome as default formatter
4. Remove ESLint and Prettier packages
5. Update package.json scripts to use Biome commands
6. Update documentation and instructions
7. Test thoroughly before committing

## Next Steps
- Documentation is complete and tested
- All memory bank files updated with migration details
- VS Code workspace ready for Biome usage
- Developers should install Biome VS Code extension for optimal experience
- CI/CD pipelines should use `pnpm biome check` for validation

## References
- [Biome Official Documentation](https://biomejs.dev/)
- [Biome Migration Guide](https://biomejs.dev/guides/migrate-eslint-prettier/)
- `memory-bank/instructions/biome-linting-formatting.instructions.md`
- `web/biome.json`
