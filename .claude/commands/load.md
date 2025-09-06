# Load Context Command

Load project context from .claude/docs documentation files.

## Usage

```
/load [type]
```

## Core Behavior

**ALWAYS LOADED**: Every `/load` command execution automatically includes:
1. `project-context.md` - Project architecture and current status
2. `development-plan.md` - Project overview and development roadmap
3. All development rules from `development/rules/` directory (all .md files in the rules folder)

## Arguments

- `context` - Load only core files (minimal load)
- `validate` - Load validation.md + core files (build validation context)
- `phase` - Load current phase documentation (release/phase-1 by default) + core files
- `phase-[n]` - Load specific phase documentation (e.g., phase-1, phase-2) + core files
- `all` - Load all .claude/docs files (default) + core files
- `[filename]` - Load specific file from .claude/docs directory + core files

## Examples

```
/load                  # Loads all files + core files
/load context          # Loads minimal core files only
/load validate         # Loads validation rules + core files
/load phase            # Loads current phase + core files
/load phase-1          # Loads phase-1 + core files
/load all              # Loads everything + core files
```

## Implementation

When this command is used, Claude should:

1. **ALWAYS** read project-context.md first
2. **ALWAYS** read development-plan.md for project overview
3. **ALWAYS** read all .md files from development/rules/ directory (flexible for future rules)
4. Read the specified additional documentation file(s)
5. Analyze current project state based on all loaded documentation
6. Show summary of what's loaded
7. Be ready for implementation tasks with full context

## Behavior

- **No argument or `all`**: Load all .md files from .claude/docs directory + core files
- **Specific names**: Map to known files + core files:
  - `context` → core files only (minimal load)
  - `validate` → validation.md + core files
  - `phase` → development/release/phase-1/ + core files (current phase)
  - `phase-[n]` → development/release/phase-[n]/ + core files (specific phase)
- **Phase loading**: Loads both implementation-plan.md and task-checklist.md from phase directory + core files
- **Unknown names**: Try loading as filename.md from .claude/docs directory + core files
- **Missing files**: Show error and list available files

## Core Documentation Files (Always Loaded)

- `project-context.md` - MFExt architecture and current status
- `development-plan.md` - Project overview and development roadmap
- `development/rules/*.md` - All development rules (flexible for future additions):
  - Currently includes: code-conventions.md, impl-process.md, validation.md
  - Automatically includes any new rules added to the directory

## Additional Documentation Files

- `development/release/phase-1/implementation-plan.md` - Phase 1 detailed technical breakdown
- `development/release/phase-1/task-checklist.md` - Phase 1 progress tracking
- Additional context files can be added as needed

## Context Types

### Validate Context (`/load validate`)
Loads validation rules + core files containing:
- Required build and test commands
- Playground-specific validation requirements
- Server validation steps
- Troubleshooting guide
- Quality gates before task completion

### Phase Context (`/load phase` or `/load phase-1`)
Loads current development phase documentation + core files containing:
- Detailed implementation plans
- Task progress checklists
- Phase-specific requirements and success criteria
- Development workflow guidance