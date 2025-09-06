# Code Conventions Rule

## Language Standards
- Follow JavaScript, Node.js, and React.js coding conventions
- Prefer TypeScript over JavaScript for all purposes when possible
- Use TypeScript for type safety and better development experience

## Architecture Principles
- Core package should only focus on build tools and server functionality
- Create separate packages for specific purpose components (similar to Next.js approach)
- Maintain clear separation of concerns between packages

## General Principles
- Follow existing code style and patterns in the codebase
- Maintain consistency with surrounding code
- Use established libraries and utilities already present in the project

## Before Making Changes
- Check existing files for code conventions and patterns
- Look at package.json (or equivalent) to verify available libraries
- Examine neighboring files to understand the project structure
- Review imports and framework choices in the target area

## Coding Standards
- Never assume library availability - always verify dependencies exist
- Follow existing naming conventions in the codebase
- Match indentation style (tabs vs spaces) used in the file
- Use the same import patterns and organization as existing code
- Follow established error handling patterns

## Security Requirements
- Never introduce code that exposes or logs secrets and keys
- Never commit secrets or keys to the repository
- Always follow security best practices

## Component/Module Creation
- Study existing components before creating new ones
- Match framework choice, typing, and architectural patterns
- Use consistent file naming and organization
- Follow established folder structure conventions

## Comments and Documentation
- Do not add comments unless explicitly requested
- Keep code self-documenting through clear naming
- Follow existing documentation patterns if they exist