# Implementation Plan: Divisor de cuenta

**Branch**: `main` | **Date**: 2026-10-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-divisor-cuenta/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Página web de una sola vista en React donde el usuario escribe monto, personas y propina,
elige un modo de redondeo y hace clic en "Calcular" para ver cuánto paga cada persona con
dos decimales. El cálculo vive en un `src/domain/` de JavaScript puro (cuenta, resultado,
calcularDivision, validarEntrada y el contrato estrategiaRedondeo); las dos reglas de
redondeo viven en `src/data/`; la vista, el hook y el formateo viven en
`src/presentation/`; `src/main.jsx` es el único lugar donde se crean las implementaciones
concretas.

La especificación es la **misma** del proyecto Flutter, importada sin un solo cambio
(mismo SHA-256, diff vacío). Este plan es el artefacto que absorbe todo el cambio de
tecnología.

Entrada del usuario para este plan:

> Lee la spec del feature activo en `SPECIFY_FEATURE_DIRECTORY`. NO la modifiques.
> Implementación en React con Vite, JavaScript, sin librerías de estado externas. Estado
> local con useState (es una sola pantalla). Capas, respetando la constitución:
> `src/domain/`: cuenta.js, resultado.js, calcularDivision.js, validarEntrada.js y
> estrategiaRedondeo.js (el contrato: una función `aplicar(valor)`); `src/data/`:
> redondeoExacto.js y redondeoHaciaArriba.js; `src/presentation/`: useDivisor.js (hook que
> RECIBE sus dependencias), formateadorMoneda.js y PantallaDivisor.jsx; `src/main.jsx`:
> único punto de composición. Pruebas con Vitest.

## Technical Context

**Language/Version**: JavaScript (ES2022, módulos ESM) sobre Node.js 26.8.2; React 19.2

**Primary Dependencies**: `react` y `react-dom` en producción. En desarrollo, Vite 8 con
`@vitejs/plugin-react`. Sin librerías de estado externas (ni Redux, ni Zustand, ni
TanStack): el estado local de una sola vista se cubre con `useState`.

**Storage**: N/A (sin base de datos ni archivos; todo vive en memoria mientras la pestaña
está abierta)

**Testing**: Vitest con `jsdom` y Testing Library
(`@testing-library/react`, `@testing-library/jest-dom`). Las pruebas del domain corren sin
React; las de la vista usan `render` y `fireEvent`.

**Target Platform**: navegadores modernos de escritorio y móvil (ES2022 + módulos ESM);
se sirve como sitio estático, sin servidor de aplicación

**Project Type**: web-app de una sola vista (SPA estática)

**Performance Goals**: resultado visible en menos de 1 s después de hacer clic en
"Calcular" (SC-003); el cálculo es una operación aritmética, muy por debajo de ese límite

**Constraints**: sin conexión (FR-009 y SC-004: ninguna llamada de red), sin librerías de
estado externas (entrada de este plan), `src/domain/` sin `react` ni DOM (constitución II)

**Scale/Scope**: 1 vista, 3 campos, 2 modos de redondeo, 11 archivos en `src/`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cómo lo cumple este plan | Estado |
|---|---|---|
| I. SRP | `calcularDivision` solo calcula; `validarEntrada` solo valida; `formateadorMoneda` solo formatea; `PantallaDivisor` solo dibuja; `useDivisor` solo coordina | PASA |
| I. OCP | un modo nuevo = módulo nuevo en `src/data/` + una línea en el mapa de `src/main.jsx`; el hook recibe el mapa y la vista lo recorre | PASA |
| I. LSP | `calcularDivision(cuenta, estrategia)` usa solo `estrategia.aplicar(...)`, sin `instanceof` ni comparar el nombre del modo | PASA |
| I. ISP | el contrato `estrategiaRedondeo` tiene una única función: `aplicar(valor)` | PASA |
| I. DIP | `src/presentation/` importa solo de `src/domain/`; `useDivisor` recibe sus dependencias como argumento | PASA |
| II. Capas | `presentation -> domain <- data`; `src/domain/` no importa `react` ni DOM; concretos solo en `src/main.jsx` | PASA |
| III. Seguridad | no hay secretos, red ni almacenamiento | PASA |
| IV. Pruebas | cada escenario de aceptación tiene su prueba (`test/casosDePrueba.js` + `test/division.test.js`, y `test/pantalla.test.jsx` para la vista) | PASA |
| V. Regla de la materia | cada módulo y función exportada de `src/` lleva JSDoc con las cinco preguntas | PASA (verificación manual: ver nota de migración en la constitución) |

