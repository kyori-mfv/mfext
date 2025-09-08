# Analyze Command

Analyze development phases and tasks based on the current development plan and project context.

## Usage

```
/analyze [phase-n] [task-n]
/analyze [phase-n]
/analyze
```

## Core Behavior

**ALWAYS LOADED**: Every `/analyze` command execution automatically includes:
1. `project-context.md` - Project architecture and current status
2. `development-plan.md` - Complete development roadmap and phase matrix

## Arguments

- `phase-n` - Analyze specific phase (e.g., phase-1, phase-2, phase-3)
- `task-n` - Analyze specific task within a phase (requires phase to be specified)
- No arguments - Analyze current overall project status

## Examples

```
/analyze                    # Analyze overall project status and next steps
/analyze phase-2            # Analyze all tasks in Phase 2
/analyze phase-2 task-1     # Analyze specific task 1 in Phase 2
/analyze phase-3 task-2     # Analyze specific task 2 in Phase 3
```

## Implementation

When this command is used, Claude should:

1. **ALWAYS** read project-context.md first for current project state
2. **ALWAYS** read development-plan.md for phase and task definitions
3. **CONDITIONALLY** read phase-specific documentation from `development/release/phase-[n]/`
4. Analyze the requested scope (overall, phase, or specific task)
5. **ALWAYS** update tracking documentation in `docs/development/` structure

## Analysis Scope

### Overall Analysis (`/analyze`)
- Review completed phases and current progress
- Identify next priority phases/tasks
- Assess project health and blockers
- Recommend immediate actions

### Phase Analysis (`/analyze phase-n`)
- Detailed analysis of all tasks within the specified phase
- Dependencies and prerequisites check
- Implementation readiness assessment
- Risk assessment and mitigation strategies

### Task Analysis (`/analyze phase-n task-n`)
- Deep dive into specific task requirements
- Technical approach recommendations
- Implementation steps and acceptance criteria
- Dependencies and integration points

## Output Behavior

After analysis, Claude will:

1. **Analysis Report**: Provide detailed findings and recommendations
2. **Progress Tracking**: Update relevant documentation in `docs/development/`
3. **Next Steps**: Clear actionable recommendations
4. **Documentation Update**: Ensure phase tracking files are current
