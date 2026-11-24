# UI Component Library

Librería de componentes Angular propia, tipada y reutilizable (`ui-lib`), junto con una aplicación demo (`demo-app`) que la consume para explorar los recursos de la [Rick and Morty API](https://rickandmortyapi.com/documentation).

## Stack

| Herramienta | Versión |
|---|---|
| Angular / Angular CLI | 22.3.0 |
| TypeScript (`strict: true`) | 6.0.3 |
| Tailwind CSS | 3.4.19 |
| Node.js / npm | 26.12.1 / 11.20.0 |
| Pruebas | Vitest (incluido en el CLI) |

Sin librerías de componentes externas (no se usa Angular Material, PrimeNG ni NgBootstrap). Todos los estilos son Tailwind CSS v3.

## Arquitectura

```text
ui-workspace/
├── projects/
│   ├── ui-lib/          ← Librería de componentes (prefijo ui-)
│   │   └── src/
│   │       ├── lib/     ← button, card, select, table
│   │       └── public-api.ts
│   └── demo-app/        ← App que consume la librería
│       └── src/app/     ← Pantalla Explorer, servicio e interfaces
├── angular.json
├── tailwind.config.js
└── package.json
```

### Principios

- **Componentes de presentación:** `ui-lib` no conoce el dominio ni hace llamadas HTTP.
- **Estado en un servicio:** `ExplorerService` guarda con signals el recurso activo, el filtro, los registros, el estado de carga y el error. Los componentes solo leen señales y llaman métodos del servicio.
- **API pública única:** la demo importa únicamente desde `'ui-lib'`, que apunta a `projects/ui-lib/src/public-api.ts` mediante un alias en `tsconfig.json`. No hay importaciones internas.
- **Convenciones:** todos los componentes son standalone con `ChangeDetectionStrategy.OnPush` y usan `input()`, `output()` y `model()`. No se usan los decoradores `@Input()` ni `@Output()`.
- **Tipado estricto:** `strict` y `strictTemplates` activados, sin ningún `any`.

### Flujo de datos

```text
ui-select (recurso / filtro) → ExplorerService → Rick and Morty API
                                      │
                    signals: recurso, filtro, registros, loading, error
                                      │
                               ui-table → actionTriggered → App
                                      │                      │
                                      └──────────────  modal con ui-card
```


## Instalación y ejecución

Requisitos: Node.js y npm instalados.

```bash
git clone <URL-DEL-REPOSITORIO>
cd ui-workspace
npm install
ng serve demo-app
```

Abre `http://localhost:4200`. No hace falta compilar la librería antes, porque el alias `ui-lib` apunta al código fuente.

### Otros comandos

```bash
ng build ui-lib      # compila la librería
ng build demo-app    # compila la demo
```

## API de los componentes

Todos los selectores usan el prefijo `ui-`. Los componentes son standalone, se importan desde `'ui-lib'`.

### `ui-button`

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| `input()` | `label` | `string` | Texto visible del botón |
| `input()` | `variant` | `'primary' \| 'secondary' \| 'danger'` | Estilo visual |
| `input()` | `size` | `'sm' \| 'md' \| 'lg'` | Tamaño |
| `input()` | `disabled` | `boolean` | Bloquea la interacción |
| `input()` | `loading` | `boolean` | Muestra un spinner y bloquea el clic |
| `output()` | `clicked` | `void` | Se emite solo si no está `disabled` ni `loading` |

```html
<ui-button
  label="Guardar"
  variant="primary"
  size="md"
  [loading]="saving()"
  (clicked)="save()" />
```

### `ui-card`

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| `input()` | `title` | `string` | Título del header |
| `input()` | `subtitle` | `string \| null` | Subtítulo opcional |
| `input()` | `elevation` | `'flat' \| 'raised' \| 'outlined'` | Estilo del contenedor |
| `output()` | `headerClicked` | `void` | Se emite al hacer clic en el header (también con Enter o Espacio) |
| `ng-content` | — | — | Contenido proyectado en el cuerpo |

```html
<ui-card title="Rick Sanchez" subtitle="Alive" elevation="raised" (headerClicked)="onHeader()">
  <p>Contenido arbitrario del cuerpo.</p>
</ui-card>
```

### `ui-select`

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| `input()` | `options` | `SelectOption[]` | Opciones `{ label, value }` |
| `input()` | `label` | `string` | Etiqueta sobre el select |
| `input()` | `placeholder` | `string` | Texto cuando no hay selección |
| `input()` | `loading` | `boolean` | Estado de carga |
| `input()` | `disabled` | `boolean` | Bloquea la interacción |
| `model()` | `value` | `string \| null` | Valor seleccionado con binding bidireccional |
| `output()` | `selectionChange` | `SelectOption` | Emite el objeto completo al cambiar |

```html
<ui-select
  label="Recurso"
  placeholder="Elige un recurso"
  [options]="resourceOptions"
  [(value)]="resource"
  (selectionChange)="onResourceChange($event)" />
```

### `ui-table`

Componente genérico (`T extends object`). No conoce el dominio: solo pinta columnas y filas, y emite acciones. El componente padre interpreta cada acción.

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| `input()` | `columns` | `TableColumn[]` | Columnas `{ key, header }` |
| `input()` | `rows` | `T[]` | Datos a renderizar |
| `input()` | `loading` | `boolean` | Muestra filas skeleton en lugar de datos |
| `input()` | `emptyMessage` | `string` | Mensaje cuando `rows` está vacío |
| `input()` | `errorMessage` | `string \| null` | Mensaje de error de red |
| `output()` | `actionTriggered` | `TableAction` | Emite `{ action: 'view' \| 'delete', row }` |

Prioridad de estados: `loading`, luego `error`, luego vacío y por último datos.

```html
<ui-table
  [columns]="columns"
  [rows]="rows()"
  [loading]="loading()"
  [errorMessage]="error()"
  emptyMessage="No hay resultados para este filtro"
  (actionTriggered)="onAction($event)" />
```

### Modelos

```ts
interface SelectOption { label: string; value: string; }
interface TableColumn  { key: string; header: string; }
interface TableAction<T> { action: 'view' | 'delete'; row: T; }
```


## Demo: Explorer de recursos

La pantalla integra los cuatro componentes con la Rick and Morty API.

- Al abrir, el recurso **Characters** viene preseleccionado y la tabla muestra los primeros resultados.
- Al cambiar de recurso (Characters, Episodes, Locations), el filtro se reinicia y se hace una nueva petición.
- El filtro de **status** (Alive, Dead, Unknown) lanza una nueva petición con el parámetro aplicado.
- Mientras hay una petición, la tabla muestra filas skeleton. Si falla, muestra un mensaje de error. Si no hay resultados, muestra un estado vacío.
- **Ver detalle** abre un modal con `ui-card` y todos los campos del registro, con botón de cerrar, Esc y clic fuera.
- **Eliminar** pide confirmación y quita el registro solo del estado local.

### Estado en `ExplorerService`

| Señal | Contenido |
|---|---|
| recurso activo | `characters`, `episodes` o `locations` |
| filtro | status seleccionado o `null` |
| registros | lista del recurso activo |
| loading | indica si hay una petición en curso |
| error | mensaje de error de red o `null` |

### Interfaces

`Character`, `Episode` y `Location` están definidas en la demo con tipado estricto, sin `any`.


## Decisiones de diseño

| Decisión | Motivo |
|---|---|
| Alias `ui-lib` al código fuente y no a `dist` | La demo funciona tras `npm install` sin compilar la librería. |
| Mapas `Record<Variant, string>` con clases completas de Tailwind | Tailwind solo genera clases escritas literalmente. |
| `ui-button` valida `isBlocked()` dentro de `onClick` | Garantiza por código que `clicked` no se emite en `disabled` ni `loading`. |
| `ui-card` con `ng-content` y header accesible por teclado | Sirve para los tres recursos sin conocer su contenido. |
| `ui-select` con `<select>` nativo | Hereda accesibilidad y comportamiento móvil. |
| `ui-table` genérica con `track $index` | No puede asumir que existe un `id`. |
| Cancelar la petición anterior antes de lanzar otra | Evita que una respuesta lenta pise datos más recientes. |
| El 404 de la API se trata como "sin resultados" | La API lo devuelve cuando un filtro no coincide; es un estado vacío, no un error. |
| Filtro de status solo en Characters | La API solo permite `status` en ese recurso. En Episodes y Locations el select se deshabilita y se explica con un mensaje. |
| Eliminar pide confirmación y borra solo del estado local | El enunciado hace opcional la eliminación real. |
| Tema `portal`, `lab`, `morty` en `tailwind.config.js` | Paleta coherente con la serie en toda la app. |


## Alcance

No se implementaron los puntos deseables (pruebas unitarias, Storybook, publicación del paquete y despliegue), para priorizar lo obligatorio con el plazo disponible. Los detalles están en `DEVELOPMENT_LOG.md`.

## Documentación relacionada

- [`DEVELOPMENT_LOG.md`](./DEVELOPMENT_LOG.md): decisiones, retos y uso de herramientas de IA.