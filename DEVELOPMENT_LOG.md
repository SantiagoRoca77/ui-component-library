# Bitácora de desarrollo

**Proyecto:** UI Component Library (Angular + TypeScript + Tailwind CSS v3)

**Período:** 20 al 24 de noviembre de 2026

**Repositorio:** https://github.com/SantiagoRoca77/ui-component-library

## 1. Stack y versiones

| Herramienta           | Versión                                        |
|-----------------------|------------------------------------------------|
| Angular / Angular CLI | 22.3.0                                         |
| TypeScript            | 6.0.3 (strict: true)                           |
| Node.js / npm         | 26.12.1 / 11.20.0                              |
| Tailwind CSS          | 3.4.19 (la v4 está prohibida por el enunciado) |
| Pruebas               | Vitest (viene con el CLI)                      |
| API                   | Rick and Morty API                             |

## 2. Decisiones de diseño

| Decisión                                                                                | Motivo                                                                                                                                                                                                            |
|-----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Workspace con ui-lib y demo-app, prefijo ui                                             | La demo consume la librería como lo haría una app externa.                                                                                                                                                        |
| Alias ui-lib en tsconfig.json apuntando a projects/ui-lib/src/public-api.ts y no a dist | dist no se sube a GitHub; con el alias al código fuente, ng serve demo-app funciona tras npm install sin compilar la librería antes. La demo solo importa desde 'ui-lib'.                                         |
| Activar strict y strictTemplates manualmente                                            | El tsconfig.json generado no los traía y el enunciado exige tipado estricto y cero any.                                                                                                                           |
| Todos los componentes standalone + OnPush, con input(), output() y model()              | Es lo que exige el enunciado. standalone: true se escribió de forma explícita aunque sea el valor por defecto, para que se vea la convención.                                                                     |
| Mapas Record\<Variant, string\> con clases completas de Tailwind                        | Tailwind solo genera las clases que encuentra escritas literalmente; no se pueden armar por pedazos.                                                                                                              |
| ui-button valida isBlocked() dentro de onClick además del atributo disabled             | Garantiza por código que clicked no se emite en disabled ni loading.                                                                                                                                              |
| ui-card con ng-content y header accesible por teclado                                   | La card no conoce su contenido, por eso sirve para los tres recursos. Se anuló el atributo nativo title del host ('\[attr.title\]': 'null') para evitar el tooltip del navegador, ya que el input se llama igual. |
| ui-select con \<select\> nativo por dentro                                              | Hereda accesibilidad y comportamiento móvil. model() permite al padre reiniciar el valor y selectionChange emite el objeto completo.                                                                              |
| ui-table genérica (Table\<T extends object\>)                                           | No conoce el dominio: solo pinta columnas y filas, y emite { action, row }. El padre interpreta la acción.                                                                                                        |
| Estados de la tabla con prioridad loading, error, vacío y datos                         | Mientras carga no se muestra un error viejo ni un vacío falso.                                                                                                                                                    |
| Lectura de celdas sin any (row\[key as keyof T\] como unknown)                          | Cumple el tipado estricto en una tabla genérica.                                                                                                                                                                  |
| track \$index en las filas de la tabla                                                  | Al ser genérica no puede asumir que existe un id.                                                                                                                                                                 |
| Estado en ExplorerService con signals                                                   | Los componentes no hacen HTTP ni guardan estado de negocio.                                                                                                                                                       |
| Cancelar la petición anterior (unsubscribe) antes de lanzar otra                        | Evita que una respuesta lenta pise los datos de una petición más reciente.                                                                                                                                        |
| El 404 de la API se trata como "sin resultados"                                         | La API responde 404 cuando un filtro no tiene coincidencias; es un estado vacío, no un error de red.                                                                                                              |
| El filtro de status solo está activo para Characters                                    | La API solo permite status en ese recurso. En Episodes y Locations el select se deshabilita y se muestra un mensaje explicándolo.                                                                                 |
| El filtro se reinicia al cambiar de recurso                                             | Lo exige el enunciado; se hace en selectResource.                                                                                                                                                                 |
| Eliminar pide confirmación y quita el registro solo del estado local                    | El enunciado pide confirmación y hace opcional la eliminación real.                                                                                                                                               |
| Modal propio con ui-card, que se cierra con botón, Esc o clic fuera                     | Cumple el requisito del detalle usando la librería.                                                                                                                                                               |
| Commits separados (formato de la librería; formato del servicio, modelos y config; pantalla Explorer) | Prettier mezcló formato con trabajo sin commitear; separar mantiene los commits atómicos y con un mensaje que describe su contenido. |
| Colores del tema (portal, lab, morty) definidos en tailwind.config.js                   | Paleta coherente con la serie en toda la app.                                                                                                                                                                     |

