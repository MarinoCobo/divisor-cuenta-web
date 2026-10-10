# Contrato: domain

Firmas públicas que usan `src/presentation/`, `src/data/` y las pruebas. Cambiar una de
estas firmas obliga a revisar las tres.

```javascript
// src/domain/estrategiaRedondeo.js
// Contrato estructural (ISP: una sola función). No genera código en tiempo de ejecución.
/**
 * @typedef {Object} EstrategiaRedondeo
 * @property {(valor: number) => number} aplicar
 */

// src/domain/cuenta.js
/** @returns {{monto: number, personas: number, propina: number}} */
function crearCuenta({ monto, personas, propina });

// src/domain/resultado.js
/** @returns {{montoPorPersona: number}} */
function crearResultado(montoPorPersona);

// src/domain/calcularDivision.js
/**
 * Precondición: la cuenta ya pasó por validarEntrada.
 * @returns {{montoPorPersona: number}}
 */
function calcularDivision(cuenta, estrategia);

// src/domain/validarEntrada.js
const MONTO_INVALIDO = 'Monto inválido';
const PERSONAS_INSUFICIENTES = 'Debe haber al menos una persona';
const PROPINA_INVALIDA = 'Propina inválida';
const MONTO_MAXIMO = 1000000000;
const PROPINA_MAXIMA = 100;
/** null = válido; si no, el mensaje exacto del primer error (monto → personas → propina). */
function validarEntrada({ monto, personas, propina });
```

Implementaciones en `src/data/` (solo se usan en `src/main.jsx`):

```javascript
// src/data/redondeoExacto.js
export const redondeoExacto = { aplicar(valor) { /* al centavo más cercano */ } };

// src/data/redondeoHaciaArriba.js
export const redondeoHaciaArriba = { aplicar(valor) { /* al entero superior */ } };
```

## Equivalencia con el contrato de Flutter

| Flutter (Dart) | React (JavaScript) | Cambio |
|---|---|---|
| `abstract interface class EstrategiaRedondeo` | `@typedef EstrategiaRedondeo` (contrato estructural) | JS no tiene `interface` |
| `double redondear(double montoPorPersona)` | `aplicar(valor: number) => number` | nombre de la función y tipos |
| `class Cuenta` con constructor `const` | `crearCuenta({...})` que devuelve un objeto congelado | JS no tiene constructores `const` |
| `class Resultado` | `crearResultado(montoPorPersona)` | igual |
| `CalcularDivision().calcular(cuenta, estrategia)` | `calcularDivision(cuenta, estrategia)` | función suelta en vez de método de una clase sin estado |
| `ValidarEntrada().validar({...})` → `String?` | `validarEntrada({...})` → `string \| null` | `String?` de Dart → unión con `null` |
| `static const String montoInvalido` | `export const MONTO_INVALIDO` | **el valor del string es idéntico** |

Los tres mensajes de error conservan su texto exacto, byte por byte. Eso es lo que permite
portar las pruebas sin reescribir ningún valor esperado.
