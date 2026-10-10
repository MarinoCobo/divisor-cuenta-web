---

description: "Lista de tareas para implementar el divisor de cuenta en React"
---

# Tasks: Divisor de cuenta (React)

**Input**: Design documents from `/specs/001-divisor-cuenta/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: la constitución (principio IV) exige que cada escenario de aceptación sea una
prueba ejecutable, así que hay tareas de prueba. `test/casosDePrueba.js` lo escribe el
estudiante a mano (Parte 7.2 del deber); el resto de las pruebas se generan en la Fase 6.

**Organization**: tareas agrupadas por historia de usuario.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivo distinto, sin dependencias pendientes)
- **[Story]**: historia a la que pertenece (US1, US2, US3)

## Path Conventions

- App React única: `src/domain/`, `src/data/`, `src/presentation/`, `src/main.jsx`,
  `test/` en la raíz del repositorio.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: dejar la estructura y las herramientas listas.

- [X] T001 Crear las carpetas `src/domain/`, `src/data/` y `src/presentation/`
- [X] T002 [P] Borrar `src/App.jsx`, `src/App.css` y `src/assets/` de la plantilla de Vite: son la demo del contador y no pertenecen a ninguna capa
- [X] T003 [P] Dejar `src/index.css` como única hoja de estilos de la vista y quitar los estilos de la demo
- [X] T004 [P] Instalar las herramientas de prueba: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- [X] T005 Agregar la sección `test` a `vite.config.js` (`environment: 'jsdom'`, `globals: true`, `setupFiles: ['./test/setup.js']`) y crear `test/setup.js`
- [X] T006 Agregar el script `"test": "vitest run"` a `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: entidades y contrato del domain que usan todas las historias.

**⚠️ CRITICAL**: ninguna historia puede empezar antes de terminar esta fase.

- [X] T007 [P] Crear la entidad `cuenta` (`monto`, `personas`, `propina`; objeto congelado) en `src/domain/cuenta.js`
- [X] T008 [P] Crear la entidad `resultado` (`montoPorPersona`) en `src/domain/resultado.js`
- [X] T009 [P] Crear el contrato `EstrategiaRedondeo` con una única función `aplicar(valor)` en `src/domain/estrategiaRedondeo.js`

**Regla para todas las tareas de código**: cada módulo y función exportada lleva un bloque
JSDoc con qué hace, por qué existe, qué recibe, qué devuelve y qué errores produce
(constitución V).

**Checkpoint**: domain base listo; `git grep -n "from 'react'" -- src/domain/` sin salida.

---

## Phase 3: User Story 1 - Calcular cuánto paga cada persona (Priority: P1) 🎯 MVP

**Goal**: con monto, personas y propina válidos, la vista muestra el monto por persona con
dos decimales.

**Independent Test**: ingresar 100, 4 y 10 en modo exacto y comprobar que aparece `27.50`.

- [X] T010 [US1] Crear `calcularDivision(cuenta, estrategia)` en `src/domain/calcularDivision.js`: aplica `monto * (100 + propina) / (100 * personas)` y delega el redondeo a `estrategia.aplicar`. Solo calcula: no valida ni formatea (SRP); no pregunta el tipo de la estrategia (LSP/OCP)
- [X] T011 [US1] Crear `redondeoExacto` en `src/data/redondeoExacto.js`: al centavo más cercano, mitad hacia arriba, con tolerancia `1e-6` (FR-004)
- [X] T012 [US1] Crear `formatearMoneda(monto)` en `src/presentation/formateadorMoneda.js`: `toFixed(2)`, sin símbolo de moneda (FR-003)
- [X] T013 [US1] Crear el hook `useDivisor(dependencias)` en `src/presentation/useDivisor.js`: guarda el texto de los tres campos y el modo, expone `calcular()` y `limpiar()`, recibe todas sus dependencias por argumento (DIP)
- [X] T014 [US1] Crear `PantallaDivisor.jsx` en `src/presentation/`: tres campos, selector de modo, botón "Calcular" y el resultado. Solo dibuja; recibe el hook ya armado
- [X] T015 [US1] Crear `src/main.jsx`: único punto de composición; arma el mapa de estrategias y monta la vista con `createRoot`
- [X] T016 [US1] Dejar `index.html` apuntando a `src/main.jsx` y con el título "Divisor de cuenta"

**Checkpoint**: `npm run dev` muestra la vista y el escenario 1 funciona a mano.

---

## Phase 4: User Story 2 - Aviso claro cuando la entrada es inválida (Priority: P2)

**Goal**: con entradas inválidas se muestra un único mensaje exacto y ningún resultado.

**Independent Test**: 50 y 0 personas → "Debe haber al menos una persona", sin número en
pantalla.

- [X] T017 [US2] Crear `validarEntrada({ monto, personas, propina })` en `src/domain/validarEntrada.js`: devuelve `null` si todo es válido, o el mensaje del primer error en orden monto → personas → propina (FR-007, FR-008, edge cases)
- [X] T018 [US2] Exportar los mensajes exactos `MONTO_INVALIDO`, `PERSONAS_INSUFICIENTES` y `PROPINA_INVALIDA` desde `validarEntrada.js`, con el mismo texto que la versión Flutter (FR-008)
- [X] T019 [US2] Conectar la validación en `useDivisor`: si hay mensaje, guardarlo en `error`, borrar `resultado` y NO calcular (FR-007)
- [X] T020 [US2] Leer los campos como texto en `useDivisor`: coma o punto como separador decimal, monto vacío → `NaN`, propina vacía → `0`, personas vacías → `0` (FR-010, edge cases)
- [X] T021 [US2] Filtrar el campo de personas a dígitos y máximo 6 caracteres en `onChange` (edge case del campo de personas)
- [X] T022 [US2] Mostrar `mensajeError` en `PantallaDivisor.jsx` y garantizar que nunca aparece junto con `resultado`

