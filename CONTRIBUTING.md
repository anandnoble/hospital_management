# Contributing Guidelines & Git Conventions

## 1. Commit Message Convention

All commit messages must follow standard Conventional Commits format:

Examples:
- `feat(backend): implement hospital assignment logic in edge function`
- `feat(patient): create emergency request voice button`
- `feat(hospital): add urgent FCM alert notification screen`
- `feat(ambulance): add live GPS location streaming handler`
- `docs(contracts): update hospital accept API contract payload`
- `fix(web): resolve realtime timeline update subscription bug`

---

## 2. Definition of Done (DoD)

A task or feature is considered **DONE** only when:
1. Implementation is completely written.
2. Code builds cleanly (`npm run build` or Android build passes).
3. No silent errors or unhandled edge function exceptions.
4. No cross-agent boundary violations (Agent 1/2/3 code modified only in appropriate folders).
5. Git commit created on proper `agent/*` branch.
6. `TEAM_STATUS.md` updated with progress log.
