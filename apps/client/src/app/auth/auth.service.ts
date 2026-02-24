import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  RegisterDto,
  LoginDto,
  AuthResponse,
  User,
  UserRole,
} from '@food-cost/shared/types';

const TOKEN_KEY = 'fc_access_token';
const USER_KEY = 'fc_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // ── Signals ──────────────────────────────────────────────────────────────
  readonly currentUser = signal<User | null>(this.loadUser());
  readonly accessToken = signal<string | null>(this.loadToken());

  /** AC3: Staff users must have read-only access — expose role helpers */
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === UserRole.ADMIN);
  readonly isStaff = computed(() => this.currentUser()?.role === UserRole.STAFF);

  private readonly apiBase = '/api/auth';

  // ── Public Methods ────────────────────────────────────────────────────────

  /** AC1: Register creates a new Tenant + Admin user */
  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiBase}/register`, dto)
      .pipe(tap((res) => this.persist(res)));
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiBase}/login`, dto)
      .pipe(tap((res) => this.persist(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.accessToken.set(null);
    this.router.navigate(['/auth/login']);
  }

  // ── Private Helpers ───────────────────────────────────────────────────────

  private persist(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.accessToken.set(res.accessToken);
    this.currentUser.set(res.user);
  }

  private loadToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
