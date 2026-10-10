/**
 * Lo que devuelve el cálculo: cuánto paga cada persona.
 *
 * Existe para que el cálculo devuelva un valor con nombre propio y no un número suelto
 * que podría confundirse con el monto total.
 *
 * @param {number} montoPorPersona Monto que paga cada persona, ya redondeado por la
 *   estrategia elegida.
 * @returns {{montoPorPersona: number}} El resultado, congelado.
 *
 * No lanza errores.
 */
export function crearResultado(montoPorPersona) {
  return Object.freeze({ montoPorPersona });
}