**Checkpoint**: los escenarios 3 y 4 funcionan a mano.

---

## Phase 5: User Story 3 - Elegir redondear hacia arriba (Priority: P3)

**Goal**: el usuario puede cambiar el modo de redondeo y el resultado cambia en
consecuencia.

**Independent Test**: 10, 3, 0 % en modo hacia arriba → `4.00`; en exacto → `3.33`.

- [X] T023 [US3] Crear `redondeoHaciaArriba` en `src/data/redondeoHaciaArriba.js`: al entero superior salvo que ya sea entero, con tolerancia proporcional al monto (FR-005 y el edge case del entero que no sube)
- [X] T024 [US3] Registrar `redondeoHaciaArriba` en el mapa de estrategias de `src/main.jsx` — una sola línea, sin editar ningún módulo existente (OCP)
- [X] T025 [US3] Dibujar el selector de modo en `PantallaDivisor.jsx` recorriendo `modos` del hook, con `aria-pressed` en el activo (FR-006)
- [X] T026 [US3] Borrar el resultado al cambiar de modo (FR-011)

**Checkpoint**: los escenarios 5 y 6 funcionan a mano; los 6 escenarios de la spec pasan.

---

## Phase 6: Pruebas (constitución IV)

**Purpose**: convertir cada escenario de aceptación en una prueba ejecutable.

- [X] T027 Escribir `test/casosDePrueba.js` **a mano**, con los mismos valores, nombres y mensajes que `test/casos_de_prueba.dart` del proyecto Flutter (Parte 7.2 del deber)
- [X] T028 Crear `test/division.test.js`: recorre `casos` con un bucle, genera un `it()` por caso usando `caso.nombre`, valida con `validarEntrada` y compara con `toBeCloseTo(esperado, 2)`. No importa `react`
- [X] T029 Agregar a `test/division.test.js` la prueba de LSP: el mismo `calcularDivision` recibe `redondeoExacto` y luego `redondeoHaciaArriba` sin ningún `if` ni comprobación de tipo
- [X] T030 Agregar a `test/division.test.js` la comprobación de que con un error de validación NO se calcula nada (estrategia espía con contador, igual que en Flutter)
- [X] T031 Crear `test/pantalla.test.jsx` con Testing Library y tres pruebas: 100/4/10 → `27.50`; 50 y 0 personas → mensaje y ningún resultado; "abc" en el monto → "Monto inválido"

**Checkpoint**: `npm test` en verde con 10 pruebas (6 escenarios + LSP + 3 de la vista).

---

## Phase 7: Verificación final

- [X] T032 Verificar las capas y SOLID con `git grep` según la tabla de la constitución
- [X] T033 Verificar que no hay llamadas de red ni almacenamiento (FR-009, SC-004)
- [X] T034 `npm run build` sin errores
- [X] T035 Completar `analisis_spec.md`, `bitacora.md` y `respuestas.md` con las métricas y los diffs

---

## Dependencies

```text
Fase 1 (setup) → Fase 2 (domain base) → US1 (P1) → US2 (P2) → US3 (P3) → Fase 6 → Fase 7
```

- T010 depende de T007, T008 y T009 (necesita las entidades y el contrato).
- T013 depende de T010, T012 y T017 (el hook coordina cálculo, formato y validación).
- T024 depende de T023 y T015 (registra la estrategia nueva en el punto de composición).
- T028–T031 dependen de T027 (los casos son la fuente de las pruebas).

## Parallel Example

Las tareas marcadas `[P]` de la Fase 1 (T002, T003, T004) y las tres de la Fase 2
(T007, T008, T009) tocan archivos distintos y no tienen dependencias pendientes entre sí.

---

## Phase 8: Convergence (`/speckit-converge`)

Tareas agregadas por `/speckit-converge` tras `/speckit-implement`. Ver
`convergencia-speckit.md` para las brechas que las originan.

- [X] T036 Crear `test/casosBorde.test.js` con los casos borde del domain de la spec (monto 0/negativo/infinito/máximo, propina fuera de rango, prioridad de mensajes, ruido de punto flotante, límites de 1e9 y 999 999 personas) per spec.md §Edge Cases (`partial`)
- [X] T037 Crear `test/pantallaBorde.test.jsx` con los casos borde de la vista (modo inicial, borrado del resultado al editar o cambiar de modo, filtro de 6 dígitos, coma decimal, propina vacía, mapa de estrategias vacío) per spec.md §Edge Cases y FR-006/FR-010/FR-011 (`partial`)
- [X] T038 Exportar `App` desde `src/main.jsx` y reutilizarla en las pruebas de la vista, para que ninguna prueba de pantalla vuelva a nombrar las implementaciones concretas de `src/data/` per constitución II (`partial`)
