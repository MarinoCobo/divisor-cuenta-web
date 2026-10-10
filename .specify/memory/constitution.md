# Constitución de divisor_cuenta_web

## Core Principles

### I. Calidad de código (SOLID)

El código DEBE respetar los cinco principios SOLID, verificables así:

- **SRP (una función o módulo, una razón de cambio):** cada módulo tiene una sola
  responsabilidad. El módulo que calcula la división NO valida la entrada NI formatea el
  resultado: no contiene `toFixed`, ni textos de mensajes de error, ni lógica de parseo.
- **OCP (abierto a extensión, cerrado a modificación):** agregar una nueva regla de
  redondeo DEBE hacerse creando un módulo nuevo en `src/data/` que cumpla el contrato de
  redondeo y registrándolo en `src/main.jsx`. NO se edita ningún módulo existente de
  `src/domain/`, `src/data/` ni `src/presentation/`.
- **LSP (sustitución de Liskov):** cualquier implementación del contrato de redondeo DEBE
  poder sustituir a otra sin que quien la usa pregunte de qué tipo es: prohibido
  `instanceof` o comparar el nombre del modo en el código que consume el contrato.
- **ISP (segregación de interfaces):** los contratos son pequeños; el contrato de redondeo
  tiene exactamente una función, `aplicar(valor)`. Ningún módulo depende de funciones que
  no usa.
- **DIP (inversión de dependencias):** `src/presentation/` depende de abstracciones de
  `src/domain/` y NUNCA importa implementaciones concretas de `src/data/`.

Razón: estas reglas permiten cambiar o agregar comportamiento tocando un solo lugar, y
probar cada pieza por separado.

### II. Arquitectura por capas

- Capas obligatorias: `src/presentation/`, `src/domain/`, `src/data/`.
- Regla de dependencia: `presentation -> domain <- data`. `domain` no importa de
  ninguna de las otras dos capas; `data` solo importa de `domain`.
- `src/domain/` NO importa `react` ni nada del DOM: es JavaScript puro y se prueba sin
  React.
- `src/main.jsx` es el ÚNICO archivo donde se instancian implementaciones concretas de
  `src/data/` (por ejemplo, `redondeoExacto`).

Razón: el núcleo del cálculo queda aislado del framework y de los detalles concretos.

### III. Seguridad

- Nunca se guardan secretos, contraseñas, tokens ni API keys en el repositorio.

Razón: todo lo que entra al repositorio se considera público.

### IV. Calidad y pruebas

- Toda funcionalidad crítica (cálculo, validación de entrada y redondeo) tiene pruebas
  automatizadas.
- Cada escenario de aceptación de cada spec se convierte en al menos una prueba
  ejecutable cuyo nombre identifica el escenario.
- `npm test` y `npm run build` DEBEN terminar sin fallos antes de dar una tarea por
  terminada.

Razón: un criterio de aceptación que no se ejecuta no se puede demostrar.

### V. Regla de la materia

- Toda función generada por el agente debe poder explicarla el estudiante: qué hace,
  por qué existe, qué recibe, qué devuelve y qué errores produce.
- Para que sea comprobable, todo módulo y toda función exportada de `src/` lleva un
  bloque de documentación JSDoc (`/** ... */`) que responde esas cinco preguntas cuando
  aplican.

Razón: el estudiante es responsable del código que entrega, lo haya escrito o no.

## Verificación de cumplimiento

Cada regla anterior se comprueba con un comando, ejecutado desde la raíz del proyecto.
Se usa `git grep` porque se comporta igual en Windows, macOS y Linux.

| Regla | Comando | Resultado esperado |
|---|---|---|
| II: domain sin React | `git grep -n "from 'react'" -- src/domain/` | sin salida |
| II/DIP: instancias concretas solo en main | `git grep -n "redondeoExacto\|redondeoHaciaArriba" -- src/` | fuera de `src/data/`, solo `src/main.jsx` |
| DIP: presentation no importa data | `git grep -n "data/" -- src/presentation/` | sin salida |
| LSP/OCP: sin preguntar el tipo | `git grep -n "instanceof\|=== 'exacto'\|=== 'arriba'" -- src/domain/calcularDivision.js` | sin salida |
| SRP: el cálculo no formatea ni valida | `git grep -n "toFixed\|inválido\|al menos una persona" -- src/domain/calcularDivision.js` | sin salida |
| III: sin secretos | `git grep -niE "api[_-]?key\|secret\|password\|token" -- src/` | sin salida |
| IV: pruebas | `npm test` | todas en verde |
| IV: compilación | `npm run build` | termina sin errores |

> **Nota de migración (Flutter → React).** En el proyecto Flutter esta tabla incluía
> `flutter analyze` con la regla `public_member_api_docs`, que **hacía cumplir
> automáticamente** el principio V: sin `///`, el análisis fallaba. El toolchain de este
> proyecto no tiene una regla equivalente que falle por falta de JSDoc, así que la
> verificación del principio V baja a convención y revisión manual. Es la única regla de
> la constitución original cuyo mecanismo de verificación fue **reemplazado** y no solo
> readaptado; queda documentado aquí para no perder el rastro.

## Governance

- Esta constitución está por encima de cualquier otra práctica del proyecto. Spec, plan
  y tareas DEBEN cumplirla; `/speckit-analyze` reporta cualquier contradicción.
- Si una verificación falla, se corrige desde el artefacto que define la regla
  incumplida (spec, plan o constitución), no parchando el código a mano.
- Las enmiendas se documentan en este archivo y suben la versión: MAJOR si se elimina o
  redefine un principio, MINOR si se agrega uno, PATCH si solo se aclara la redacción.

**Version**: 1.0.0 | **Ratified**: 2026-10-09 | **Last Amended**: 2026-10-09
