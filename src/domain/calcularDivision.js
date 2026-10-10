import { crearResultado } from './resultado.js';

/**
 * Caso de uso: calcula cuánto paga cada persona.
 *
 * Existe para que la fórmula viva en un solo lugar. Solo calcula: no revisa la entrada ni
 * le da formato al número (SRP). Tampoco pregunta qué tipo de estrategia recibe:
 * cualquier objeto que cumpla el contrato `EstrategiaRedondeo` sirve (LSP/OCP).
 *
 * Multiplica antes de dividir para no arrastrar el error de representar 1.1 en binario.
 *
 * @param {{monto: number, personas: number, propina: number}} cuenta Una cuenta ya
 *   revisada por `validarEntrada`.
 * @param {import('./estrategiaRedondeo.js').EstrategiaRedondeo} estrategia La regla de
 *   redondeo elegida.
 * @returns {{montoPorPersona: number}} El resultado con el monto por persona:
 *   `monto × (100 + propina) / (100 × personas)`, redondeado por la estrategia.
 *
 * No lanza errores con una cuenta válida. Con 0 personas el resultado no tiene sentido
 * (daría `Infinity`); por eso la cuenta debe venir revisada.
 */
export function calcularDivision(cuenta, estrategia) {
  const montoSinRedondear =
    (cuenta.monto * (100 + cuenta.propina)) / (100 * cuenta.personas);
  return crearResultado(estrategia.aplicar(montoSinRedondear));
}
