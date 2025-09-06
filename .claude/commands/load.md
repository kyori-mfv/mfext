# Load Context Command

Load project context from .claude/docs documentation files.

## Usage

```
/load [type]
```

## Core Behavior

**ALWAYS LOADED**: Every `/load` command execution automatically includes:
1. `project-context.md` - Project architecture and current status
2. All development rules from `development/rules/` directory (all .md files in the rules folder)

## Arguments

- `phase-[n]` - Load specific phase documentation (e.g., phase-1, phase-2)
- `[filename]` - Load specific file from .claude/docs directory

## Examples

```
/load                  # Loads core files (project context + development rules)
/load phase-1          # Loads phase-1 + core files
/load [filename]          # Loads phase-1 + core files
```

## Implementation

When this command is used, Claude should:

1. **ALWAYS** read project-context.md first
2. **ALWAYS** read all .md files from development/rules/ directory (flexible for future rules)
3. Read the specified additional documentation file(s)

## Behavior

- **No argument**: Load core files (project context + development rules)
- **Specific names**: Map to known files + core files:
  - `phase-[n]` → development/release/phase-[n]/ + core files (specific phase)

## Rule Awareness Behavior

After loading, Claude will:

1. **Rule Awareness**: Be aware of development rules for reference during implementation
2. **Context Understanding**: Understand project structure and conventions
3. **Reference Available**: Use loaded rules as guidance when implementing changes
4. **Project Knowledge**: Have current project context for informed decision-making

## Context Types

### Phase Context (`/load phase-1`)
Loads current development phase documentation + core files containing:
- Detailed implementation plans
- Task progress checklists
- Phase-specific requirements and success criteria
- Development workflow guidance