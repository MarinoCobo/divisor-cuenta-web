# Respuestas — Deber 2

**SDD: cambiar la tecnología sin cambiar la especificación**
Programación Asistida de Aplicaciones · USFQ · Prof. Jose David Vega Sánchez

- Proyecto Flutter: `divisor_cuenta`, rama `sdd`
- Proyecto React: `divisor_cuenta_web` (este repositorio)
- Feature activo: `specs/001-divisor-cuenta` (`SPECIFY_FEATURE_DIRECTORY`)
- Análisis enunciado por enunciado: [`analisis_spec.md`](analisis_spec.md)
- Bitácora: `bitacora.md` en la rama `sdd` del proyecto Flutter
- Salida de `/speckit-analyze`: [`specs/001-divisor-cuenta/analisis-speckit.md`](specs/001-divisor-cuenta/analisis-speckit.md)
- Salida de `/speckit-converge`: [`specs/001-divisor-cuenta/convergencia-speckit.md`](specs/001-divisor-cuenta/convergencia-speckit.md)

---

## La bitácora

| Métrica | Flutter (laboratorio) | React (este deber) |
|---|---:|---:|
| Minutos hasta la primera versión que compila | `no registrado` | **9 min 08 s** |
| **Minutos hasta que pasan los 6 casos** | `no registrado` | **8 min 26 s** |
| Iteraciones con el agente | `no registrado` | **0** (ver nota) |
| Líneas de código escritas a mano | `no registrado` | **0** (ver nota) |
| Enunciados modificados en la spec | — | **0 de 53 (0 %)** |
| Enunciados modificados en la Constitution | — | **18 de 31 (58,1 %)** |
| Líneas modificadas en el plan | — | **95 añadidas / 58 eliminadas**; **25 de 30 enunciados (83,3 %)** |
| Casos de aceptación que pasan (0–6) | `no registrado` | **6 de 6** |

En el laboratorio de Flutter no se llevó bitácora: esas casillas van como `no registrado` y
**no se estiman**. El historial de la rama `sdd` (16 commits) se anota como contexto, no
como métrica, porque un commit no es una iteración.

**Nota sobre las dos casillas en 0.** Todo el deber se ejecutó en una sola sesión del
agente a partir de una única instrucción, así que con la definición del enunciado
(mensajes del estudiante después del prompt inicial) las iteraciones son 0 y las líneas
escritas a mano son 0. **Ninguno de los dos números es comparable** con una corrida normal
de laboratorio, y el tiempo tampoco: 8 min 26 s mide una sesión de agente, no a una
persona programando. El enunciado advierte que el tiempo es una métrica descriptiva
secundaria; aquí lo es más que nunca. Las dos correcciones reales que hubo están anotadas
en `bitacora.md` (nota 1) aunque el enunciado no las cuente como iteración.

**`flutter test` no se pudo ejecutar:** en la máquina donde se hizo este deber no están
instalados Flutter ni Dart. La rama `sdd` se verificó por inspección (5 archivos de prueba,
33 pruebas declaradas, los 6 escenarios en `casos_de_prueba.dart`), pero la casilla de
Flutter queda `no registrado` hasta correrlo en una máquina con el SDK. Detalle en
`bitacora.md` (nota 3).

---

## 1. ¿Qué porcentaje de la spec viajó intacto, qué porcentaje necesitó adaptación y qué porcentaje no pudo reutilizarse?

| Resultado | Enunciados | % |
|---|---:|---:|
| **Viaja intacto** (QUÉ) | 52 | **98,1 %** |
| **Viaja con adaptación** (MIXTO) | 1 | **1,9 %** |
| **No viaja** (CÓMO) | 0 | **0,0 %** |
| **Total** | **53** | 100 % |

```text
% CÓMO = 0 / 53 × 100 = 0,0 %
```

Muy por debajo del **30 %** que este deber fija como señal de spec contaminada — un
**umbral pedagógico de este deber, no una regla universal de SDD**.

### La justificación: el diff está vacío

