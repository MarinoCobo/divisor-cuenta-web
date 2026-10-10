# Análisis: separar el QUÉ del CÓMO

**Deber 2 — SDD: cambiar la tecnología sin cambiar la especificación**
Programación Asistida de Aplicaciones · USFQ

Artefactos analizados:

| Artefacto | Ruta (proyecto Flutter, rama `sdd`) |
|---|---|
| Especificación | `specs/001-divisor-cuenta/spec.md` |
| Constitución | `.specify/memory/constitution.md` |
| Plan (referencia Parte 8.3) | `specs/001-divisor-cuenta/plan.md` |
| Casos de prueba (referencia Parte 8.2) | `test/casos_de_prueba.dart` |

Feature activo en el proyecto React: `specs/001-divisor-cuenta`
(`SPECIFY_FEATURE_DIRECTORY=specs/001-divisor-cuenta`).

---

## 0. Criterio de clasificación (declarado antes de contar)

Para que el conteo sea reproducible y no dependa del gusto, aplico estas reglas:

1. **Unidad de conteo = enunciado atómico**, no línea física de Markdown. Una viñeta con
   dos ideas independientes cuenta como dos; una regla de tres palabras cuenta como una.
   Un requisito `FR-xxx` que ocupa tres líneas cuenta como uno.
2. **Pregunta única:** *¿este enunciado seguiría siendo válido si la app estuviera hecha
   en React?*
   - Sí, igual → **QUÉ**
   - No, deja de tener sentido → **CÓMO**
   - La idea vale pero la redacción debe cambiar → **MIXTO**
3. **Qué cuenta como MIXTO:** el enunciado nombra un artefacto de la plataforma o del
   framework anterior (`package:flutter`, `Dart`, `lib/`, `main.dart`, teléfono, app
   móvil) que hay que reescribir para que el enunciado siga siendo *literalmente* cierto
   en React.
4. **Qué NO cuenta como MIXTO:** el verbo de interacción ("tocar" → "hacer clic"). Es una
   adaptación **léxica transversal**: cambia la palabra, no cambia la regla verificable ni
   la prueba que la comprueba. Se reporta aparte, en la sección 3, para no inflar el
   conteo de MIXTOS con 18 ocurrencias de un mismo fenómeno.

Este criterio se declara de antemano justamente porque el umbral del 30 % del deber es
sensible a cómo se cuenta.

---

## 1. Especificación — enunciado por enunciado

### 1.1 Clarifications (sesión 2026-10-01)

| # | Enunciado de la spec | Tipo | ¿Viaja a React? | Justificación |
|---|---|---|---|---|
| E-01 | En modo exacto la diferencia de centavos se ignora; solo se muestra el monto por persona redondeado | QUÉ | Intacto | Decisión de producto sobre el resultado, no sobre la tecnología |
| E-02 | Un monto igual a 0.00 no es válido: muestra "Monto inválido" | QUÉ | Intacto | Regla de validación verificable en cualquier lenguaje |
| E-03 | El resultado se borra en cuanto cambia cualquier entrada y reaparece solo al calcular | QUÉ | Intacto | Regla de comportamiento; en React la cumple `useState`, pero la regla no nombra la herramienta |

### 1.2 User Story 1 — Calcular cuánto paga cada persona (P1)

| # | Enunciado de la spec | Tipo | ¿Viaja a React? | Justificación |
|---|---|---|---|---|
| E-04 | El usuario escribe monto, personas y propina, calcula y ve cuánto paga cada persona con dos decimales | QUÉ | Intacto | Comportamiento del sistema |
| E-05 | Prioridad P1: es la razón de ser de la app; sin esto no hay producto | QUÉ | Intacto | Justificación de alcance, independiente del framework |
| E-06 | Prueba independiente: ingresar monto, personas y propina en modo exacto y comprobar el monto mostrado | QUÉ | Intacto | Criterio de verificación; cambia el runner, no el criterio |
| E-07 | 100.00, 4 personas, 10 % y modo exacto → 27.50 por persona | QUÉ | Intacto | Criterio verificable con valores concretos |
| E-08 | 90.00, 3 personas, 0 % y modo exacto → 30.00 por persona | QUÉ | Intacto | Criterio verificable |
| E-09 | 10.00, 3 personas, 0 % y modo exacto → 3.33 por persona | QUÉ | Intacto | Criterio verificable |

