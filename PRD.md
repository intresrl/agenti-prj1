# Food Cost SaaS - Product Requirements Document

**Author:** Archetipo
**Date:** February 24, 2026
**Version:** 1.0

---

## Executive Summary

**Food Cost SaaS** is a B2B platform designed to give restaurant professionals absolute control over their margins. It automates the complex calculation of dish costs by combining dynamic ingredient prices, sub-recipe management, and overhead allocation into a simple, precise dashboard.

### What Makes This Special

Unlike generic spreadsheets or rigid legacy software, our system allows for **recursive sub-recipes** (recipes within recipes), **historical price tracking** via automated PDF invoice scanning, and granular control over overhead costs (staff/energy), all wrapped in a high-performance **Angular 21** interface.

---

## Vision

To empower every chef and restaurateur with the financial clarity needed to run a profitable kitchen, transforming "food cost" from a guessing game into an exact science.

### Strategic Objectives

1.  **Eliminate Manual Calculation:** Automate unit conversions (kg/L/units) and cost updates.
2.  **Maximize Reusability:** Encourage the use of "Macro Recipes" (bases/sauces) to speed up menu creation.
3.  **Monitor Volatility:** provide visibility on ingredient price trends over time.

### Long-Term Impact

Standardize kitchen management workflows, reduce food waste through better awareness, and ensure restaurant profitability in a low-margin industry.

---

## Business Model

**SaaS B2B (Software as a Service)**
-   **Revenue Model:** Monthly/Yearly subscription per restaurant location.
-   **Target:** Independent restaurants, small chains, dark kitchens.

---

## Target Users

### Persona 1: Chef Marco (The Manager/Admin)

-   **Role:** Executive Chef / Owner.
-   **Goal:** Calculate precise prices for the new menu, monitor rising ingredient costs.
-   **Pain Points:** Loses hours updating Excel sheets when butter price goes up; struggles to estimate true cost including gas/staff.
-   **Tech Savviness:** Medium-High (uses desktop for management).

### Persona 2: Kitchen Staff (The Executors)

-   **Role:** Commis / Line Cook.
-   **Goal:** Consult recipes for preparation quantities.
-   **Access:** Read-only view of recipes and procedures.

---

## Project Classification

**Technical Type:** SaaS B2B Web Application
**Domain:** Food & Beverage / Management
**Complexity:** Medium-High (Recursive calculations, Data visualization)

---

## Product Scope

### MVP - Minimum Viable Product

1.  **Ingredient Database:** Manage ingredients with prices/unit (Kg/L).
2.  **Recipe Engine:** Create recipes using ingredients AND other recipes (recursive).
3.  **Automatic Costing:** Real-time calculation based on ingredient quantities.
4.  **Overhead Management:** Manual input for Staff Cost (avg hourly) and Energy (avg/recipe).
5.  **PDF Invoice Upload:** Update ingredient prices by parsing supplier PDF invoices.
6.  **Price History:** Basic chart showing price changes for ingredients.
7.  **Multi-tenancy:** Secure isolation of restaurant data.

### Growth Features (Post-MVP)

1.  **Supplier Management:** Link ingredients to specific suppliers.
2.  **Menu Engineering:** Analysis of most profitable dishes (Stars vs Dogs).
3.  **Inventory/Stock:** Subtract ingredients from stock as dishes are sold.

---

## Technical Architecture

> **Proposed by:** Leonardo (Architect)

### System Architecture

**Architectural Pattern:** Modular Monolith (optimal for speed and consistency).
**Frontend:** SPA (Single Page Application).
**Backend:** REST API with focused modules.

### Technology Stack

**Frontend:**
-   **Framework:** Angular 21
-   **State Management:** Angular Signals / NGRX (if needed for complex flows)
-   **UI Library:** Angular Material or PrimeNG (Desktop focused)

**Backend:**
-   **Runtime:** Node.js
-   **Framework:** NestJS
-   **Language:** TypeScript (Strict)

**Database:**
-   **Primary:** PostgreSQL
-   **ORM:** Prisma or TypeORM (Must support recursive queries/Graph relations for recipes)

### Project Structure (Monorepo recommended)

```text
/apps
  /client (Angular 21)
  /api (NestJS)
/libs
  /shared-types (DTOs, Interfaces)
  /ui-components
```

### Deployment Strategy

-   **Containerization:** Docker for both Frontend (Nginx serve) and Backend.
-   **CI/CD:** GitHub Actions.
-   **Infrastructure:** Cloud-agnostic (AWS ECS, DigitalOcean App Platform, or Vercel/Railway).

---

## Functional Requirements

### FR1: User & Tenant Management
-   System must distinguish between tenants (Restaurants).
-   System must support roles: Admin (Write) vs Staff (Read).

### FR2: Ingredient Management
-   User can Create/Read/Update/Delete ingredients.
-   User must define base unit (Kg/L) and price per unit.
-   System must track price history for each ingredient.

### FR3: Recipe Management (Recursive)
-   User can create a "Recipe" composed of "Ingredients" OR other "Recipes" (Sub-recipes).
-   System must prevent infinite recursion (Recipe A -> Recipe B -> Recipe A).
-   System must allow scaling (e.g., "Make 10 portions" -> Scale all quantities).

### FR4: Cost Calculation Engine
-   System must calculate **Food Cost** = Sum(Ingredient Qty * Ingredient Price).
-   System must calculate **Total Cost** = Food Cost + (Staff Time * Avg Hourly Rate) + Energy Cost.
-   System must update Recipe Cost immediately if an Ingredient Price changes.

### FR5: PDF Invoice Parsing
-   User can upload a PDF invoice.
-   System must attempt to extract product names and new prices.
-   User must validate extracted data before applying updates to the Ingredient DB.

---

## Epic Breakdown

**Epic 1: Foundation & Auth**
-   Setup Nx Monorepo (Angular 21 + NestJS).
-   Implement Multi-tenancy logic (Tenant Guard).
-   Authentication (Login/Register/Invite).

**Epic 2: Core Data (Ingredients)**
-   Database schema for Ingredients and Price History.
-   CRUD Interfaces for Ingredients.
-   Unit conversion logic service.

**Epic 3: Recipe Engine**
-   Recursive database schema (Recipe -> RecipeItem -> Recipe/Ingredient).
-   Recipe Editor UI (Complex form with dynamic rows).
-   Calculation Service (The "Brain" of the app).

**Epic 4: Document Intelligence (PDF)**
-   File upload service (S3/Blob storage).
-   OCR/Parsing integration (e.g., PDF.js or external API).
-   "Review Updates" UI for confirming price changes.

**Epic 5: Dashboard & Analytics**
-   Visualizing Cost trends.
-   Reporting.

---

_Created through collaborative discovery between You and AI facilitator._
