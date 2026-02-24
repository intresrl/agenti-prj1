# Food Cost SaaS - Product Backlog

**Author:** Archetipo
**Date:** February 24, 2026

---

## Overview

This backlog prioritizes the **Recipe Engine** and **Data Accuracy** (PDF parsing). The Foundation epic ensures we start with a robust Angular 21 structure immediately.

**Statistics:**
- Total Epics: 5
- Total User Stories: 18

---

## Epic 1: Foundation & Architecture
**Goal:** Establish a scalable B2B SaaS environment using Angular 21 and NestJS.

### Story 1.1: Project Initialization & Monorepo Setup
**As a** Developer,
**I want** to set up an Nx workspace with Angular 21 (Client) and NestJS (API),
**So that** we share types and ensure type safety across the stack.
- **AC1:** Workspace compiles with `npm start`.
- **AC2:** Angular 21 configured with Standalone components and Signals enabled.
- **AC3:** PostgreSQL connection established via Docker Compose.

### Story 1.2: Multi-tenant Authentication
**As a** Restaurant Owner,
**I want** to register my restaurant and invite staff,
**So that** my data is secure and separate from other restaurants.
- **AC1:** Register form creates a new Tenant and Admin User.
- **AC2:** API endpoints are protected by `TenantGuard`.
- **AC3:** Staff users can accept invites and strictly "Read Only" access to recipes.

---

## Epic 2: Ingredient Mastery
**Goal:** Manage the fundamental building blocks (Ingredients) and their costs.

### Story 2.1: Ingredient CRUD
**As a** Chef,
**I want** to add raw materials with their price and unit (Kg/L/Pz),
**So that** I can use them in my recipes.
- **AC1:** Form captures: Name, Category, Price, Unit size (e.g., Bottle 0.75L).
- **AC2:** System normalizes price to Base Unit (Price/Kg or Price/L) automatically.
- **AC3:** Edit form allows updating price, which triggers a "Price Change Event".

### Story 2.2: Price History Tracking
**As a** Manager,
**I want** the system to record every price change,
**So that** I can see how inflation affects my buying power.
- **AC1:** When price is updated, old price is moved to a `PriceHistory` table with a timestamp.
- **AC2:** Dashboard shows a sparkline graph of price trends for a selected ingredient.

---

## Epic 3: The Recipe Engine
**Goal:** The core value proposition - Recursive recipe creation and costing.

### Story 3.1: Recursive Recipe Builder
**As a** Chef,
**I want** to create a recipe that includes valid ingredients OR other existing recipes,
**So that** I can reuse my "Fondo Bruno" (Brown Stock) in multiple dishes.
- **AC1:** Recipe Editor searches both Ingredients and Recipes.
- **AC2:** Adding a "Sub-recipe" locks its internal ratios but allows quantity scaling.
- **AC3:** Visual indicator distinguishes Raw Ingredients vs Sub-recipes in the list.

### Story 3.2: Dynamic Food Cost Calculator
**As a** Chef,
**I want** to see the cost per portion update instantly as I change quantities,
**So that** I can engineer the dish to fit my budget.
- **AC1:** Changing quantity (grams) updates line cost immediately (using Angular Signals).
- **AC2:** Total Food Cost is sum of all lines.
- **AC3:** "Cost per serving" is calculated based on "Yield" (Total Weight / Portion Weight).

### Story 3.3: Fixed Costs Integration (Overhead)
**As a** Manager,
**I want** to add Staff and Energy costs to the recipe,
**So that** I see the *Total* cost, not just the Food cost.
- **AC1:** Input field for "Preparation Time" (Minutes).
- **AC2:** Input field for "Energy Cost" (Manual generic value €).
- **AC3:** Final Calculation: `Food Cost + (Time * Avg Hourly Rate) + Energy`.

---

## Epic 4: Document Intelligence (PDF Upload)
**Goal:** Automate data entry using invoices.

### Story 4.1: PDF Upload & Parsing Service
**As a** Chef,
**I want** to upload a supplier PDF invoice,
**So that** I don't have to type in price updates manually.
- **AC1:** User drags & drops PDF.
- **AC2:** Backend processes text extraction (OCR/Text layer).
- **AC3:** Service identifies familiar patterns (Date, Line Items, Prices).

### Story 4.2: Data Review & Reconciliation
**As a** Chef,
**I want** to review the extracted prices before they overwrite my database,
**So that** errors in parsing don't ruin my cost accuracy.
- **AC1:** "Review" Screen shows side-by-side: PDF snippet vs Extracted Data.
- **AC2:** User confirms matches or corrects them.
- **AC3:** Clicking "Apply" updates the Ingredient prices and Cost History.

---

## Summary

This backlog provides a clear path to MVP. Integrating **Angular 21** requires staying up to date with the latest RxJS/Signals interoperability patterns, but ensures the application remains performant for years. The **Recursive Recipe** logic in Epic 3 is the most complex algorithmic challenge and should be approached with rigorous testing.
