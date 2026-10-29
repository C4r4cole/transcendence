
# ft_transcendence — Git Branch Naming Conventions

## 1. General Rules

All branch names must follow this format:

`<type>/<short-description>`

Conventions:
- Use English only.
- Use lowercase letters.
- Separate words with hyphens (`-`).
- Avoid spaces, accents and special characters.
- Use short, descriptive names.
- Create branches from an up-to-date `main`.

## 2. Branch Types

| Prefix | Purpose | Example |
|---|---|---|
| `feat/` | New feature or functionality | `feat/websocket` |
| `fix/` | Bug fix | `fix/player-disconnection` |
| `refactor/` | Code restructuring without changing behavior | `refactor/game-engine` |
| `docs/` | Documentation updates | `docs/game-rules` |
| `test/` | Adding or updating tests | `test/websocket` |
| `chore/` | Maintenance, configuration or tooling | `chore/eslint-config` |

## 3. Main Branch

### `main`

The `main` branch contains the stable version of the project.

Rules:
- Do not develop directly on `main`.
- All changes should be integrated through Pull Requests.
- Review changes before merging.
- Keep `main` functional.

## 4. Planned Feature Branches

The following branches may be created as development progresses.

| Branch | Responsibility |
|---|---|
| `feat/websocket` | Real-time communication between clients and server |
| `feat/game-engine` | Movement, stumbling mechanics and victory conditions |
| `feat/game-ui` | Game rendering, characters, track and animations |
| `feat/matchmaking` | Automatic matchmaking |
| `feat/local-multiplayer` | Two players on the same keyboard |
| `feat/auth` | Registration, login and authentication |
| `feat/database` | PostgreSQL, Prisma and database schema |
| `feat/game-stats` | Match history and player statistics |
| `feat/design-system` | Reusable React UI components |
| `feat/docker` | Dockerfiles and Docker Compose configuration |
| `feat/nginx` | Reverse proxy, HTTPS and WebSocket routing |
| `feat/monitoring` | Prometheus, Grafana, dashboards and alerts |

**Important:** Do not create all these branches immediately. Create each branch only when starting the corresponding feature.

## 5. Git Workflow

### Step 1 — Update main

```bash
git switch main
git pull origin main
```

### Step 2 — Create a feature branch

```bash
git switch -c feat/websocket
```

### Step 3 — Develop and commit

```bash
git add .
git commit -m "feat: implement websocket connection"
```

### Step 4 — Push the branch

```bash
git push -u origin feat/websocket
```

### Step 5 — Open a Pull Request

On GitHub:
1. Open a Pull Request from `feat/websocket` into `main`.
2. Request a review from another team member.
3. Resolve any conflicts or requested changes.
4. Merge the Pull Request once approved.

### Step 6 — Delete the merged branch

After merging:

```bash
git switch main
git pull origin main
git branch -d feat/websocket
```

To delete the remote branch if necessary:

```bash
git push origin --delete feat/websocket
```

## 6. Commit Message Conventions

Commit messages should follow this format:

`<type>: <description>`

Examples:

```text
feat: implement websocket server
fix: prevent movement during countdown
refactor: simplify game state management
docs: update game rules
test: add player movement tests
chore: configure docker compose
```

Use clear, concise messages describing the changes.

## 7. Team Collaboration Rules

- One branch per feature or task.
- Avoid developing directly on `main`.
- Pull the latest changes before creating a new branch.
- Prefer small, focused commits.
- Open Pull Requests for completed features.
- Have at least one teammate review each Pull Request.
- Resolve merge conflicts before merging.
- Delete branches after merging when they are no longer needed.
- Do not commit credentials, passwords, API keys or `.env` files.

---

**Project:** ft_transcendence  
**Document:** Git Branch Naming Conventions  
**Version:** 1.0