### 1.3 User Story 2 — Aviso claro cuando la entrada es inválida (P2)

| # | Enunciado de la spec | Tipo | ¿Viaja a React? | Justificación |
|---|---|---|---|---|
| E-10 | Con una entrada que no permite calcular, la app dice qué está mal y no muestra resultado | QUÉ | Intacto | Comportamiento del sistema |
| E-11 | Prioridad P2: un resultado incorrecto mostrado con seguridad es peor que no mostrar nada | QUÉ | Intacto | Razón de producto |
| E-12 | Prueba independiente: comprobar el mensaje exacto y la ausencia de resultado | QUÉ | Intacto | Criterio de verificación |
| E-13 | 50.00 y 0 personas → "Debe haber al menos una persona" y NO se muestra resultado | QUÉ | Intacto | Criterio verificable, mensaje literal |
| E-14 | Monto "abc" → "Monto inválido" y NO se muestra resultado | QUÉ | Intacto | Criterio verificable, mensaje literal |

### 1.4 User Story 3 — Elegir redondear hacia arriba (P3)

| # | Enunciado de la spec | Tipo | ¿Viaja a React? | Justificación |
|---|---|---|---|---|
| E-15 | El usuario puede elegir que el monto por persona se redondee hacia arriba al entero más cercano | QUÉ | Intacto | Regla de negocio opcional |
| E-16 | Prioridad P3: es una comodidad; la app ya es útil sin ella | QUÉ | Intacto | Razón de alcance |
| E-17 | Prueba independiente: el mismo caso en los dos modos; solo cambia el redondeo | QUÉ | Intacto | Criterio de verificación |
| E-18 | 10.00, 3 personas, 0 % y modo hacia arriba → 4.00 por persona | QUÉ | Intacto | Criterio verificable |
| E-19 | 90.00, 3 personas, 0 % y modo hacia arriba → 30.00 (un entero no sube) | QUÉ | Intacto | Criterio verificable |

### 1.5 Edge Cases

| # | Enunciado de la spec | Tipo | ¿Viaja a React? | Justificación |
|---|---|---|---|---|
| E-20 | Monto vacío, no numérico, negativo, cero, mayor a 1 000 000 000 o con más de un separador decimal → "Monto inválido" | QUÉ | Intacto | Regla de validación |
| E-21 | Personas vacío o cero → "Debe haber al menos una persona" | QUÉ | Intacto | Regla de validación |
| E-22 | El campo de personas solo admite dígitos (hasta 6): no se pueden escribir negativos, decimales ni letras | QUÉ | Intacto | Restricción de entrada observable. En Flutter la cumplía `FilteringTextInputFormatter`; en React, `inputMode`/filtro en `onChange`. El enunciado no nombra ninguna de las dos |
| E-23 | Propina vacía se interpreta como 0 % | QUÉ | Intacto | Valor por defecto del dominio |
| E-24 | Propina negativa, mayor a 100 % o no numérica → "Propina inválida" | QUÉ | Intacto | Regla de validación |
| E-25 | Varias entradas inválidas a la vez → un solo mensaje, en orden monto → personas → propina | QUÉ | Intacto | Regla de precedencia, verificable |
| E-26 | El monto máximo con 100 % de propina y 1 persona, o 999 999 personas, sigue calculando bien con dos decimales | QUÉ | Intacto | Criterio de precisión numérica |
| E-27 | Un valor por persona que ya es entero (30.00) no sube a 31.00 en modo hacia arriba | QUÉ | Intacto | Regla de redondeo |
| E-28 | El ruido de punto flotante (27.500000000000004) no cambia el resultado mostrado | QUÉ | Intacto | Viaja **con más razón**: Dart y JavaScript usan el mismo `double` IEEE-754 de 64 bits, así que el riesgo es idéntico y la tolerancia se porta igual |

