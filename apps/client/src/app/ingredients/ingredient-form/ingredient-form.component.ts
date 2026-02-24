import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { Ingredient, Unit } from '@food-cost/shared/types';
import { IngredientsService, IngredientPayload } from '../ingredients.service';

function positiveDecimalValidator(min = 0.0001): ValidatorFn {
  return (control) => {
    const raw = ((control.value as string) ?? '').replace(',', '.');
    const val = Number.parseFloat(raw);
    if (Number.isNaN(val) || val < min) {
      return { invalidDecimal: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-ingredient-form',
  imports: [ReactiveFormsModule, UpperCasePipe],
  templateUrl: './ingredient-form.component.html',
  styleUrl: './ingredient-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientFormComponent implements OnInit {
  /** Pass an ingredient to switch to edit mode */
  ingredient = input<Ingredient | null>(null);

  saved = output<void>();
  cancelled = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly ingredientsService = inject(IngredientsService);

  readonly units = Object.values(Unit);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: [''],
    price: ['', [Validators.required, positiveDecimalValidator()]],
    unit: [Unit.KG as Unit, Validators.required],
    unitSize: [''],
  });

  /** Show unitSize field only when unit is kg or l */
  readonly showUnitSize = computed(() => {
    const unit = this.form.controls.unit.value;
    return unit === Unit.KG || unit === Unit.L;
  });

  readonly isEditMode = computed(() => this.ingredient() !== null);

  ngOnInit(): void {
    const ing = this.ingredient();
    if (ing) {
      // The stored price is already normalized (price per base unit).
      // If a unitSize was set, back-calculate the original package price
      // so the user can edit the same value they originally entered.
      const displayPrice =
        ing.unitSize && ing.unit !== 'pz'
          ? Number((ing.price * ing.unitSize).toFixed(4))
          : ing.price;

      this.form.patchValue({
        name: ing.name,
        category: ing.category ?? '',
        price: displayPrice.toString(),
        unit: ing.unit,
        unitSize: ing.unitSize?.toString() ?? '',
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();
    const parseDecimal = (v: string) => Number.parseFloat((v ?? '').replace(',', '.'));
    const payload: IngredientPayload = {
      name: raw.name,
      category: raw.category || undefined,
      price: parseDecimal(raw.price),
      unit: raw.unit,
      unitSize: this.showUnitSize() && raw.unitSize ? parseDecimal(raw.unitSize) : undefined,
    };

    const id = this.ingredient()?.id;
    const request$ = id
      ? this.ingredientsService.update(id, payload)
      : this.ingredientsService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.emit();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'An error occurred. Please try again.');
      },
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
