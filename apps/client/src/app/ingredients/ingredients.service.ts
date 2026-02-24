import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Ingredient } from '@food-cost/shared/types';

export interface IngredientPayload {
  name: string;
  category?: string;
  price: number;
  unit: string;
  unitSize?: number;
}

@Injectable({ providedIn: 'root' })
export class IngredientsService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/ingredients';

  readonly ingredients = signal<Ingredient[]>([]);
  readonly loading = signal(false);

  loadAll(): Observable<Ingredient[]> {
    this.loading.set(true);
    return this.http.get<Ingredient[]>(this.apiBase).pipe(
      tap((list) => {
        this.ingredients.set(list);
        this.loading.set(false);
      })
    );
  }

  create(payload: IngredientPayload): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.apiBase, payload).pipe(
      tap((created) =>
        this.ingredients.update((list) => [...list, created])
      )
    );
  }

  /** AC3: Updating price triggers PriceHistory persistence on the backend */
  update(id: string, payload: Partial<IngredientPayload>): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.apiBase}/${id}`, payload).pipe(
      tap((updated) =>
        this.ingredients.update((list) =>
          list.map((i) => (i.id === id ? updated : i))
        )
      )
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/${id}`).pipe(
      tap(() =>
        this.ingredients.update((list) => list.filter((i) => i.id !== id))
      )
    );
  }
}