### 1.6 Functional Requirements

| # | Enunciado de la spec | Tipo | ¿Viaja a React? | Justificación |
|---|---|---|---|---|
| E-29 | FR-001: una sola pantalla con tres campos, un selector de modo de redondeo y un botón "Calcular" | QUÉ | Intacto | "Pantalla" describe una vista única, no un `Scaffold`. Una SPA de React la cumple igual |
| E-30 | FR-002: monto por persona = (monto × (1 + propina / 100)) / personas, redondeado según el modo | QUÉ | Intacto | Fórmula de negocio |
| E-31 | FR-003: el resultado se muestra siempre con exactamente dos decimales | QUÉ | Intacto | Regla de presentación del dato, no de la tecnología |
| E-32 | FR-004: el modo "exacto" redondea al centavo más cercano (mitad hacia arriba) | QUÉ | Intacto | Regla de redondeo |
| E-33 | FR-005: el modo "hacia arriba" redondea al entero inmediatamente superior, salvo que ya sea entero | QUÉ | Intacto | Regla de redondeo |
| E-34 | FR-006: el usuario puede elegir el modo; el modo inicial es "exacto" | QUÉ | Intacto | Comportamiento y estado inicial |
| E-35 | FR-007: con entradas inválidas, un único mensaje de error y ningún resultado, ni el de un cálculo anterior | QUÉ | Intacto | Regla de comportamiento |
| E-36 | FR-008: "Debe haber al menos una persona" y "Monto inválido" se muestran con ese texto exacto | QUÉ | Intacto | Contrato literal de texto; es lo que hace que las pruebas se puedan portar sin reescribir valores |
| E-37 | FR-009: la app funciona sin conexión: no usa red ni guarda datos | QUÉ | Intacto | Restricción de arquitectura expresada como comportamiento. En React significa "sin `fetch` ni backend" |
| E-38 | FR-010: acepta tanto el punto como la coma como separador decimal en el monto y en la propina | QUÉ | Intacto | Regla de parseo de entrada |
| E-39 | FR-011: si cambia el monto, las personas, la propina o el modo después de calcular, el resultado visible se borra | QUÉ | Intacto | Regla de comportamiento |
| E-40 | FR-012: el monto total debe ser mayor que 0; un monto igual a 0 es inválido | QUÉ | Intacto | Regla de validación |
| E-41 | FR-013: muestra solo el monto por persona; NO reparte la diferencia de centavos | QUÉ | Intacto | Límite de alcance del cálculo |

### 1.7 Key Entities

| # | Enunciado de la spec | Tipo | ¿Viaja a React? | Justificación |
|---|---|---|---|---|
| E-42 | **Cuenta**: monto total, número de personas y porcentaje de propina, ya validados | QUÉ | Intacto | Entidad del dominio; no dice si es `class`, `record` u objeto literal |
| E-43 | **Resultado**: el monto que paga cada persona, ya redondeado | QUÉ | Intacto | Entidad del dominio |
| E-44 | **Modo de redondeo**: la regla que convierte el monto sin redondear en el monto a pagar | QUÉ | Intacto | Entidad del dominio; es el enunciado que habilita OCP/LSP en las dos tecnologías |

### 1.8 Success Criteria

| # | Enunciado de la spec | Tipo | ¿Viaja a React? | Justificación |
|---|---|---|---|---|
| E-45 | SC-001: los 6 escenarios de aceptación producen exactamente el resultado o el mensaje esperado (6 de 6) | QUÉ | Intacto | Criterio medible; es literalmente la métrica del deber |
| E-46 | SC-002: un usuario que abre la app por primera vez obtiene el monto en menos de 30 segundos | QUÉ | Intacto | Criterio de usabilidad medible |
| E-47 | SC-003: el resultado aparece en menos de 1 segundo después de calcular | QUÉ | Intacto | Criterio de rendimiento medible |
| E-48 | SC-004: la app funciona igual **con el teléfono en modo avión** (100 % de las funciones disponibles sin conexión) | **MIXTO** | **Adaptado** | La **idea** —funciona 100 % sin conexión— viaja intacta y es la misma que FR-009. La **redacción** nombra un artefacto móvil: en React se lee "con el navegador sin conexión, una vez cargada la página". Único enunciado de la spec con vocabulario de plataforma |