Re-evaluación tras la Fase 1 (diseño): sin cambios, sigue pasando. No hay violaciones que
justificar en Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-divisor-cuenta/
├── spec.md              # importada del proyecto Flutter SIN CAMBIOS
├── plan.md              # este archivo
├── research.md          # Fase 0: decisiones técnicas
├── data-model.md        # Fase 1: entidades y reglas de validación
├── quickstart.md        # Fase 1: cómo comprobar que funciona
├── contracts/
│   ├── domain.md        # contrato de los módulos del domain
│   └── pantalla.md      # contrato de la vista (campos, textos, test ids)
└── tasks.md             # Fase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── domain/
│   ├── cuenta.js                     entidad: monto, personas, propina
│   ├── resultado.js                  entidad: monto por persona
│   ├── estrategiaRedondeo.js         el contrato: una función aplicar(valor) (ISP)
│   ├── calcularDivision.js           caso de uso: solo calcula (SRP)
│   └── validarEntrada.js             caso de uso: solo valida (SRP)
├── data/
│   ├── redondeoExacto.js             cumple el contrato (OCP/LSP)
│   └── redondeoHaciaArriba.js        cumple el contrato (OCP/LSP)
├── presentation/
│   ├── useDivisor.js                 hook; RECIBE sus dependencias (DIP)
│   ├── formateadorMoneda.js          solo formatea a dos decimales (SRP)
│   └── PantallaDivisor.jsx           solo dibuja
└── main.jsx                          único punto de composición

test/
├── setup.js                          activa jest-dom en Vitest
├── casosDePrueba.js                  los 6 escenarios de la spec (lo escribe el estudiante)
├── division.test.js                  recorre los casos + prueba de LSP (sin React)
└── pantalla.test.jsx                 3 pruebas de la vista
```

**Structure Decision**: una sola app React con tres capas dentro de `src/`, tal como la
constitución exige. Se eliminan de la plantilla de Vite `src/App.jsx`, `src/App.css` y
`src/assets/` porque pertenecen a la demo del contador que ya no existe; se conserva
`src/index.css` como hoja de estilos de la vista. `index.html` apunta a `src/main.jsx`.

## Decisiones técnicas que cambian respecto del plan de Flutter

Esta sección existe porque el deber mide **qué parte del CÓMO dejó de tener sentido**.

| Decisión | Plan Flutter | Plan React | Por qué dejó de tener sentido |
|---|---|---|---|
| Lenguaje y SDK | Dart 3.13 con Flutter 3.47 (canal stable) | JavaScript ES2022 con React 19.2 y Vite 8 | El cliente pidió una página web; el SDK de Flutter ya no interviene |
| Estado de la vista | `StatefulWidget` + `setState` | función con `useState` | `StatefulWidget` es una clase de Flutter; React no tiene widgets ni `setState` de clase |
| Coordinación | clase `DivisorController` con dependencias por constructor | hook `useDivisor(dependencias)` | React no instancia controladores por pantalla; el patrón equivalente es un hook que recibe sus dependencias como argumento |
| Contrato de redondeo | `abstract interface class EstrategiaRedondeo` con el método `redondear` | objeto con la función `aplicar(valor)` | JavaScript no tiene `interface` ni clases abstractas; el contrato se vuelve estructural (duck typing) |
| Carpeta raíz del código | `lib/` | `src/` | `lib/` es la convención de un paquete Dart; `src/` la de Vite |
| Punto de composición | `lib/main.dart` con `runApp(MaterialApp(...))` | `src/main.jsx` con `createRoot(...).render(...)` | `runApp` y `MaterialApp` son API de Flutter |
| Widgets de entrada | `TextField` con `inputFormatters` (`FilteringTextInputFormatter.digitsOnly`, `LengthLimitingTextInputFormatter(6)`) | `<input>` controlado con filtro en `onChange` | `inputFormatters` es API de Flutter; en web el filtrado se hace en el manejador del cambio |
| Selector de modo | `SegmentedButton<String>` | `<button>` por modo con `aria-pressed` | `SegmentedButton` es un widget de Material |
| Identificación en pruebas | `Key('campoMonto')` + `find.byKey` | `data-testid="campoMonto"` + `getByTestId` | `Key` es de Flutter; en web el equivalente es un atributo del DOM |
| Tema | `ThemeData(colorSchemeSeed: Colors.teal)` | CSS en `src/index.css` | No hay `ThemeData` en la web; el estilo es CSS |
| Runner de pruebas | `flutter_test` (`test`, `testWidgets`, `expect(..., closeTo(...))`) | Vitest (`it`, `expect(...).toBeCloseTo(...)`) + Testing Library | Herramientas distintas para el mismo criterio |
| Formato a dos decimales | `monto.toStringAsFixed(2)` | `monto.toFixed(2)` | Nombre del método en Dart vs. JavaScript |
| Plataforma objetivo | Android e iOS (y macOS/web por la plantilla) | navegadores modernos, sitio estático | El cliente cambió el medio de entrega |
| Comando de verificación | `flutter test` y `flutter analyze` | `npm test` y `npm run build` | Comandos de cada toolchain |

**Lo que NO cambió del plan de Flutter** (y por qué importa): la arquitectura de tres
capas, la regla de dependencia `presentation -> domain <- data`, el reparto de
responsabilidades entre los cinco módulos del domain, la decisión de multiplicar antes de
dividir para no arrastrar el error de punto flotante, la lista de entidades, el único punto
de composición y la exigencia de que cada escenario de aceptación tenga su prueba. Todo eso
sobrevivió porque lo fijaban la spec y la constitución, no la tecnología.

## Complexity Tracking

Sin violaciones de la constitución: no aplica.
