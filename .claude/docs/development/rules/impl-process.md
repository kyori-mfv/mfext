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
- Follow validate rule when needing to run build or test anything
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
- **Content**: Must include all four required sections below

### Required Documentation Sections

#### 1. Solution Overview
- **What was implemented**: Clear description of the completed feature/task
- **How it works**: Technical explanation of the solution
- **Integration points**: How it connects with existing system components

#### 2. Challenges Encountered
- **Technical obstacles**: Issues faced during implementation
- **Complexity areas**: Parts that required careful consideration
- **Blockers resolved**: Problems that needed specific solutions

#### 3. Strategy & Decision Making
- **Approach rationale**: Why this strategy was chosen over alternatives
- **Trade-offs made**: What was prioritized vs. what was deferred
- **Architecture decisions**: Key design choices and their reasoning

#### 4. Implementation Approach
- **Technical steps taken**: High-level implementation workflow
- **Key files/components**: Main areas of the codebase affected
- **Validation methods**: How the solution was tested and verified

### Documentation Template

```markdown
# Implementation Summary: [Task Name]

## Solution Overview
- **Implemented**: [Brief description]
- **Functionality**: [How it works]
- **Integration**: [Connection points]

## Challenges Encountered
- **Challenge 1**: [Description and resolution]
- **Challenge 2**: [Description and resolution]

## Strategy & Decision Making
- **Approach**: [Why this strategy]
- **Trade-offs**: [What was prioritized]
- **Architecture**: [Key design decisions]

## Implementation Approach
- **Steps**: [Technical workflow]
- **Key Files**: [Main components modified/created]
- **Validation**: [Testing and verification methods]
```

### Documentation Enforcement
- **Completion Gate**: Task is not considered complete until documentation is written
- **Review Requirement**: Documentation should be comprehensive enough for future reference
- **Knowledge Preservation**: Ensures implementation knowledge is captured for the team