### 1.9 Assumptions

| # | Enunciado de la spec | Tipo | ¿Viaja a React? | Justificación |
|---|---|---|---|---|
| E-49 | La propina se calcula sobre el monto total ingresado (no hay impuestos aparte) | QUÉ | Intacto | Supuesto de negocio |
| E-50 | Moneda única y sin símbolo; el resultado es un número con dos decimales | QUÉ | Intacto | Supuesto de presentación del dato |
| E-51 | El resultado se calcula solo al calcular, no mientras el usuario escribe | QUÉ | Intacto | Regla de comportamiento |
| E-52 | No hay historial, cuentas de usuario ni división desigual: fuera del alcance del MVP | QUÉ | Intacto | Límite de alcance |
| E-53 | Los límites (monto, propina, personas) existen para garantizar centavos sin error de precisión; una propina mayor que la cuenta se considera error de tipeo | QUÉ | Intacto | Razón de las reglas de validación |

---

## 2. El conteo de la spec

| Categoría | Enunciados | % |
|---|---:|---:|
| **QUÉ** (viaja intacto) | 52 | **98,1 %** |
| **MIXTO** (la idea viaja, la redacción se adapta) | 1 | **1,9 %** |
| **CÓMO** (no viaja) | 0 | **0,0 %** |
| **Total analizado** | **53** | 100 % |

Aplicando la fórmula del deber:

```text
% CÓMO = 0 enunciados CÓMO
         ─────────────────── × 100 = 0,0 %
         53 enunciados totales
```

Los enunciados MIXTOS se reportan aparte y no se cuentan como CÓMO, según la regla del
enunciado.

**Contra el umbral:** 0,0 % de enunciados CÓMO, muy por debajo del **30 %** que este deber
fija como señal de spec contaminada. Ese 30 % es un **umbral pedagógico de este deber, no
una regla universal de SDD**.

### 2.1 Evidencia objetiva del conteo

El conteo no depende solo de mi juicio. La spec se puede auditar por vocabulario:

```console
$ cd ~/Projects/divisor_cuenta_web/specs/001-divisor-cuenta
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

$ grep -nE '\biOS\b|\bAndroid\b' spec.md | wc -l
0

$ grep -nE 'teléfono|modo avión' spec.md
160:- **SC-004**: La app funciona igual con el teléfono en modo avión (100 % de las funciones
```

**Cero** menciones a Flutter, Dart, sus paquetes, sus clases o sus carpetas. Una sola línea
nombra un artefacto de plataforma, y es exactamente el enunciado E-48 que clasifiqué como
MIXTO.

> Nota metodológica: una búsqueda ingenua `grep -i "ios"` devuelve 6 coincidencias, pero
> todas son la palabra **"escenar-ios"**. Con límite de palabra (`\biOS\b`) el resultado es
> 0. Lo anoto porque el falso positivo invitaba a concluir que la spec mencionaba iOS, y no
> lo hace.

---

## 3. Adaptación léxica transversal (reportada aparte)

| Fenómeno | Ocurrencias en `spec.md` | Tratamiento |
|---|---:|---|
| "toca" / "tocar" (el botón "Calcular") | 18 | Adaptación léxica: en React se lee "hace clic". No cambia ninguna regla verificable ni ningún valor esperado |
| "pantalla" | 3 | No requiere adaptación: describe una vista única, válida en móvil y en web |

**Por qué esto no son 18 enunciados MIXTOS.** La prueba que verifica E-07 en Flutter hace
`tester.tap(find.text('Calcular'))`; en React hace
`fireEvent.click(screen.getByText('Calcular'))`. Cambia la llamada del runner, no cambia el
escenario, ni la entrada, ni el valor esperado. Contarlos como MIXTOS convertiría un solo
fenómeno de vocabulario en el 34 % de la spec y haría parecer contaminado un artefacto que
no lo está.

