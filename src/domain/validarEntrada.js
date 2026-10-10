/**
 * Mensaje cuando el monto no es un número, es 0 o menos, o pasa del máximo.
 * @type {string}
 */
export const MONTO_INVALIDO = 'Monto inválido';

/**
 * Mensaje cuando hay menos de una persona.
 * @type {string}
 */
export const PERSONAS_INSUFICIENTES = 'Debe haber al menos una persona';

/**
 * Mensaje cuando la propina no es un número o está fuera de 0 a 100.
 * @type {string}
 */
export const PROPINA_INVALIDA = 'Propina inválida';

/**
 * Monto máximo aceptado. Con este tope, el monto por persona cabe en las cifras exactas
 * de un número de punto flotante de 64 bits y los centavos siempre son correctos.
 * @type {number}
 */
export const MONTO_MAXIMO = 1000000000;

/**
 * Propina máxima aceptada, en porcentaje. Una propina mayor que la cuenta se toma como
 * error de tipeo.
 * @type {number}
 */
export const PROPINA_MAXIMA = 100;

/**
 * Caso de uso: decide si los números que ingresó el usuario permiten calcular, y si no,
 * qué mensaje mostrar.
 *
 * Existe para que todas las reglas de entrada y todos los mensajes de error vivan en un
 * solo lugar. Solo valida: no calcula ni formatea (SRP).
 *
 * @param {Object} entrada
 * @param {number} entrada.monto Monto total (`NaN` si el usuario escribió algo que no es
 *   un número).
 * @param {number} entrada.personas Número de personas.
 * @param {number} entrada.propina Porcentaje de propina.
 * @returns {string | null} `null` si los tres son válidos. Si no, el mensaje del primer
 *   error, revisando en este orden: monto, personas, propina.
 *
 * No lanza errores: un dato inválido es un resultado esperado, no una excepción.
 */
export function validarEntrada({ monto, personas, propina }) {
  if (!Number.isFinite(monto) || monto <= 0 || monto > MONTO_MAXIMO) {
    return MONTO_INVALIDO;
  }
  if (!(personas >= 1)) {
    return PERSONAS_INSUFICIENTES;
  }
  if (!Number.isFinite(propina) || propina < 0 || propina > PROPINA_MAXIMA) {
    return PROPINA_INVALIDA;
  }
  return null;
}
