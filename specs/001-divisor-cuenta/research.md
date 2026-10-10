# Research: Divisor de cuenta en React

Fase 0 del plan. Cada decisión responde a un requisito de la spec (que no se tocó) o a
una regla de la constitución.

## 1. ¿Cómo se guarda el estado de una sola vista?

**Decisión:** `useState` dentro del hook `useDivisor`, sin librerías externas.

**Por qué:** la spec describe una sola vista con tres campos y un resultado (FR-001). El
estado no se comparte entre rutas ni sobrevive a una recarga (FR-009: no se guardan
datos). Redux, Zustand o TanStack Query resolverían problemas que esta app no tiene.

**Alternativas descartadas:** `useReducer` (el estado tiene cuatro campos planos y una
sola transición real, "calcular"; un reducer añade indirección sin quitar nada);
Context (no hay nada que compartir entre componentes porque hay un solo componente).

## 2. ¿Cómo se expresa en JavaScript un contrato que en Dart era `abstract interface class`?

**Decisión:** un objeto con una sola función, `aplicar(valor)`, documentado en
`src/domain/estrategiaRedondeo.js` como contrato (JSDoc `@typedef`), sin clase.

**Por qué:** JavaScript no tiene `interface`. El contrato se vuelve estructural: cualquier
objeto con `aplicar(valor)` sirve. Esto conserva ISP (una sola función) y LSP (el
consumidor nunca pregunta el tipo). El archivo existe aunque no genere código en tiempo de
ejecución, porque es donde vive el contrato que `calcularDivision` consume y que
`src/data/` cumple.

**Alternativas descartadas:** `class EstrategiaRedondeo` con un método que lanza
`Error('no implementado')` (imita una clase abstracta de Dart y obliga a `extends`, que es
herencia innecesaria); pasar una función suelta en vez de un objeto (perdería el nombre del
contrato y haría que `calcularDivision` recibiera "una función cualquiera" en lugar de "una
estrategia de redondeo").

## 3. ¿Cómo se reemplaza el `DivisorController` de Dart?

**Decisión:** un hook `useDivisor({ validarEntrada, calcularDivision, formateador, estrategias })`
que recibe sus dependencias como argumento y devuelve `{ modos, modoSeleccionado, resultado,
error, seleccionarModo, calcular, limpiar }`.

**Por qué:** mantiene DIP exactamente como en Flutter (las dependencias entran desde
fuera, el hook no importa nada de `src/data/`) y mantiene SRP (la vista solo dibuja). La
API pública del hook es la misma que la del controlador de Dart, campo por campo, así que
el contrato de la vista no cambia.

**Alternativas descartadas:** una clase `DivisorController` instanciada en el componente
(React la recrearía en cada render o exigiría `useRef`, y el cambio de estado no
redibujaría); poner la lógica directamente en `PantallaDivisor.jsx` (rompe SRP y DIP, y
obliga a probar el cálculo a través del DOM).

## 4. ¿Cómo se filtra el campo de personas sin `inputFormatters`?

**Decisión:** `<input>` controlado cuyo `onChange` descarta todo lo que no sea dígito y
recorta a 6 caracteres, más `inputMode="numeric"` para que el teclado móvil muestre números.

**Por qué:** el edge case de la spec exige que el campo de personas solo admita dígitos,
hasta 6, y que no se puedan escribir negativos, decimales ni letras. Flutter lo hacía con
`FilteringTextInputFormatter.digitsOnly` y `LengthLimitingTextInputFormatter(6)`.

**Alternativas descartadas:** `<input type="number">` (permite escribir `e`, `-` y `+`, y
su valor queda vacío cuando el texto es inválido, lo que haría imposible distinguir "campo
vacío" de "texto no numérico"); validar solo al calcular (incumple el edge case, que habla
de lo que se *puede escribir*).

El campo de monto, en cambio, es `type="text"` a propósito: la spec exige poder escribir
"abc" y ver "Monto inválido" (escenario 4). Con `type="number"` ese texto nunca llegaría al
validador.

## 5. ¿Cómo se conserva el resultado con dos decimales y sin ruido de punto flotante?

**Decisión:** se porta la aritmética del proyecto Flutter tal cual, porque el problema es
idéntico: Dart y JavaScript usan el mismo `double` IEEE-754 de 64 bits.

- Fórmula: `monto * (100 + propina) / (100 * personas)` — multiplica antes de dividir para
  no arrastrar el error de representar 1.1 en binario (FR-002).
- Redondeo exacto: `Math.round(valor * 100 + 1e-6) / 100`. La tolerancia `1e-6` absorbe que
  1.005 se guarde como 1.00499999…; sin ella bajaría a 1.00 en vez de subir a 1.01 (FR-004).
- Redondeo hacia arriba: `Math.ceil(valor - tolerancia)` con
  `tolerancia = Math.max(1e-9, |valor| * 1e-12)`, para que 30.000000000000004 no suba a 31
  (FR-005 y el edge case del entero que no sube).
- Formato: `toFixed(2)`, el equivalente de `toStringAsFixed(2)` (FR-003).

**Por qué:** el edge case "el ruido de punto flotante no cambia el resultado mostrado"
viaja intacto y con más razón al migrar, porque el formato numérico subyacente es el mismo.

## 6. ¿Cómo se acepta coma y punto como separador decimal?

**Decisión:** `texto.trim().replaceAll(',', '.')` y luego `Number(...)`, devolviendo `NaN`
si el texto no es un número; campo vacío → `NaN` para el monto y `0` para la propina.

**Por qué:** FR-010 lo exige para monto y propina. `Number('')` devuelve `0`, no `NaN`, así
que el caso vacío se trata explícitamente: un monto vacío debe dar "Monto inválido", no 0.

**Alternativa descartada:** `parseFloat` (acepta `"12abc"` como 12 y rompería el escenario
4 de la spec).

## 7. ¿Qué runner de pruebas?

**Decisión:** Vitest con `environment: 'jsdom'`, `globals: true` y Testing Library.

**Por qué:** Vitest reutiliza la configuración de Vite (un solo `vite.config.js`), corre
los módulos ESM sin transpilación aparte y su API (`describe`/`it`/`expect`) permite portar
las pruebas de `flutter_test` sin cambiar la estructura. `toBeCloseTo(esperado, 2)` es el
equivalente de `closeTo(esperado, 0.001)`.

**Alternativa descartada:** Jest (exige configuración propia de transformación para ESM y
JSX, duplicando lo que Vite ya hace).

## 8. ¿Cómo se identifican los elementos en las pruebas de la vista?

**Decisión:** `data-testid` con los mismos nombres que las `Key` de Flutter
(`campoMonto`, `campoPersonas`, `campoPropina`, `selectorModo`, `botonCalcular`,
`resultado`, `mensajeError`).

**Por qué:** conservar los nombres hace que el contrato de la vista sea comparable uno a
uno con el de Flutter, que es exactamente lo que el deber pide medir en la Parte 8.