**Sensibilidad del resultado.** Para que el lector pueda juzgar el criterio:

| Criterio de conteo | QUÉ intacto | MIXTO | CÓMO |
|---|---:|---:|---:|
| El declarado en la sección 0 (el que uso) | 98,1 % | 1,9 % | 0,0 % |
| Contando además "tocar" como MIXTO (18 enunciados afectados) | 64,2 % | 35,8 % | 0,0 % |

En los dos criterios el resultado que importa es el mismo: **el % de CÓMO es 0 y ningún
enunciado de la spec tuvo que rehacerse.** Lo que cambia es cuánto del QUÉ se cuenta como
"necesitó retoque de palabras".

---

## 4. ¿Hubo que modificar la spec para implementar React?

**No.** La copia de la spec en el proyecto React es byte por byte la del proyecto Flutter:

```console
$ git diff --no-index -- ../divisor_cuenta/specs/001-divisor-cuenta/spec.md \
                         specs/001-divisor-cuenta/spec.md
$ echo "exit: $?"
exit: 0

$ sha256sum ../divisor_cuenta/specs/001-divisor-cuenta/spec.md \
            specs/001-divisor-cuenta/spec.md
423d0f601d02be1acc03b8edb9431905d6f13350947bc36082446fcf1d6a6dfb  ../divisor_cuenta/.../spec.md
423d0f601d02be1acc03b8edb9431905d6f13350947bc36082446fcf1d6a6dfb  specs/001-divisor-cuenta/spec.md
```

### El único enunciado candidato a cambio: E-48 (SC-004)

Siguiendo el protocolo de la Parte 2, lo documento **sin modificarlo**:

- **Versión original:** "La app funciona igual con el teléfono en modo avión (100 % de las
  funciones disponibles sin conexión)."
- **Qué tiene de CÓMO:** nombra el dispositivo (*teléfono*) y un ajuste del sistema
  operativo móvil (*modo avión*) como manera de comprobar el criterio.
- **Por qué NO lo modifiqué:** el enunciado **no bloquea** la implementación en React. Lo
  que exige —que el 100 % de las funciones estén disponibles sin conexión— se cumple y se
  verifica igual: la app no hace ninguna llamada de red, lo que se comprueba con
  `git grep -nE "fetch|axios|XMLHttpRequest|localStorage" -- src/` sin salida. "Teléfono en
  modo avión" es el *ejemplo de cómo comprobarlo*, no el criterio. La Parte 3.4 exige que la
  spec entre al proyecto React como copia idéntica, y la Parte 2 dice anotar el enunciado en
  lugar de cambiarlo. Modificarlo habría roto la evidencia del diff vacío sin ganar nada
  verificable.
- **Redacción que propondría** si el cliente quisiera una spec neutral de plataforma:
  "La app funciona igual sin conexión (100 % de las funciones disponibles una vez cargada)."
- **Estado:** documentado, no aplicado. El diff de la spec sigue vacío.

---

## 5. La Constitution — regla por regla

Para la Constitution **no** se usa QUÉ/CÓMO/MIXTO: se clasifica cada regla como
**idéntica**, **adaptada en redacción** o **reemplazada** (Parte 4 del deber).

### 5.1 Principio I — Calidad de código (SOLID)