```console
$ export SPECIFY_FEATURE_DIRECTORY="specs/001-divisor-cuenta"
$ git diff --no-index -- "../divisor_cuenta/specs/001-divisor-cuenta/spec.md" \
                         "$SPECIFY_FEATURE_DIRECTORY/spec.md"
$ echo "exit: $?"
exit: 0

$ sha256sum ../divisor_cuenta/specs/001-divisor-cuenta/spec.md \
            "$SPECIFY_FEATURE_DIRECTORY/spec.md"
423d0f601d02be1acc03b8edb9431905d6f13350947bc36082446fcf1d6a6dfb  ../divisor_cuenta/specs/001-divisor-cuenta/spec.md
423d0f601d02be1acc03b8edb9431905d6f13350947bc36082446fcf1d6a6dfb  specs/001-divisor-cuenta/spec.md
```

Sin salida y mismo SHA-256: la spec de React es byte por byte la de Flutter, al principio y
al final del deber.

### La justificación: la spec no nombra la tecnología anterior

```console
$ for t in "package:flutter" "Flutter" "Dart" "flutter_test" "setState" \
           "Riverpod" "Widget" "lib/" "pubspec" "StatefulWidget"; do
    printf '%-18s %s\n' "$t" "$(grep -o -i -- "$t" spec.md | wc -l)"
  done
package:flutter    0
Flutter            0
Dart               0
flutter_test       0
setState           0
Riverpod           0
Widget             0
lib/               0
pubspec            0
StatefulWidget     0

$ grep -nE 'teléfono|modo avión' spec.md
160:- **SC-004**: La app funciona igual con el teléfono en modo avión (100 % de las funciones
```

**Cero** menciones al framework, al lenguaje, a sus paquetes, a sus clases o a sus
carpetas. Un solo enunciado (SC-004) nombra un artefacto de plataforma, y es exactamente el
único clasificado como MIXTO. El desglose de los 53 enunciados, con el criterio de conteo
declarado de antemano, está en [`analisis_spec.md`](analisis_spec.md) §1 y §2.

> Una búsqueda ingenua `grep -i "ios"` devuelve 6 coincidencias en la spec, pero todas son
> la palabra **"escenar-ios"**. Con límite de palabra (`\biOS\b`) el resultado es 0. Se
> anota porque el falso positivo invitaba a concluir que la spec mencionaba iOS.

### Sensibilidad del conteo

`analisis_spec.md` §3 reporta aparte una adaptación **léxica** transversal: la spec usa
"tocar" (18 veces) donde la web dice "hacer clic". No se cuenta como MIXTO porque no cambia
ninguna regla verificable: la prueba que en Flutter hace
`tester.tap(find.text('Calcular'))` aquí hace `fireEvent.click(screen.getByText('Calcular'))`,
con el mismo escenario, la misma entrada y el mismo valor esperado. Si se contara:

| Criterio | Intacto | Adaptación | No viaja |
|---|---:|---:|---:|
| El declarado (el que uso) | 98,1 % | 1,9 % | 0,0 % |
| Contando "tocar" como MIXTO | 64,2 % | 35,8 % | 0,0 % |

En los dos casos el dato que importa no cambia: **0 % no viaja y 0 enunciados se
rehicieron.**

### El tiempo, como contexto

Los 6 casos pasaron a los 8 min 26 s del primer prompt de `/speckit-plan`, a la primera
ejecución de la suite y sin ningún arreglo posterior en `src/`. Lo tomo como indicio de que
la spec traía suficiente información para no tener que adivinar, **no** como medida de
calidad: el tiempo de Flutter no se registró, así que no hay comparación posible.

---

## 2. En la Constitution, clasifica cada regla como idéntica, adaptada en redacción o reemplazada

Las 31 reglas, una por una, están en [`analisis_spec.md`](analisis_spec.md) §5. Resumen:

| Clasificación | Reglas | % |
|---|---:|---:|
| **Idéntica** | 13 | **41,9 %** |
| **Adaptada en redacción** | 17 | **54,8 %** |
| **Reemplazada** | 1 | **3,2 %** |

