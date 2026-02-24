import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <div style="padding: 2rem; font-family: sans-serif;">
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{{ authService.currentUser()?.name }}</strong>!</p>
      <p>Restaurant ID: {{ authService.currentUser()?.tenantId }}</p>
      <p>Role: {{ authService.currentUser()?.role }}</p>
      <nav style="margin: 1.5rem 0; display: flex; gap: 1rem;">
        <a routerLink="/ingredients" style="color: #6366f1; text-decoration: none; font-weight: 600;">🧂 Ingredients</a>
      </nav>
      <button (click)="authService.logout()">Logout</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly authService = inject(AuthService);
}