| # | Regla (Flutter) | Clasificación | Equivalente en React | Justificación |
|---|---|---|---|---|
| R-01 | El código DEBE respetar los cinco principios SOLID | **Idéntica** | igual | SOLID es independiente del lenguaje |
| R-02 | SRP: cada clase tiene una sola responsabilidad; la que calcula NO valida NI formatea (no contiene `toStringAsFixed`, ni textos de error, ni parseo) | **Adaptada en redacción** | el módulo que calcula no contiene `toFixed`, ni textos de error, ni parseo | Misma regla; cambia el nombre del método de formato de Dart (`toStringAsFixed`) por el de JS (`toFixed`), y "clase" por "módulo o función" |
| R-03 | OCP: un modo nuevo = clase nueva que implementa la interfaz, registrada en `main.dart`; no se edita ninguna clase de `lib/domain/`, `lib/data/`, `lib/presentation/` | **Adaptada en redacción** | módulo nuevo en `src/data/`, registrado en `src/main.jsx`; no se edita nada de `src/domain/`, `src/data/`, `src/presentation/` | La idea (extender sin modificar) se conserva; cambian las rutas y `main.dart` → `main.jsx` |
| R-04 | LSP: prohibido `is` o `as` sobre una implementación concreta en el código que consume la interfaz | **Adaptada en redacción** | prohibido `instanceof` o comparar el modo por igualdad en el consumidor | Misma prohibición; `is`/`as` son operadores de Dart, en JS el equivalente es `instanceof` |
| R-05 | ISP: interfaces pequeñas; la interfaz de redondeo tiene exactamente un método | **Adaptada en redacción** | el contrato de redondeo es una sola función `aplicar(valor)` | JavaScript no tiene `interface`; el contrato se expresa como objeto con una función. La idea (una sola operación) es idéntica |
| R-06 | DIP: `lib/presentation/` depende de abstracciones de `lib/domain/` y NUNCA importa `lib/data/` | **Adaptada en redacción** | `src/presentation/` depende de `src/domain/` y nunca importa `src/data/` | Solo cambia el prefijo de carpeta |
| R-07 | Razón: estas reglas permiten cambiar comportamiento tocando un solo lugar y probar cada pieza por separado | **Idéntica** | igual | Justificación independiente de la tecnología |

### 5.2 Principio II — Arquitectura por capas

| # | Regla (Flutter) | Clasificación | Equivalente en React | Justificación |
|---|---|---|---|---|
| R-08 | Capas obligatorias: `lib/presentation/`, `lib/domain/`, `lib/data/` | **Adaptada en redacción** | `src/presentation/`, `src/domain/`, `src/data/` | Las tres capas se conservan; `lib/` es la convención de Dart, `src/` la de Vite |
| R-09 | Regla de dependencia: `presentation -> domain <- data`; `domain` no importa de las otras dos; `data` solo importa de `domain` | **Idéntica** | igual, palabra por palabra | No contiene **ningún** término tecnológico. Es el enunciado más reusable de toda la constitución |
| R-10 | `lib/domain/` NO importa `package:flutter` (es Dart puro y se prueba sin Flutter) | **Adaptada en redacción** | `src/domain/` no importa `react` ni nada del DOM: es JavaScript puro y se prueba sin React | Caso intermedio canónico del deber: la **idea** (el núcleo no depende del framework) se conserva; la **redacción** cambia `package:flutter` por `react` |
| R-11 | `lib/main.dart` es el ÚNICO archivo donde se instancian implementaciones concretas de `lib/data/` | **Adaptada en redacción** | `src/main.jsx` es el único punto de composición | Mismo principio de un solo punto de composición; cambia el nombre del archivo |
| R-12 | Razón: el núcleo del cálculo queda aislado del framework y de los detalles concretos | **Idéntica** | igual | Justificación independiente de la tecnología |

### 5.3 Principio III — Seguridad

| # | Regla (Flutter) | Clasificación | Equivalente en React | Justificación |
|---|---|---|---|---|
| R-13 | Nunca se guardan secretos, contraseñas, tokens ni API keys en el repositorio | **Idéntica** | igual | Restricción de seguridad; no depende de ninguna tecnología |
| R-14 | Razón: todo lo que entra al repositorio se considera público | **Idéntica** | igual | Justificación universal |

### 5.4 Principio IV — Calidad y pruebas