- **Reglas nuevas sin equivalente en Flutter: 0.** El prompt de la Parte 4 pedía "sin
  inventar otros" y no se agregó ninguna.
- **Reglas de Flutter perdidas: 0.** Las 31 tienen destino.

### Ejemplos con evidencia de las dos constituciones

**Idéntica — seguridad.** Las dos dicen lo mismo, palabra por palabra:

```text
Flutter  .specify/memory/constitution.md §III:
  - Nunca se guardan secretos, contraseñas, tokens ni API keys en el repositorio.
React    .specify/memory/constitution.md §III:
  - Nunca se guardan secretos, contraseñas, tokens ni API keys en el repositorio.
```

**Idéntica — la regla de dependencia.** El enunciado más reusable de toda la constitución,
porque no contiene un solo término tecnológico:

```text
Flutter §II: Regla de dependencia: `presentation -> domain <- data`. `domain` no importa de
             ninguna de las otras dos capas; `data` solo importa de `domain`.
React   §II: Regla de dependencia: `presentation -> domain <- data`. `domain` no importa de
             ninguna de las otras dos capas; `data` solo importa de `domain`.
```

**Adaptada en redacción — el caso intermedio canónico del deber.** La idea (el núcleo no
depende del framework) se conserva; la redacción cambia:

```text
Flutter §II: `lib/domain/` NO importa `package:flutter` (es Dart puro y se prueba sin Flutter).
React   §II: `src/domain/` NO importa `react` ni nada del DOM: es JavaScript puro y se
             prueba sin React.
```

Verificado en el repositorio:

```console
$ git grep -n "from 'react'" -- src/domain/
(sin salida)
```

**Adaptada en redacción — LSP.** Cambian los operadores porque son de cada lenguaje, no la
prohibición:

```text
Flutter §I: prohibido `is` o `as` sobre una implementación concreta en el código que
            consume la interfaz.
React   §I: prohibido `instanceof` o comparar el nombre del modo en el código que consume
            el contrato.
```

**Adaptada en redacción — ISP.** `abstract interface class` con un método → contrato
estructural con una función, porque JavaScript no tiene `interface`:

```text
Flutter §I: la interfaz de redondeo tiene exactamente un método.
React   §I: el contrato de redondeo tiene exactamente una función, `aplicar(valor)`.
```

**Reemplazada — la única.** La verificación del principio V:

```text
Flutter, tabla de verificación:
  | IV/V: análisis y documentación | `flutter analyze` (con `public_member_api_docs`) | `No issues found!` |
React, tabla de verificación:
  | IV: compilación | `npm run build` | termina sin errores |
  + Nota de migración explícita en la constitución
```

**Por qué la original no se puede conservar.** `flutter analyze` con la regla
`public_member_api_docs` **hacía fallar el análisis** si un miembro público no tenía `///`:
el principio V se cumplía automáticamente. El toolchain de este proyecto no tiene una regla
equivalente que falle por falta de JSDoc — `oxlint`, el linter que trae la plantilla de
Vite, no la trae activada. La **regla** del principio V se conserva (sigue exigiendo el
JSDoc con las cinco preguntas), pero su **mecanismo de garantía** baja a convención y
revisión manual.

Es una **pérdida real al migrar**, no una diferencia de redacción, y por eso es la única
que clasifico como reemplazada en lugar de adaptada. Queda documentada en la propia
constitución de React, en una "Nota de migración", para no perder el rastro de la garantía
que se perdió. `/speckit-analyze` la reportó como hallazgo **C1** (MEDIUM).

---

## 3. ¿Tuviste que modificar algún enunciado de la spec para implementar React?

**No. Ningún enunciado.** El diff de la spec está vacío al principio y al final del deber,
y el SHA-256 es el mismo (`423d0f60…`, evidencia en la pregunta 1).

### Qué permitió reutilizarla sin cambios

No fue suerte: fue la constitución de Flutter empujando el CÓMO fuera de la spec.

