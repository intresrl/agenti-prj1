/**
 * Shared types for the Food Cost SaaS platform
 * These types are used across both frontend (Angular) and backend (NestJS)
 */

// ============================================
// TENANT & USER TYPES
// ============================================

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

export interface Tenant {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INGREDIENT TYPES
// ============================================

export enum Unit {
  KG = 'kg',
  L = 'l',
  PZ = 'pz',
}

export interface Ingredient {
  id: string;
  tenantId: string;
  name: string;
  category?: string;
  price: number; // Price per base unit
  unit: Unit;
  unitSize?: number; // e.g., 0.75 for a 0.75L bottle
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceHistory {
  id: string;
  ingredientId: string;
  price: number;
  changedAt: Date;
  changedBy: string;
}

// ============================================
// RECIPE TYPES
// ============================================

export interface RecipeItem {
  id: string;
  type: 'ingredient' | 'sub-recipe';
  itemId: string; // ID of ingredient or recipe
  quantity: number; // in grams or ml
}

export interface Recipe {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  items: RecipeItem[];
  preparationTime?: number; // in minutes
  energyCost?: number; // fixed energy cost in currency
  yield?: {
    totalWeight: number; // total recipe weight in grams
    portionWeight: number; // single portion weight in grams
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// AUTH DTO TYPES (shared between frontend and backend)
// ============================================

export interface RegisterDto {
  restaurantName: string;
  adminName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface InviteDto {
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
  tenant: Tenant;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
