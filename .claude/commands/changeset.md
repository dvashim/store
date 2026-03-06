# Create and commit a changeset for the current branch

Create a changeset file summarizing all changes on the current branch and commit it.

This project uses `@changesets/changelog-github` which automatically prepends PR number, commit hash, and author credit to each CHANGELOG entry during `changeset version`. The changeset description becomes the text after that prefix, so it must be clean, user-facing prose — no PR links, commit hashes, or author references.

## Steps

### 1. Gather context

Run these commands to understand the current branch state:

- `git branch --show-current` — get the current branch name.
- `git log main..HEAD --oneline` — list all commits on this branch that are not in main.
- `git diff main...HEAD --stat` — see which files changed and how much.
- `git diff main...HEAD` — read the actual diffs to understand what changed.
- Read `package.json` to confirm the package name.
- Check `.changeset/` for any existing changeset `.md` files (excluding `config.json` and `README.md`) to avoid duplicating work.

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

- The `@changesets/changelog-github` plugin renders each changeset as a list item (`- [#PR] [commit] Thanks [@author]! - <your description>`). Your description is inlined after that prefix.
- Do NOT use markdown headings (`#`, `##`, `###`) — they break when nested inside a list item in the CHANGELOG.
- Do NOT include PR numbers, commit hashes, author names, or GitHub links — the plugin adds these automatically.
- Write in imperative mood (e.g., "Add support for…", "Fix issue where…").
- For a **single commit**: write a concise one-line summary (do not just copy the raw commit message — make it a clean, user-facing description).
- For **multiple commits**: write a brief summary line, then a blank line, then a flat bullet list. Use **bold text** for grouping if needed, not headings. Example:

```markdown
Improve documentation and add tooling

- **Docs:** Improve README installation section with separate code blocks
- **Docs:** Fix CHANGELOG indentation for proper markdown rendering
- **Tooling:** Add changeset slash command
```

### 4. Commit the changeset

Stage only the new changeset file and commit with this message format:

```text
chore: add changeset for <branch-name> branch
```

Do NOT push to the remote.

## User arguments

$ARGUMENTS
