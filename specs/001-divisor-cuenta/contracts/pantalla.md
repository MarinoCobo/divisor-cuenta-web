# Contrato: pantalla

Lo que el usuario ve y lo que las pruebas de la vista buscan.

| Elemento | Elemento HTML | `data-testid` | Texto / comportamiento |
|---|---|---|---|
| Monto total | `<input type="text">` | `campoMonto` | etiqueta "Monto total"; acepta cualquier texto (para poder escribir "abc" y ver el error) |
| Personas | `<input type="text" inputMode="numeric">` | `campoPersonas` | etiqueta "Número de personas"; solo dígitos, máximo 6 |
| Propina | `<input type="text">` | `campoPropina` | etiqueta "Propina (%)"; vacía = 0 |
| Modo | `<div role="group">` con un `<button>` por modo | `selectorModo` | un botón por cada modo del mapa; inicial: "Exacto"; el activo lleva `aria-pressed="true"` |
| Calcular | `<button type="button">` | `botonCalcular` | texto "Calcular" |
| Resultado | `<p>` | `resultado` | solo el número con dos decimales, por ejemplo `27.50`; encima, la etiqueta "Cada persona paga" |
| Error | `<p role="alert">` | `mensajeError` | el mensaje exacto de `validarEntrada` |

Reglas:

- Nunca se muestran a la vez `resultado` y `mensajeError` (FR-007).
- Cambiar cualquier campo o el modo borra el resultado y el error (FR-011).

## useDivisor (JavaScript puro con `useState`, en `src/presentation/`)

```javascript
useDivisor({
  validarEntrada,     // (entrada) => string | null
  calcularDivision,   // (cuenta, estrategia) => { montoPorPersona }
  formateador,        // (monto) => string
  estrategias,        // Map<string, EstrategiaRedondeo>, no vacío
})
// devuelve:
{
  monto, personas, propina,        // string: el texto de cada campo
  modos,                           // string[]
  modoSeleccionado,                // string
  resultado,                       // string | null, ya formateado ("27.50")
  error,                           // string | null
  cambiarMonto, cambiarPersonas, cambiarPropina,  // (texto: string) => void
  seleccionarModo,                 // (modo: string) => void
  calcular,                        // () => void
  limpiar,                         // () => void
}
```

## Equivalencia con el contrato de Flutter

| Flutter | React | Cambio |
|---|---|---|
| `Key('campoMonto')` + `find.byKey` | `data-testid="campoMonto"` + `getByTestId` | `Key` es de Flutter; el equivalente web es un atributo del DOM. **Los nombres se conservan** |
| `TextField` con `inputFormatters` | `<input>` controlado con filtro en `onChange` | `inputFormatters` es API de Flutter |
| `SegmentedButton<String>` | `<div role="group">` con `<button aria-pressed>` | `SegmentedButton` es un widget de Material |
| `FilledButton` | `<button type="button">` | igual |
| `Text` con `Key('resultado')` | `<p data-testid="resultado">` | igual |
| `DivisorController` (clase) | `useDivisor` (hook) | React no instancia controladores por pantalla |
| `TextEditingController` × 3 | tres `useState` de texto dentro del hook | no existe `TextEditingController` en React |
| getters `resultado` / `error` | campos del objeto que devuelve el hook | **misma API, campo por campo** |

Los textos visibles ("Monto total", "Número de personas", "Propina (%)", "Calcular",
"Cada persona paga", "Exacto", "Hacia arriba") y los mensajes de error son **idénticos** a
los de la versión Flutter.
