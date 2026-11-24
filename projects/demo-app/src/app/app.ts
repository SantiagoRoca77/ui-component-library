import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Button, Card, Select, SelectOption, Table, TableAction, TableColumn } from 'ui-lib';
import { ExplorerService, ResourceRecord, ResourceType, StatusFilter } from './explorer.service';

const RESOURCES: readonly ResourceType[] = ['character', 'episode', 'location'];
const STATUSES: readonly StatusFilter[] = ['alive', 'dead', 'unknown'];

const COLUMNS: Record<ResourceType, TableColumn[]> = {
  character: [
    { key: 'name', header: 'Nombre' },
    { key: 'status', header: 'Status' },
    { key: 'species', header: 'Especie' },
    { key: 'gender', header: 'Género' },
  ],
  episode: [
    { key: 'name', header: 'Nombre' },
    { key: 'episode', header: 'Código' },
    { key: 'air_date', header: 'Fecha de emisión' },
  ],
  location: [
    { key: 'name', header: 'Nombre' },
    { key: 'type', header: 'Tipo' },
    { key: 'dimension', header: 'Dimensión' },
  ],
};

const RESOURCE_LABELS: Record<ResourceType, string> = {
  character: 'Personaje',
  episode: 'Episodio',
  location: 'Ubicación',
};

/** Indica si un texto es un recurso válido. */
function isResourceType(value: string): value is ResourceType {
  return (RESOURCES as readonly string[]).includes(value);
}

/** Indica si un texto es un filtro de status válido. */
function isStatusFilter(value: string): value is StatusFilter {
  return (STATUSES as readonly string[]).includes(value);
}

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, Select, Table],
  host: { '(document:keydown.escape)': 'closeModals()' },
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly explorer = inject(ExplorerService);

  protected readonly resourceOptions: SelectOption[] = [
    { label: 'Characters', value: 'character' },
    { label: 'Episodes', value: 'episode' },
    { label: 'Locations', value: 'location' },
  ];

  protected readonly statusOptions: SelectOption[] = [
    { label: 'Alive', value: 'alive' },
    { label: 'Dead', value: 'dead' },
    { label: 'Unknown', value: 'unknown' },
  ];

  /** Registro cuyo detalle se muestra en el modal. */
  protected readonly selected = signal<ResourceRecord | null>(null);

  /** Registro pendiente de confirmar su eliminación. */
  protected readonly pendingDelete = signal<ResourceRecord | null>(null);

  /** Columnas según el recurso activo. */
  protected readonly columns = computed(() => COLUMNS[this.explorer.resource()]);

  /** Etiqueta del tipo de recurso activo. */
  protected readonly resourceLabel = computed(() => RESOURCE_LABELS[this.explorer.resource()]);

  /** Mensaje del estado vacío según haya filtro o no. */
  protected readonly emptyMessage = computed(() =>
    this.explorer.status()
      ? 'No hay personajes con ese status. Prueba con otro filtro.'
      : 'No se encontraron resultados en este universo.',
  );

  /** El registro seleccionado como personaje, o `null` si es de otro tipo. */
  protected readonly selectedCharacter = computed(() => {
    const record = this.selected();
    return record !== null && 'species' in record ? record : null;
  });

  /** El registro seleccionado como episodio, o `null` si es de otro tipo. */
  protected readonly selectedEpisode = computed(() => {
    const record = this.selected();
    return record !== null && 'air_date' in record ? record : null;
  });

  /** El registro seleccionado como ubicación, o `null` si es de otro tipo. */
  protected readonly selectedLocation = computed(() => {
    const record = this.selected();
    return record !== null && 'dimension' in record ? record : null;
  });

  constructor() {
    this.explorer.load();
  }

  /** Cambia el recurso activo (esto también reinicia el filtro). */
  protected onResourceChange(option: SelectOption): void {
    if (isResourceType(option.value)) {
      this.explorer.selectResource(option.value);
    }
  }

  /** Aplica el filtro de status elegido. */
  protected onStatusChange(option: SelectOption): void {
    if (isStatusFilter(option.value)) {
      this.explorer.selectStatus(option.value);
    }
  }

  /** Interpreta la acción emitida por la tabla: la tabla no sabe qué significa. */
  protected onTableAction(event: TableAction<ResourceRecord>): void {
    if (event.action === 'view') {
      this.selected.set(event.row);
    } else {
      this.pendingDelete.set(event.row);
    }
  }

  /** Confirma la eliminación y quita el registro de la lista local. */
  protected confirmDelete(): void {
    const record = this.pendingDelete();
    if (record) {
      this.explorer.removeRecord(record.id);
    }
    this.pendingDelete.set(null);
  }

  /** Cierra cualquier modal abierto. */
  closeModals(): void {
    this.selected.set(null);
    this.pendingDelete.set(null);
  }
}
