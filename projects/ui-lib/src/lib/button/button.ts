import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/** Estilos visuales disponibles para el botón. */
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

/** Tamaños disponibles para el botón. */
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-lab-900 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-portal-500 text-lab-900 enabled:hover:bg-portal-400 focus-visible:ring-portal-400',
  secondary:
    'border border-portal-500 bg-transparent text-portal-400 enabled:hover:bg-lab-700 focus-visible:ring-portal-400',
  danger: 'bg-red-600 text-white enabled:hover:bg-red-500 focus-visible:ring-red-400',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Botón reutilizable de la librería.
 *
 * @example
 * <ui-button label="Guardar" variant="primary" (clicked)="guardar()" />
 */
@Component({
  selector: 'ui-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
  templateUrl: './button.html',
})
export class Button {
  /** Texto visible del botón. */
  readonly label = input<string>('');

  /** Estilo visual del botón. */
  readonly variant = input<ButtonVariant>('primary');

  /** Tamaño del botón. */
  readonly size = input<ButtonSize>('md');

  /** Bloquea la interacción cuando es `true`. */
  readonly disabled = input<boolean>(false);

  /** Muestra un spinner y bloquea el click cuando es `true`. */
  readonly loading = input<boolean>(false);

  /** Se emite al hacer click, solo si el botón no está `disabled` ni `loading`. */
  readonly clicked = output<void>();

  /** `true` cuando el botón no debe aceptar interacción. */
  protected readonly isBlocked = computed(() => this.disabled() || this.loading());

  /** Clases de Tailwind resultantes según variante y tamaño. */
  protected readonly classes = computed(
    () => `${BASE_CLASSES} ${VARIANT_CLASSES[this.variant()]} ${SIZE_CLASSES[this.size()]}`,
  );

  /** Maneja el click nativo y emite `clicked` solo si el botón está habilitado. */
  protected onClick(): void {
    if (this.isBlocked()) {
      return;
    }
    this.clicked.emit();
  }
}