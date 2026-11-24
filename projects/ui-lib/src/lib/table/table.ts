import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '../button/button';

/** Definición de una columna de la tabla. */
export interface TableColumn {
  /** Propiedad del objeto fila que se muestra en esta columna. */
  key: string;
  /** Texto del encabezado de la columna. */
  header: string;
}

/** Acciones que la tabla puede emitir. */
export type TableActionType = 'view' | 'delete';

/** Evento emitido por la tabla al pulsar una acción. */
export interface TableAction<T> {
  /** Acción solicitada. */
  action: TableActionType;
  /** Fila sobre la que se pulsó. */
  row: T;
}

/**
 * Tabla genérica: renderiza columnas y filas, y emite acciones.
 * No conoce el dominio de los datos.
 *
 * @example
 * <ui-table [columns]="columnas" [rows]="filas" (actionTriggered)="onAction($event)" />
 */
@Component({
  selector: 'ui-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  host: { class: 'block' },
  templateUrl: './table.html',
})
export class Table<T extends object> {
  /** Definición de columnas `{ key, header }`. */
  readonly columns = input<TableColumn[]>([]);

  /** Datos a renderizar. */
  readonly rows = input<T[]>([]);

  /** Muestra filas esqueleto en lugar de los datos. */
  readonly loading = input<boolean>(false);

  /** Mensaje mostrado cuando no hay filas. */
  readonly emptyMessage = input<string>('No hay resultados');

  /** Mensaje de error de red mostrado en la tabla. */
  readonly errorMessage = input<string | null>(null);

  /** Se emite `{ action, row }` al pulsar Ver o Eliminar. */
  readonly actionTriggered = output<TableAction<T>>();

  /** Índices usados para pintar las filas esqueleto. */
  protected readonly skeletonRows = Array.from({ length: 6 }, (_, index) => index);

  /** Devuelve el valor de una celda como texto. */
  protected cellValue(row: T, key: string): string {
    const value: unknown = row[key as keyof T];
    if (value === null || value === undefined) {
      return '—';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  /** Emite la acción solicitada junto con su fila. */
  protected trigger(action: TableActionType, row: T): void {
    this.actionTriggered.emit({ action, row });
  }
}
