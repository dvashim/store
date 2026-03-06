# Create and commit a changeset for the current branch

Create a changeset file summarizing all changes on the current branch and commit it.

## Steps

### 1. Gather context

Run these commands to understand the current branch state:

- `git branch --show-current` — get the current branch name.
- `git log main..HEAD --oneline` — list all commits on this branch that are not in main.
- `git diff main...HEAD --stat` — see which files changed and how much.
- `git diff main...HEAD` — read the actual diffs to understand what changed.
- Read `package.json` to confirm the package name.
- Check `.changeset/` for any existing changeset `.md` files (excluding `config.json`) to avoid duplicating work.

If the current branch IS main, or there are no commits ahead of main, stop and inform the user that there is nothing to create a changeset for.

If a changeset `.md` file already exists in `.changeset/`, inform the user and ask whether to replace it or abort.

### 2. Determine the version bump level

Analyze the commit messages using conventional commit prefixes to determine the bump level:

- **major** — any commit message contains `BREAKING CHANGE` in the body/footer, or uses `!` after the type (e.g., `feat!:`, `fix!:`).
- **minor** — any commit message starts with `feat:` or `feat(…):`.
- **patch** — all other prefixes: `fix:`, `docs:`, `chore:`, `refactor:`, `style:`, `perf:`, `test:`, `build:`, `ci:`, or no conventional prefix.

Use the **highest** level found across all commits (major > minor > patch).

If the user provided arguments, treat them as an override for the bump level. Valid overrides: `patch`, `minor`, `major`. Example: `/changeset minor`

### 3. Write the changeset file

Create a file at `.changeset/<branch-name>.md` where `<branch-name>` is the current git branch name (kebab-case, as-is).

Use this exact format:

```markdown
---
"@dvashim/store": <patch|minor|major>
---

<Description of changes>
```

Description guidelines:
- For a **single commit**: use a concise one-line summary derived from the commit message (do not just copy the raw commit message — make it a clean, user-facing description).
- For **multiple commits**: group related changes under markdown headings (`###`) with bullet points underneath. Focus on what changed from a user/consumer perspective, not implementation details.
- Write in imperative mood (e.g., "Add support for…", "Fix issue where…").
- Do not include commit hashes, branch names, or internal tooling details.

### 4. Commit the changeset

Stage only the new changeset file and commit with this message format:

```
chore: add changeset for <branch-name> branch
```

Do NOT push to the remote.

## User arguments

$ARGUMENTS
