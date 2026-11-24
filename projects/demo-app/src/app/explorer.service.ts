import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResponse, Character, Episode, Location } from './rick-morty.models';

/** Recursos que se pueden explorar. */
export type ResourceType = 'character' | 'episode' | 'location';

/** Valores del filtro de status (solo aplica a Characters). */
export type StatusFilter = 'alive' | 'dead' | 'unknown';

/** Cualquier registro que puede mostrar la tabla. */
export type ResourceRecord = Character | Episode | Location;

const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Servicio que concentra el estado del explorador con signals.
 * Los componentes solo leen estas señales y llaman a sus métodos.
 */
@Injectable({ providedIn: 'root' })
export class ExplorerService {
  private readonly http = inject(HttpClient);
  private currentRequest?: Subscription;

  /** Recurso activo. */
  readonly resource = signal<ResourceType>('character');

  /** Filtro de status activo (`null` si no hay filtro). */
  readonly status = signal<StatusFilter | null>(null);

  /** Registros del recurso activo. */
  readonly records = signal<ResourceRecord[]>([]);

  /** `true` mientras hay una petición en curso. */
  readonly loading = signal(false);

  /** Mensaje de error de red, o `null` si no hay error. */
  readonly error = signal<string | null>(null);

  /** El filtro de status solo existe para Characters en la API. */
  readonly statusFilterEnabled = computed(() => this.resource() === 'character');

  /** Cambia el recurso, reinicia el filtro y vuelve a pedir datos. */
  selectResource(resource: ResourceType): void {
    this.resource.set(resource);
    this.status.set(null);
    this.load();
  }

  /** Cambia el filtro de status y vuelve a pedir datos. */
  selectStatus(status: StatusFilter | null): void {
    this.status.set(status);
    this.load();
  }

  /** Quita un registro del estado local (la API no se modifica). */
  removeRecord(id: number): void {
    this.records.update((list) => list.filter((record) => record.id !== id));
  }

  /** Pide a la API los registros del recurso y filtro activos. */
  load(): void {
    this.currentRequest?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    const status = this.status();
    if (this.resource() === 'character' && status) {
      params = params.set('status', status);
    }

    this.currentRequest = this.http
      .get<ApiResponse<ResourceRecord>>(`${BASE_URL}/${this.resource()}`, { params })
      .subscribe({
        next: (response) => {
          this.records.set(response.results);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.records.set([]);
          // La API responde 404 cuando un filtro no tiene resultados: es "vacío", no un error de red.
          this.error.set(error.status === 404 ? null : 'No se pudo conectar con la API. Intenta de nuevo.');
          this.loading.set(false);
        },
      });
  }
}