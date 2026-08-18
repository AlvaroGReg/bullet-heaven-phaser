---
name: write-a-skill
description: Use when creating or revising an agent skill, SKILL.md, skill instructions, references, or utility scripts. Guides a concise requirements-first workflow for reusable skills.
metadata:
  source: https://skills.sh/mattpocock/skills/write-a-skill
  note: Locally restored because the published skill page exists but the upstream repository no longer exposes the skill to the CLI.
---

# Writing Skills

## Process

1. Gather the task domain, concrete prompts the skill must handle, required scripts or references, and constraints.
2. Draft a focused `SKILL.md`. Use extra reference files only when they keep the main instructions concise.
3. Review the draft against every stated use case. Clarify only requirements that change the workflow or output.
4. Finalize the skill in its own lowercase hyphenated directory with a trigger-focused frontmatter description.

## Authoring Rules

- State exactly when the skill must be used and when it must not be used.
- Put the shortest safe workflow in `SKILL.md`; link to references for exceptional or detailed procedures.
- Prefer deterministic utility scripts for repeatable calculations, validation, or formatting.
- Base instructions on the repository's actual files and conventions, not generic architecture.
- Include verification steps and explicit assumptions for calculations or estimates.
- Do not duplicate an existing skill or subagent unless it adds a distinct, reusable capability.

## Review Checklist

- The description contains terms a user will actually request.
- Each example prompt has an unambiguous workflow.
- The scope is narrow enough to load only when relevant.
- Required edits, tests, and known limitations are explicit.