1. **El dominio ya estaba aislado por mandato.** La regla `lib/domain/ NO importa
   package:flutter` obligaba a que el núcleo del cálculo no pudiera nombrar el framework.
   Una spec escrita contra un dominio que no puede nombrar Flutter tampoco lo nombra.
2. **Los mensajes de error son contrato literal.** FR-008 fija "Debe haber al menos una
   persona" y "Monto inválido" como texto exacto. Eso los convierte en parte del QUÉ, y es
   la razón por la que las pruebas se portaron sin reescribir un solo string.
3. **Los escenarios se escribieron con números, no con widgets.** "100.00, 4 personas,
   10 % → 27.50" no tiene nada que traducir.
4. **La fórmula vive en la spec** (FR-002). El plan nuevo no tuvo que reinventar la regla
   de negocio; solo decidir dónde ponerla.

### El único enunciado candidato a cambio, documentado sin cambiarlo

Siguiendo el protocolo de la Parte 2 y la Parte 8.1:

- **Versión original (SC-004, `spec.md:160`):**
  > "La app funciona igual con el teléfono en modo avión (100 % de las funciones
  > disponibles sin conexión)."

- **Qué decisión técnica se había mezclado con el QUÉ:** nada del *framework* — ni Flutter
  ni Dart aparecen. Lo que se mezcló es la *plataforma*: el enunciado nombra el dispositivo
  (*teléfono*) y un ajuste del sistema operativo móvil (*modo avión*) como la manera de
  comprobar el criterio.

- **Por qué NO lo modifiqué:** no bloquea la implementación. Lo que el criterio exige —que
  el 100 % de las funciones estén disponibles sin conexión— se cumple y se verifica igual
  en el navegador:

  ```console
  $ git grep -nE "fetch|axios|XMLHttpRequest|localStorage|sessionStorage" -- src/
  (sin salida)
  ```

  La app no hace ninguna llamada de red ni guarda datos: una vez cargada la página,
  funciona con el navegador desconectado. "Teléfono en modo avión" es el *ejemplo de cómo
  comprobarlo*, no el criterio. Además, la Parte 3.4 exige que la spec entre al proyecto
  React como copia idéntica, y la Parte 2 dice anotar el enunciado en lugar de cambiarlo.
  Modificarlo habría destruido la evidencia del diff vacío sin ganar nada verificable.

- **Versión corregida que propondría** si el cliente quisiera una spec neutral de
  plataforma:
  > "La app funciona igual sin conexión (100 % de las funciones disponibles una vez
  > cargada)."

- **Estado:** documentado, **no aplicado**. No hay commit de corrección porque no hubo
  corrección. La evidencia del diff vacío sigue en pie y es el resultado que el deber pide
  medir.

### `/speckit-analyze` señaló lo mismo

El deber anticipaba que el análisis podía encontrar la contradicción, y la encontró —como
hallazgo de redacción, no de bloqueo:

| ID | Category | Severity | Summary |
|----|----------|----------|---------|
| F1 | Inconsistency | LOW | SC-004 comprueba el funcionamiento sin conexión con "el teléfono en modo avión"; el plan entrega un sitio estático para navegador |
| D1 | Duplication | LOW | FR-009 y SC-004 expresan la misma restricción desde dos ángulos |
| F2 | Inconsistency | LOW | La spec usa el verbo táctil "tocar"; la implementación web responde a `click` |
| C1 | Constitution | MEDIUM | El principio V pierde su verificación automática al salir del toolchain de Dart |
| U1 | Underspecification | LOW | SC-002 ("menos de 30 segundos") es un *outcome metric*, sin trabajo construible |

**0 hallazgos CRITICAL, 0 HIGH. Cobertura: 15/15 requisitos construibles con ≥ 1 tarea
(100 %).** Informe completo en
[`specs/001-divisor-cuenta/analisis-speckit.md`](specs/001-divisor-cuenta/analisis-speckit.md).

---

## 4. Compara los seis casos de aceptación de Flutter y React. ¿Cambió algún valor esperado, mensaje o escenario?

