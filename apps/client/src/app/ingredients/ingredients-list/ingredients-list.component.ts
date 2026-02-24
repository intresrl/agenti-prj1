import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Ingredient } from '@food-cost/shared/types';
import { IngredientsService } from '../ingredients.service';
import { AuthService } from '../../auth/auth.service';
import { IngredientFormComponent } from '../ingredient-form/ingredient-form.component';

@Component({
  selector: 'app-ingredients-list',
  imports: [IngredientFormComponent, UpperCasePipe],
  templateUrl: './ingredients-list.component.html',
  styleUrl: './ingredients-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsListComponent implements OnInit {
  private readonly ingredientsService = inject(IngredientsService);
  private readonly authService = inject(AuthService);

  readonly ingredients = this.ingredientsService.ingredients;
  readonly loading = this.ingredientsService.loading;

  /** null = hidden, undefined = create mode, Ingredient = edit mode */
  readonly formTarget = signal<Ingredient | null | undefined>(undefined);
  readonly showForm = signal(false);
  readonly isAdmin = this.authService.isAdmin;

  ngOnInit(): void {
    this.ingredientsService.loadAll().subscribe();
  }

  openCreate(): void {
    this.formTarget.set(null);
    this.showForm.set(true);
  }

  openEdit(ingredient: Ingredient): void {
    this.formTarget.set(ingredient);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.formTarget.set(undefined);
  }

  onSaved(): void {
    this.closeForm();
  }

  delete(ingredient: Ingredient): void {
    if (!confirm(`Delete "${ingredient.name}"?`)) return;
    this.ingredientsService.remove(ingredient.id).subscribe();
  }

  /** AC2: Format normalized price for display */
  formatPrice(ingredient: Ingredient): string {
    return `€${Number(ingredient.price).toFixed(2)} / ${ingredient.unit}`;
  }
}
