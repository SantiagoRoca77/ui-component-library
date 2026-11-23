import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";
/** Estos vienen siendo los estilos disponibles para el contenedor de la card */
export type CardElevation = "flat" | 'raised' | 'outlined';

const ELEVATION_CLASSES: Record<CardElevation, string> = {
  flat: 'bg-lab-800',
  raised: 'bg-lab-800 shadow-lg shadow-black/40',
  outlined: 'border border-portal-500/60 bg-transparent',
};

/**
 * Tarjeta reutilizable con header y cuerpo proyectado.
 *
 * @example
 * <ui-card title="Rick Sanchez" subtitle="Alive" elevation="raised">
 *   <p>Contenido arbitrario</p>
 * </ui-card>
 */

@Component ({
  selector: 'ui-card',
  standalone: true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  host: {class: 'block', '[attr.title]': 'null'},
  templateUrl: './card.html'
})

export class Card {
  /** Titulo del header de la card */
  readonly title= input<string>('');

  /** Subtitulo opcional de bajo del titulo */
  readonly subtitle= input<string | null>(null);

  /**Estilo visual del contenedor */
  readonly elevation= input<CardElevation>('raised');

  /**emitor al hacer clic en el header */
  readonly headerClicked= output<void>();

  /**Clase de tailwind del contenedor segun la elevación */
  protected readonly containerClasses = computed(
    ()=> `overflow-hidden rounded-xl ${ELEVATION_CLASSES[this.elevation()]}`,
  );

  /** Emite headerClicked */
  protected onHeaderClick():void {
    this.headerClicked.emit();
  }
}