**No cambió nada: ni un valor, ni un mensaje, ni un escenario.** Lo único que cambió es la
sintaxis del lenguaje y la herramienta que los ejecuta.

| # | Escenario | Monto | Personas | Propina | Modo | Esperado | ¿Cambió? |
|---|---|---|---|---|---|---|---|
| 1 | reparto normal | 100.00 | 4 | 10 | exacto | `27.50` | No |
| 2 | sin propina | 90.00 | 3 | 0 | exacto | `30.00` | No |
| 3 | cero personas | 50.00 | 0 | 0 | exacto | "Debe haber al menos una persona" | No |
| 4 | monto no numerico | `NaN` | 4 | 0 | exacto | "Monto inválido" | No |
| 5 | redondeo exacto | 10.00 | 3 | 0 | exacto | `3.33` | No |
| 6 | redondeo hacia arriba | 10.00 | 3 | 0 | arriba | `4.00` | No |

### Evidencia: los nombres de los casos son idénticos

```console
$ diff <(grep -o "nombre: '[^']*'" ../divisor_cuenta/test/casos_de_prueba.dart) \
       <(grep -o "nombre: '[^']*'" test/casosDePrueba.js) && echo "IDENTICOS"
IDENTICOS
```

### Evidencia: los valores son idénticos

Comparando solo los valores, con la sintaxis normalizada (`double.nan` → `NaN`,
`100.00` → `100`):

```console
$ diff <(valores de casos_de_prueba.dart) <(valores de casosDePrueba.js) && echo "IDENTICOS"
>>> LOS VALORES SON IDENTICOS: mismas entradas, mismos esperados, mismos mensajes
```

### Qué sí cambió, y por qué era inevitable

| Aspecto | Flutter (Dart) | React (JavaScript) | Causa |
|---|---|---|---|
| Declaración del caso | `class CasoDivision` con campos `final` y constructor `const` | objeto literal `{ nombre, monto, … }` | Dart necesita una clase para tipar; JS no |
| "no es un número" | `double.nan` | `NaN` | El mismo valor IEEE-754, distinto nombre |
| Ausencia de valor | `double? esperado` (`null`) | campo ausente (`undefined`) | Dart usa `null`; en JS el campo simplemente no está |
| Comparación | `closeTo(esperado, 0.001)` | `toBeCloseTo(esperado, 2)` | API de cada runner |
| Generación de pruebas | `for (final caso in casos) test(...)` | `for (const caso of casos) it(...)` | Sintaxis del bucle y nombre de la función |
| Runner | `flutter test` | `npm test` (Vitest) | Herramienta de cada toolchain |

**Ninguno de estos cambios fue necesario "porque React es diferente" en el sentido que el
deber advierte.** No se tocó ninguna entrada, ningún valor esperado, ningún mensaje ni
ningún escenario. Si alguno hubiera dado distinto, el problema habría sido de la
implementación, no de la tecnología — y de hecho el edge case del ruido de punto flotante
viaja **con más razón** de la que tenía: Dart y JavaScript usan el mismo `double` de 64
bits, así que el riesgo es idéntico y la tolerancia se portó tal cual.

### Resultado de la ejecución

```console
$ npx vitest run test/division.test.js --reporter=verbose
 ✓ escenarios de aceptación de la spec > 1. reparto normal
 ✓ escenarios de aceptación de la spec > 2. sin propina
 ✓ escenarios de aceptación de la spec > 3. cero personas
 ✓ escenarios de aceptación de la spec > 4. monto no numerico
 ✓ escenarios de aceptación de la spec > 5. redondeo exacto
 ✓ escenarios de aceptación de la spec > 6. redondeo hacia arriba
 ✓ LSP: el mismo calcularDivision funciona con cualquier estrategia de redondeo
 Test Files  1 passed (1)
      Tests  7 passed (7)

$ npm test
 Test Files  4 passed (4)
      Tests  34 passed (34)

$ npm run build
✓ built in 169ms
```

