/**
 * Redondea el monto por persona hacia arriba, al entero siguiente.
 *
 * Existe para quien prefiere no lidiar con centavos: 10.00 entre 3 da 4.00, y así el
 * grupo siempre cubre la cuenta. Es una implementación del contrato `EstrategiaRedondeo`
 * que se agregó sin editar ningún módulo existente (OCP).
 *
 * @type {import('../domain/estrategiaRedondeo.js').EstrategiaRedondeo}
 */
export const redondeoHaciaArriba = Object.freeze({
  /**
   * @param {number} valor El monto por persona sin redondear (finito, ≥ 0).
   * @returns {number} El entero inmediatamente superior, salvo que ya sea entero:
   *   3.3333 → 4; 30.0 → 30.
   *
   * Antes de subir, resta una tolerancia mínima para que el ruido de punto flotante
   * (30.000000000000004) no convierta 30 en 31. La tolerancia crece con el monto porque
   * el ruido también crece.
   *
   * No lanza errores con entradas válidas.
   */
  aplicar(valor) {
    const tolerancia = Math.max(1e-9, Math.abs(valor) * 1e-12);
    return Math.ceil(valor - tolerancia);
  },
});
