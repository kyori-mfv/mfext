# Implementation Process Rule

## Core Principles

### Implementation Approach
- Only implement simple solutions to achieve the task
- Avoid over-engineering or complex implementations
- Choose the most straightforward path to completion

### Demonstration Requirements
- Introduce the feature/change in playground to demonstrate functionality for any phase
- Use playground application to showcase implementation results
- Ensure playground examples clearly demonstrate the implemented features

### Validation Requirements
- Follow validation pipeline rule when needing to run build or test anything
- After completing any task/phase, follow validate rule to run tests before marking task as done
- All validation must pass before task completion

### Completion Process
- Mark done in phase checklist when task is completed
- Mark done in development plan checklist when phase is completed
- Ensure all validation rules are satisfied before marking completion

## Post-Implementation Documentation

**MANDATORY**: After completing any task/phase, document the implementation approach:

### Documentation Requirements
- **Location**: Place documentation in current phase implementation folder (e.g., `.claude/docs/development/release/phase-1/`)
- **Filename**: `implementation-summary.md` (standard filename for each phase)