**6 de 6 casos de aceptación en verde**, más la prueba de LSP, más 3 de la vista, más 24
pruebas de casos borde: **34 en total** (la rama `sdd` de Flutter declara 33).

---

## 5. ¿Qué partes del plan Flutter dejaron de tener sentido en React? Da al menos tres ejemplos concretos

El plan es donde se concentró todo el cambio:

```console
$ git diff --no-index --stat -- "../divisor_cuenta/specs/001-divisor-cuenta/plan.md" \
                                "specs/001-divisor-cuenta/plan.md"
 plan.md | 153 +++++++++++++--------
 1 file changed, 95 insertions(+), 58 deletions(-)
```

Contando **enunciados** y no líneas físicas, como pide la Parte 8.3: **25 de 30 enunciados
modificados (83,3 %)**; se conservaron 5 (`Storage: N/A`, el objetivo de rendimiento de
SC-003, la fila de seguridad del Constitution Check, la re-evaluación de la Fase 1 y
"sin violaciones de la constitución").

### Ejemplo 1 — El estado de la pantalla: `StatefulWidget` + `setState` → `useState`

```diff
-**Language/Version**: Dart 3.13 con Flutter 3.47 (canal stable)
+**Language/Version**: JavaScript (ES2022, módulos ESM) sobre Node.js 26.8.2; React 19.2
```

```text
Plan Flutter: Estado local con setState (es una sola pantalla)
              pantalla_divisor.dart  →  StatefulWidget + setState
Plan React:   Estado local con useState (es una sola pantalla)
              PantallaDivisor.jsx    →  función + useState (dentro del hook)
```

**Por qué dejó de tener sentido:** `StatefulWidget` es una clase del framework de Flutter y
`setState` un método de su `State`. React no tiene widgets ni ese ciclo de vida.
**Cómo se adaptó:** el estado pasó a cinco `useState` dentro de `useDivisor`, y la vista
quedó como una función que solo dibuja. La *idea* del plan —"estado local, es una sola
pantalla, no hace falta nada más"— sobrevivió intacta; lo que cambió fue el mecanismo.

### Ejemplo 2 — La coordinación: clase `DivisorController` → hook `useDivisor`

```text
Plan Flutter: presentation/: DivisorController (recibe sus dependencias por constructor),
              FormateadorMoneda, PantallaDivisor
Plan React:   src/presentation/: useDivisor.js (hook que RECIBE sus dependencias),
              formateadorMoneda.js y PantallaDivisor.jsx
```

**Por qué dejó de tener sentido:** una clase instanciada por pantalla no funciona en React
—se recrearía en cada render, o habría que sostenerla con `useRef`, y cambiarle un campo no
redibujaría nada. **Cómo se adaptó:** el patrón equivalente es un hook que recibe sus
dependencias como argumento. Lo importante: **DIP se conservó exactamente**. El contrato
público quedó campo por campo igual al del controlador de Dart (`modos`,
`modoSeleccionado`, `resultado`, `error`, `seleccionarModo`, `calcular`, `limpiar`), y el
hook sigue sin importar nada de `src/data/`:

```console
$ git grep -n "data/" -- src/presentation/
(sin salida)
```

### Ejemplo 3 — El contrato de redondeo: `abstract interface class` → objeto con `aplicar`

```text
Plan Flutter: la interfaz abstracta EstrategiaRedondeo (un solo método)
              abstract interface class EstrategiaRedondeo {
                double redondear(double montoPorPersona);
              }
Plan React:   estrategiaRedondeo.js (el contrato: una función aplicar(valor))
              @typedef {Object} EstrategiaRedondeo
              @property {(valor: number) => number} aplicar
```

**Por qué dejó de tener sentido:** JavaScript no tiene `interface` ni clases abstractas; no
hay nada que `implements` pueda verificar. **Cómo se adaptó:** el contrato se volvió
*estructural* (duck typing): cualquier objeto con `aplicar(valor)` sirve. ISP se conserva
(una sola función) y LSP también, verificado:

```console
$ git grep -n "instanceof\|=== 'exacto'\|=== 'arriba'" -- src/domain/calcularDivision.js
(sin salida)
```

