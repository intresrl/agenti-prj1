# GitHub Copilot Instructions

## Project: Food Cost SaaS

B2B SaaS platform for restaurant professionals to manage food costs, recipes, and ingredient pricing.

---

## Tech Stack

- **Frontend:** Angular 21 (Standalone Components, Signals)
- **Backend:** NestJS
- **Monorepo:** Nx Workspace
- **Database:** PostgreSQL (via Docker Compose)
- **Architecture:** Multi-tenant SaaS

---

## Key Documents

- **PRD:** [`PRD.md`](../PRD.md) — Product Requirements Document with vision, personas, scope and features.
- **Backlog:** [`BACKLOG.md`](../BACKLOG.md) — Prioritized user stories and acceptance criteria.

---

## Coding Guidelines

### General
- Use **TypeScript** with strict mode enabled at all times.
- Share types between frontend and backend via Nx libraries.
- Prefer **functional and declarative** patterns over imperative ones.

### Angular (Frontend)
- Use **Standalone Components** exclusively — no NgModules.
- Use **Angular Signals** for reactive state management.
- Use `inject()` instead of constructor injection.
- Use `OnPush` change detection strategy on all components.
- Name component files: `feature-name.component.ts`.

### NestJS (Backend)
- Enforce **TenantGuard** on all API endpoints to guarantee multi-tenant data isolation.
- Use **DTOs** with `class-validator` for all input validation.
- Use **TypeORM** for database access with repository pattern.
- All price changes must emit a `PriceChangeEvent` for history tracking.

### Naming Conventions
- Variables and functions: `camelCase`
- Classes and interfaces: `PascalCase`
- Files: `kebab-case`
- Database tables: `snake_case`

---

## Domain Concepts

- **Tenant:** A restaurant or kitchen location. All data is scoped to a tenant.
- **Ingredient:** Raw material with a price per base unit (Kg or L).
- **Recipe:** A combination of Ingredients and/or other Recipes (recursive/sub-recipes).
- **Sub-recipe:** A recipe embedded inside another recipe (e.g., a sauce used in multiple dishes).
- **Food Cost:** The calculated cost of a recipe based on ingredient quantities and prices.
- **Overhead:** Fixed costs added to a recipe (staff hours × hourly rate + energy cost).
- **Price History:** Log of all price changes for an ingredient, used for trend visualization.
- **Yield:** The ratio of total recipe weight to portion weight, used to calculate cost per serving.

---

## Business Rules

1. Ingredient prices must always be normalized to a **base unit** (Price/Kg or Price/L).
2. Sub-recipe quantities can be scaled, but internal ratios are locked.
3. Food Cost calculation must be **real-time** (reactive via Angular Signals).
4. Staff users have **read-only** access — never generate code that allows write operations for the Staff role.
5. Every ingredient price update must store the old value in `PriceHistory` with a timestamp.

---

## Agile Development

- Follow **standard agile acceptance criteria** for each user story defined in [`BACKLOG.md`](../BACKLOG.md).
- Every story must have clear, testable **AC (Acceptance Criteria)** in the format:
  - **AC1:** Given [context], when [action], then [expected outcome].
- Do not consider a story complete unless all its acceptance criteria are verifiably satisfied.
- When implementing a feature, reference the corresponding story and AC from the backlog.
