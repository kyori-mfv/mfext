# Load Context Command

Load project context from .claude/docs documentation files.

## Usage

```
/load [type]
```

## Arguments

- `context` - Load project-context.md 
- `plan` - Load development-plan.md
- `all` - Load all .claude/docs files (default)
- `[filename]` - Load specific file from .claude/docs directory

## Examples

```
/load
/load context  
/load plan
/load all
/load architecture
/load api-design
```

## Implementation

When this command is used, Claude should:

1. Read the specified .claude/docs documentation file(s)
2. Analyze current project state based on the documentation
3. Show summary of what's loaded
4. Be ready for implementation tasks

## Behavior

- **No argument or `all`**: Load all .md files from .claude/docs directory
- **Specific names**: Map to known files (context → project-context.md, plan → development-plan.md)
- **Unknown names**: Try loading as filename.md from .claude/docs directory
- **Missing files**: Show error and list available files

## Core Documentation Files

- `project-context.md` - MFExt architecture and current status
- `development-plan.md` - Development roadmap and phases
- Additional context files can be added as needed