La prueba de OCP en `test/casosBorde.test.js` lo demuestra: una estrategia inventada en la
propia prueba (`{ aplicar: (valor) => Math.floor(valor) }`) funciona con el mismo
`calcularDivision`, sin tocar una línea del domain.

### Ejemplo 4 — Los `inputFormatters` del campo de personas

```text
Plan Flutter: TextField con inputFormatters:
                FilteringTextInputFormatter.digitsOnly
                LengthLimitingTextInputFormatter(6)
Plan React:   <input> controlado con filtro en onChange:
                texto.replace(/\D/g, '').slice(0, 6)
```

**Por qué dejó de tener sentido:** `inputFormatters` es API de Flutter. **Cómo se adaptó:**
el filtrado se hace en el manejador del cambio. Y hubo que decidir algo que el plan de
Flutter no necesitaba: el campo de monto es `type="text"`, **no** `type="number"`, porque
el escenario 4 de la spec exige poder escribir "abc" y ver "Monto inválido" — con
`type="number"` ese texto nunca llegaría al validador. Es un caso donde la spec (que no
cambió) obligó a una decisión técnica nueva en el plan.

### Ejemplo 5 — Los comandos de verificación de toda la tabla del Constitution Check

```text
Flutter: grep -rn "package:flutter" lib/domain/   |  flutter test  |  flutter analyze
React:   git grep -n "from 'react'" -- src/domain/|  npm test      |  npm run build
```

**Por qué dejó de tener sentido:** son comandos de cada toolchain. **Cómo se adaptó:** uno
por uno, y con un cambio de criterio: se pasó a `git grep` porque se comporta igual en
Windows, macOS y Linux (lo recomienda la Parte 7.6 del deber). El caso de `flutter analyze`
es el único que **no** tiene equivalente y está documentado como regla reemplazada (ver
pregunta 2).

### Lo que NO cambió del plan, y por qué importa

La arquitectura de tres capas, la regla de dependencia `presentation -> domain <- data`, el
reparto de responsabilidades entre los cinco módulos del domain, la decisión de multiplicar
antes de dividir para no arrastrar el error de punto flotante, la lista de entidades, el
único punto de composición y la exigencia de que cada escenario de aceptación tenga su
prueba.

**Todo eso sobrevivió porque lo fijaban la spec y la constitución, no la tecnología.** Es
el mismo plan arquitectónico ejecutado con otras herramientas.

---

## 6. ¿Qué artefacto fue el más reusable y cuál el menos reusable?

### El más reusable: la especificación (0 % modificada)

**Evidencia:**

1. **Diff vacío y SHA-256 idéntico** (`423d0f60…`), al inicio y al final del deber.
2. **El historial de Git lo confirma**: el commit `spec kit + la misma spec del proyecto
   flutter` introdujo la spec y **ningún commit posterior la toca**.

   ```console
   $ git log --oneline -- specs/001-divisor-cuenta/spec.md
   a328193 spec kit + la misma spec del proyecto flutter
   ```

3. **0 enunciados CÓMO** de 53, y 0 menciones a Flutter, Dart, sus paquetes o sus carpetas.

**Por qué:** porque solo describe **qué** hace el sistema, con números y mensajes literales
en lugar de clases y carpetas. Un criterio como "100.00, 4 personas, 10 % → 27.50" no tiene
nada que traducir.

**Empate técnico — los criterios de aceptación.** Van dentro de la spec, así que comparten
su 0 % de cambio, pero merecen mención aparte porque son la parte que el deber mide con
`SC-001`: los 6 escenarios conservan entradas, valores esperados y mensajes **byte por
byte** (pregunta 4), y por eso las pruebas se portaron sin reescribir un solo valor.

### El menos reusable: el código fuente (100 % rehecho)

**Evidencia:**

1. **No se reutilizó una sola línea.** Las 523 líneas de Dart de `lib/` no aportaron nada
   al proyecto React; `src/` son 555 líneas nuevas de JavaScript.