## 3. Alcance: lo que no se hizo y por qué

El enunciado marca como deseables: pruebas unitarias, Storybook, publicación del paquete y despliegue. Con un plazo de pocos días se priorizó cumplir completo lo obligatorio.

- **Storybook:** no implementado. Su configuración con Angular, signals y Tailwind es costosa en tiempo.

- **Publicación en npm o GitHub Packages:** no implementada.

- **Despliegue de la demo:** no implementado.

- **Pruebas unitarias:** no implementadas. Quedan los archivos .spec.ts generados por el CLI. El primer candidato sería ui-button (que clicked no se emita en loading).

## 4. Uso de herramientas de IA

Se usó **Claude (Anthropic)** como asistente durante todo el desarrollo, con la consigna de entender cada paso. Cada respuesta incluía el porqué de las decisiones, y el código se transcribió y se probó a mano.

| \#  | Prompt (resumido)                                                                          | Qué se aceptó y por qué                                                                                  | Qué se rechazó o modificó y por qué                                                                                    |
|-----|--------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| 1   | "Lee todo el correo y el PDF del reto y detalla las herramientas y requisitos."            | El resumen de requisitos y el análisis de ambigüedades. Sirvió de checklist para toda la prueba.         | Se descartó tratar el reto como la vacante de Solutions (Postman/SQL)                                                  |
| 2   | "Hazme un cronograma que cubra los 6 puntos del documento, con documentación paso a paso." | La estructura de trabajo por pasos: código, verificación y commit.                                       | Se recortó el cronograma original porque el plazo real era más corto; los deseables quedaron fuera de alcance.         |
| 3   | "Comprobar lo instalado y crear el workspace con librería y demo."                         | Los comandos ng new (sin app inicial), ng generate library --prefix=ui y ng generate application.        | Al preguntar el CLI por integración con herramientas de IA se eligió **None**, para no meter archivos ajenos al repo.  |
| 4   | "Instala y configura Tailwind."                                                            | Fijar tailwindcss@3, postcss y autoprefixer, y el content apuntando a projects/.                         | La configuración inicial quedó con content: \[\] y hubo que corregirla (ver Retos).                                    |
| 5   | "Activa el modo estricto y haz que la demo funcione tras clonar el repo."                  | strict y strictTemplates, y el alias ui-lib hacia el código fuente.                                      | Se rechazó dejar el alias hacia dist, que rompería la ejecución tras clonar.                                           |
| 6   | "Crea el componente ui-button con variantes, tamaños y loading."                           | input()/output(), mapas Record de clases, spinner SVG y la guarda isBlocked() en el click.               | Se usó enabled:hover: para que un botón deshabilitado no cambie de color al pasar el mouse.                            |
| 7   | "Crea ui-card con ng-content."                                                             | Proyección de contenido y header accesible (tabindex, role, Enter/Espacio).                              | Se añadió '\[attr.title\]': 'null' en el host para quitar el tooltip nativo.                                           |
| 8   | "Crea ui-select con model()."                                                              | \<select\> nativo, model() y selectionChange con el objeto completo.                                     | Se usó \[selected\] por opción y no \[value\] en el select, para que el reinicio a null muestre el placeholder.        |
| 9   | "Crea la tabla genérica con skeleton, vacío y error."                                      | Table\<T extends object\>, estados con prioridad y lectura de celdas sin any.                            | Se evitó asumir un campo id, de ahí track \$index.                                                                     |
| 10  | "Crea las interfaces y el servicio con signals para la Rick and Morty API."                | Interfaces Character, Episode, Location; servicio con señales, cancelación de petición y 404 como vacío. | Se retiró withFetch() de provideHttpClient: en Angular 22 aparece como obsoleto y HttpClient ya usa fetch por defecto. |
| 11 | "Con toda la información, empecemos con el README. No me hagas un archivo: dame paso a paso lo que debo hacer y yo lo transcribo." | La estructura en siete partes: stack, arquitectura, instalación, API por componente, pantalla Explorer, decisiones de diseño y alcance. | La IA lo escribió sin ver mi código. No requirió cambios y lo validé con una instalación limpia del repo y la ejecución de la demo. |
| 12 | "¿Es normal que las últimas casillas de la tabla de ui-card salgan con una línea?" | La explicación: el guion largo es el marcador de "no aplica" de ng-content, que no tiene nombre ni tipo TypeScript. | Lo dejé como estaba. |
| 13 | Pegué el resultado de la búsqueda de `any` y pedí revisarlo. | La idea de buscar con `findstr` en `projects\*.ts`, y la observación de que app.ts usaba `SelectOptions` y el PDF pide `SelectOption`. | El primer comando estaba mal: `findstr` separó los espacios como búsquedas distintas y devolvió líneas irrelevantes. Lo corregí a `findstr /s /n /r "\<any\>" projects\*.ts` y no devolvió ningún `any`. Renombré la interfaz con F2 en VS Code. |
| 14 | Pedí revisar el formato del código y los commits. | Ejecutar Prettier sobre los archivos de `projects`. | El `git diff` mostró cambios que no eran solo formato. En lugar de un solo commit "style", los separé en tres: formato de la librería, formato del servicio, modelos y config, y la pantalla Explorer. |
| 15 | Pegué `git status` y `git log --oneline` y pedí revisar el historial. | Reescribir el mensaje del commit `20fe810`, que incluía la pantalla Explorer y el tema, y subirlo con `git push --force-with-lease`. | Hice el `amend` y el push forzado, que es seguro porque el repo es solo mío. |
| 16 | Pedí revisar el JSDoc de los componentes. | Solo la indicación de qué revisar: cada input, output, model y método público debe llevar comentario. | Los comentarios los escribí y revisé yo mismo en los cuatro componentes. |
| 17 | Pedí los pasos para probar el proyecto desde cero. | Clonar en una carpeta nueva, `npm install` y `ng serve demo-app`. | Escribí la URL con los símbolos `<` y `>` de marcador y PowerShell los interpretó como redirección. Los quité y usé la URL tal cual. |
| 18 | Pedí un guion para explicar el sistema en el video, desde la presentación hasta el cierre. | La estructura del guion: presentación, estructura, convenciones, componentes, demo, estado y decisiones, uso de IA y cierre. | Lo uso como guía y lo explico con mis palabras, ajustado a lo que muestra mi demo. |
| 19 | Pedí actualizar esta bitácora con lo hecho en los últimos días y exportarla a Markdown. | El formato de tablas y la conversión a `DEVELOPMENT_LOG.md`, que es el nombre que pide el PDF. | Corregí el período a 20 al 24 de noviembre. |