| # | Regla (Flutter) | Clasificación | Equivalente en React | Justificación |
|---|---|---|---|---|
| R-15 | Toda funcionalidad crítica (cálculo, validación, redondeo) tiene pruebas automatizadas | **Idéntica** | igual | Regla de calidad independiente del runner |
| R-16 | Cada escenario de aceptación se convierte en al menos una prueba ejecutable cuyo nombre identifica el escenario | **Idéntica** | igual | Es la regla que permitió portar `casos_de_prueba.dart` a `casosDePrueba.js` conservando los nombres `1.` a `6.` |
| R-17 | `flutter test` y `flutter analyze` DEBEN terminar sin fallos ni issues antes de dar una tarea por terminada | **Adaptada en redacción** | `npm test` y `npm run build` deben terminar sin fallos | La exigencia (pruebas en verde y análisis limpio antes de cerrar una tarea) es idéntica; cambian los comandos |
| R-18 | Razón: un criterio de aceptación que no se ejecuta no se puede demostrar | **Idéntica** | igual | Justificación universal |

### 5.5 Principio V — Regla de la materia

| # | Regla (Flutter) | Clasificación | Equivalente en React | Justificación |
|---|---|---|---|---|
| R-19 | Toda función generada por el agente debe poder explicarla el estudiante: qué hace, por qué existe, qué recibe, qué devuelve y qué errores produce | **Idéntica** | igual | El deber la repite palabra por palabra en el prompt de la Parte 4. Es una regla sobre la persona, no sobre el código |
| R-20 | Toda clase y miembro público de `lib/` lleva un comentario `///` que responde esas cinco preguntas | **Adaptada en redacción** | todo módulo y función exportada de `src/` lleva un bloque JSDoc `/** */` que responde esas cinco preguntas | La exigencia de documentar se conserva; cambia la sintaxis de documentación (`///` de Dart → JSDoc) y la ruta |

### 5.6 Tabla de "Verificación de cumplimiento"

Esta sección de la constitución es la más dependiente de la tecnología: son comandos.

| # | Verificación (Flutter) | Clasificación | Equivalente en React |
|---|---|---|---|
| R-21 | `grep -rn "package:flutter" lib/domain/` → sin salida | **Adaptada en redacción** | `git grep -n "from 'react'" -- src/domain/` → sin salida |
| R-22 | `grep -rnE "RedondeoExacto\(\)\|RedondeoHaciaArriba\(\)" lib/` → solo `main.dart` | **Adaptada en redacción** | `git grep -n "redondeoExacto\|redondeoHaciaArriba" -- src/` → fuera de `src/data/`, solo `src/main.jsx` |
| R-23 | `grep -rn "data/" lib/presentation/` → sin salida | **Adaptada en redacción** | `git grep -n "data/" -- src/presentation/` → sin salida |
| R-24 | `grep -nE "is Redondeo\|as Redondeo" lib/domain/calcular_division.dart` → sin salida | **Adaptada en redacción** | `git grep -n "instanceof\|=== 'exacto'\|=== 'arriba'" -- src/domain/calcularDivision.js` → sin salida |
| R-25 | `grep -nE "toStringAsFixed\|inválido\|al menos una persona" lib/domain/calcular_division.dart` → sin salida | **Adaptada en redacción** | `git grep -n "toFixed\|inválido\|al menos una persona" -- src/domain/calcularDivision.js` → sin salida |
| R-26 | `grep -rniE "api[_-]?key\|secret\|password\|token" lib/` → sin salida | **Adaptada en redacción** | igual sobre `src/` |
| R-27 | `flutter test` → todas en verde | **Adaptada en redacción** | `npm test` → todas en verde |
| R-28 | `flutter analyze` con `public_member_api_docs` → `No issues found!` | **REEMPLAZADA** | `npm run build` sin errores + `npx oxlint` + revisión manual del JSDoc |

**R-28 es la única regla reemplazada, y hay que justificarlo.** `flutter analyze` con la
regla `public_member_api_docs` **hace cumplir automáticamente** el principio V: si un
miembro público no tiene `///`, el análisis falla. En el toolchain de este proyecto React no
existe un equivalente que falle por falta de JSDoc (`oxlint`, el linter que trae la
plantilla de Vite, no trae esa regla activada). Es decir: la **regla** del principio V
(R-19, R-20) se conserva, pero su **mecanismo de verificación automática** no tiene
traducción y baja a convención + revisión manual. Esto es una **pérdida real de garantía**
al migrar, no una simple diferencia de redacción, y por eso la clasifico como reemplazada en
lugar de adaptada.

