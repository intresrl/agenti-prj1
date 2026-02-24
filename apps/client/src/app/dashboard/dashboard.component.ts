import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div style="padding: 2rem; font-family: sans-serif;">
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{{ authService.currentUser()?.name }}</strong>!</p>
      <p>Restaurant ID: {{ authService.currentUser()?.tenantId }}</p>
      <p>Role: {{ authService.currentUser()?.role }}</p>
      <button (click)="authService.logout()">Logout</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly authService = inject(AuthService);
}