2. **Ni un archivo conservó su nombre**, porque hasta la convención cambió
   (`snake_case.dart` → `camelCase.js`):

   | Flutter | React |
   |---|---|
   | `lib/domain/calcular_division.dart` | `src/domain/calcularDivision.js` |
   | `lib/domain/estrategia_redondeo.dart` | `src/domain/estrategiaRedondeo.js` |
   | `lib/data/redondeo_hacia_arriba.dart` | `src/data/redondeoHaciaArriba.js` |
   | `lib/presentation/divisor_controller.dart` | `src/presentation/useDivisor.js` |
   | `lib/presentation/pantalla_divisor.dart` | `src/presentation/PantallaDivisor.jsx` |
   | `lib/main.dart` | `src/main.jsx` |

3. **Hasta las construcciones del lenguaje desaparecieron:** `abstract interface class`,
   `const` constructors, `double?`, `is`/`as`, `late`, `@override`. Ninguna existe en
   JavaScript.

**Por qué:** el código es la encarnación final del CÓMO. Cambiar la tecnología es, por
definición, cambiar el código.

**El plan y las tareas quedan segundos** en el ranking de "menos reusable": el plan
modificó **83,3 %** de sus enunciados y las tareas se rehicieron por completo (35 nuevas +
3 de convergencia). Se salvan del último puesto porque conservaron su *estructura* y sus
decisiones arquitectónicas; el código no conservó nada.

### El ranking completo, medido

| Artefacto | Cambio medido | Evidencia |
|---|---:|---|
| **Especificación** | **0 %** | diff vacío, SHA-256 idéntico, sin commits posteriores |
| Criterios de aceptación | **0 %** | `diff` de nombres y valores: idénticos |
| Casos de prueba (significado) | **0 %** | mismas entradas, esperados y mensajes |
| Constitución | **58,1 %** de reglas reescritas | 13 idénticas / 17 adaptadas / 1 reemplazada, de 31 |
| Casos de prueba (sintaxis) | 100 % reescrita | `.dart` → `.js`, `closeTo` → `toBeCloseTo` |
| Plan | **83,3 %** de enunciados | 95 añadidas / 58 eliminadas |
| Tareas | ~100 % | 35 tareas nuevas + 3 de convergencia |
| **Código** | **100 %** | 523 líneas de Dart → 555 de JavaScript, 0 reutilizadas |

### La respuesta a la pregunta central del deber

> **Cuando cambia la tecnología, ¿qué parte del conocimiento del sistema sobrevive y qué
> parte debe reconstruirse?**

Sobrevivió **el QUÉ**: qué hace el sistema, con qué números, con qué mensajes, bajo qué
reglas de negocio y con qué principios de arquitectura. Se reconstruyó **el CÓMO**: con qué
lenguaje, con qué librería, en qué carpetas, con qué clases y con qué comandos.

La hipótesis del enunciado se sostiene en este repositorio, y se sostiene en el extremo
fuerte: **la spec no cambió en absoluto** (0 de 53 enunciados), mientras el código se
rehizo por completo. Pero el resultado no fue gratis, y conviene no leerlo como una
propiedad automática de SDD:

- La spec viajó limpia **porque la constitución la obligó a ser limpia**. La regla
  `lib/domain/ NO importa package:flutter` empujó el framework fuera del núcleo, y un
  núcleo que no puede nombrar Flutter produce una spec que tampoco lo nombra.
- El único enunciado con vocabulario de plataforma (SC-004) no apareció en el QUÉ puro,
  sino en un **criterio de verificación** — justo donde es más fácil colar un supuesto de
  plataforma sin darse cuenta.
- Y migrar **cuesta algo que no se ve en los porcentajes**: el principio V conservó su
  regla pero perdió el linter que la hacía cumplir. Un artefacto puede "viajar" y aun así
  llegar más débil al destino.

El 0 % de la spec es el titular. Los otros dos son la letra pequeña, y las tres cosas
salieron de medir el repositorio en lugar de dar la hipótesis por buena.