## 5. Retos y soluciones

| Reto                                                     | Causa                                                                                       | Solución                                                                                                                        |
|----------------------------------------------------------|---------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| ng serve dijo "Unknown arguments: server"                | Se escribió ng server.                                                                      | El comando correcto es ng serve demo-app.                                                                                       |
| ng build ui-lib falló con TS2307                         | public-api.ts seguía exportando el componente de ejemplo borrado.                           | Dejar en public-api.ts solo los componentes reales.                                                                             |
| VS Code marcó error en tsconfig.spec.json de la librería | TypeScript 6 exige rootDir explícito cuando se define outDir.                               | Añadir "rootDir": ".".                                                                                                          |
| Los botones salían sin estilos y el spinner enorme       | content quedó vacío (\[\]) en tailwind.config.js, tal como lo genera npx tailwindcss init.  | content: \['./projects/\*\*/\*.{html,ts}'\] y reiniciar el servidor. El build avisaba con "content option is missing or empty". |
| La página mostraba atributos como texto                  | A button.html le faltaba la etiqueta de apertura \<button y isBlocked() estaba mal escrito. | Reescribir la plantilla; el build no avisó porque sin la etiqueta no había bindings que validar.                                |
| Error en card.ts                                         | La clase se llamó card (minúscula) y faltaba el tipo CardElevation.                         | export class Card y export type CardElevation.                                                                                  |
| Errores en select.ts y app.html                          | Faltaban el input loading y la interfaz SelectOption, y una letra estaba mal escrita.       | Completar select.ts y unificar el nombre del tipo.                                                                              |
| table.html mostraba errores de TypeScript                | Se pegó el código de table.ts dentro del HTML.                                              | Cada código en su archivo.                                                                                                      |
| app.config.ts con error                                  | Se duplicó la propiedad providers.                                                          | Dejar una sola con provideHttpClient().                                                                                         |
| ERR_CONNECTION_REFUSED en el navegador                   | El servidor de desarrollo estaba detenido.                                                  | Volver a ejecutar ng serve demo-app y dejar la terminal abierta.                                                                |
| Avisos amarillos de @tailwind en styles.css              | El validador de CSS del editor no conoce esas reglas.                                       | "css.lint.unknownAtRules": "ignore" en .vscode/settings.json; no afecta a la compilación.                                       |
| app.ts usaba `SelectOptions` y el PDF pide `SelectOption` | El nombre de la interfaz no coincidía con el enunciado. | Renombrarla con F2 en VS Code, que actualiza todas las referencias, y volver a compilar `ui-lib` y `demo-app`. |
| Prettier mezcló formato con trabajo sin commitear en app.html y app.ts | La pantalla Explorer no se había commiteado todavía. | Dividir en commits separados para mantenerlos atómicos. |
| El commit del tema incluía también la pantalla Explorer y su mensaje no lo reflejaba | Los archivos ya estaban preparados cuando se hizo el commit del tema. | `git commit --amend` para reescribir el mensaje y `git push --force-with-lease`. |
| Advertencias "LF will be replaced by CRLF" en Windows | Git avisa del cambio de salto de línea; no afecta al código. | `git config core.autocrlf true`. |
| La búsqueda de `any` devolvía líneas irrelevantes | `findstr` trató cada palabra entre comillas como una búsqueda distinta. | `findstr /s /n /r "\<any\>" projects\*.ts`, que no devolvió resultados. |
| Error al clonar para la prueba limpia | Dejé los símbolos `<` y `>` del marcador de la URL y PowerShell los tomó como redirección. | Usar la URL del repositorio sin símbolos. |
| Git no encontraba DEVELOPMENT_LOG.md | El archivo estaba guardado como `DEVELOPMENT_LOG.md.docx`, es decir, como Word. | Convertirlo a Markdown y guardarlo con el nombre exacto en la raíz del repo. |

## 6. Cómo se verificó

- ng build ui-lib y ng build demo-app sin errores ni avisos.

- Recorrido manual del flujo: carga inicial con Characters, filtro por status, cambio de recurso con reinicio del filtro, skeleton, estado vacío, error de red simulado sin conexión, modal de detalle, eliminar con confirmación y vista móvil.

- Búsqueda de `any` en `projects\*.ts`, `@Input` y `@Output`: sin resultados.

- Clonación del repo en una carpeta nueva, `npm install` (sin vulnerabilidades) y `ng serve demo-app`: la demo funciona con todo el flujo anterior.

- `git status` limpio y `origin/main` sincronizado tras el último push.
