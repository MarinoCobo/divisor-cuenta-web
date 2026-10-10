/**
 * Los datos de una cuenta que ya pasaron por `validarEntrada`.
 *
 * Existe para que el cálculo reciba un solo objeto con todo lo que necesita, en lugar de
 * tres números sueltos. No valida nada: confía en que quien la crea ya comprobó que los
 * valores son válidos.
 *
 * @param {Object} entrada
 * @param {number} entrada.monto Monto total de la cuenta, sin propina. Mayor que 0.
 * @param {number} entrada.personas Número de personas que pagan. Al menos 1.
 * @param {number} entrada.propina Porcentaje de propina (10 significa 10 %), entre 0 y 100.
 * @returns {{monto: number, personas: number, propina: number}} La cuenta, congelada para
 *   que nadie le reasigne un campo después de validarla.
 *
 * No lanza errores: los valores inválidos se filtran antes, en `validarEntrada`.
 */
export function crearCuenta({ monto, personas, propina }) {
  return Object.freeze({ monto, personas, propina });
}