### 5.7 Governance

| # | Regla (Flutter) | Clasificación | Justificación |
|---|---|---|---|
| R-29 | La constitución está por encima de cualquier otra práctica; spec, plan y tareas DEBEN cumplirla; `/speckit-analyze` reporta contradicciones | **Idéntica** | Regla de proceso de Spec Kit, no de Flutter |
| R-30 | Si una verificación falla, se corrige desde el artefacto que define la regla, no parchando el código a mano | **Idéntica** | Regla de proceso SDD |
| R-31 | Las enmiendas se documentan y suben la versión (MAJOR / MINOR / PATCH) | **Idéntica** | Regla de versionado, independiente de la tecnología |

### 5.8 El conteo de la Constitution

| Clasificación | Reglas | % |
|---|---:|---:|
| **Idéntica** | 13 | **41,9 %** |
| **Adaptada en redacción** | 17 | **54,8 %** |
| **Reemplazada** | 1 | **3,2 %** |
| **Total** | **31** | 100 % |

**Reglas nuevas en la constitución React sin equivalente en la de Flutter: 0.** Verificado
regla por regla; el prompt de la Parte 4 pedía explícitamente "sin inventar otros" y el
agente no agregó ninguno.

**Reglas de Flutter perdidas en React: 0.** Las 31 tienen destino: 13 iguales, 17
reescritas, 1 con su mecanismo de verificación reemplazado.

---

## 6. Contraste con la hipótesis del deber

| Artefacto | Hipótesis del enunciado | Lo que midió este repositorio |
|---|---|---|
| Especificación | "debería cambiar poco" | **Se confirma, y de forma fuerte: cambió 0 %.** Diff vacío, mismo SHA-256, 0 enunciados CÓMO |
| Criterios de aceptación | "deberían conservarse" | **Se confirma:** los 6 escenarios conservan entradas, valores esperados y mensajes literales |
| Casos de prueba | "deberían conservar su significado" | **Se confirma:** mismo significado, distinta sintaxis (ver Parte 8.2 en `respuestas.md`) |
| Constitución | "debería conservar principios, con redacción adaptada" | **Se confirma:** 0 principios eliminados; 54,8 % de reglas reescritas en su redacción. Matiz: 1 regla perdió su verificación automática |
| Plan | "debería cambiar bastante" | **Se confirma** (ver Parte 8.3 en `respuestas.md`) |
| Tareas | "deberían cambiar bastante" | **Se confirma** |
| Código | "debería rehacerse" | **Se confirma:** 0 líneas de Dart reutilizables; se reescribió el 100 % |

### Por qué la spec viajó tan limpia

No fue suerte: la constitución de Flutter ya empujaba el QUÉ fuera de la spec.

1. **El dominio ya estaba aislado por mandato.** R-10 obligaba a que `lib/domain/` no
   importara `package:flutter`. Un dominio que no puede nombrar el framework produce una
   spec que tampoco lo nombra.
2. **Los mensajes de error son contrato literal, no detalle de UI.** E-36 (FR-008) fija
   "Debe haber al menos una persona" y "Monto inválido" como texto exacto. Eso convirtió los
   mensajes en parte del QUÉ y es la razón por la que las pruebas se portan sin tocar un
   solo string.
3. **Los escenarios se escribieron con números, no con widgets.** "100.00, 4 personas,
   10 % → 27.50" no tiene nada que traducir.
4. **La fórmula vive en la spec (E-30).** Al estar el QUÉ aritmético en la spec, el plan
   nuevo no tuvo que reinventarlo; solo decidió dónde ponerlo.

### Dónde sí se concentró el CÓMO

El CÓMO no desapareció: estaba en el plan, no en la spec. Esa es la separación que SDD
promete, y en este repositorio se sostiene.

