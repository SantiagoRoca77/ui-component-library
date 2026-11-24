import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

/**Opción mostrada y devuelta por `ui-select`*/

export interface SelectOption {
  /** Texto visible de la opción. */
  label: string;
  /**Valor de la opción */
  value: string;
}

let nextId = 0;

/**Select reutilizable con etiqueta, placeholder y estado de carga.
 * *
 * @example
 * <ui-select label="Recurso" [options]="opciones" [(value)]="recurso" />
 */

@Component({
  selector: 'ui-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './select.html',
})
export class Select {
  /** Lista de Opciones `{ label, value }` */

  readonly options = input<SelectOption[]>([]);

  /**Etiqueta visible sobre eñ select */
  readonly label = input<string>('');

  /**Texto mostrado cuando no hay selección */
  readonly placeholder = input<string>('Selecciona una opción');

  /**Bloquea la interacción cuando es `true` */
  readonly disabled = input<boolean>(false);

  /** Muestra un esqueleto en lugar del select mientras carga*/
  readonly loading = input<boolean>(false);

  /**Valor seleccionado, con binding bidireccional (`[(value)]`)*/
  readonly value = model<string | null>(null);

  /**Se emite con el objeto completo de la opción al cambiar la selección*/
  readonly selectionChange = output<SelectOption>();

  /** Identificador único para enlazar la etiqueta con el select */
  protected readonly selectId = `ui-select-${nextId++}`;

  /** `true` cuando el select no debe aceptar interacción*/
  protected readonly isBlocked = computed(() => this.disabled() || this.loading());

  /** Actualiza el valor y emite la opción completa elegida. */
  protected onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const option = this.options().find((item) => item.value === target.value);
    if (!option) {
      return;
    }
    this.value.set(option.value);
    this.selectionChange.emit(option);
  }
}
