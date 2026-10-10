/**
 * Margen que absorbe el ruido de punto flotante: 1.005 se guarda como 1.00499999…, y sin
 * este margen bajaría a 1.00 en vez de subir a 1.01.
 * @type {number}
 */
const TOLERANCIA = 1e-6;

/**
 * Redondea el monto por persona al centavo más cercano (mitad hacia arriba).
 *
 * Existe porque es el modo de redondeo por defecto de la app: 10.00 entre 3 da 3.33. Es
 * una implementación del contrato `EstrategiaRedondeo` que puede sustituir a cualquier
 * otra sin que el cálculo lo note (LSP).
 *
 * @type {import('../domain/estrategiaRedondeo.js').EstrategiaRedondeo}
 */
export const redondeoExacto = Object.freeze({
  /**
   * @param {number} valor El monto por persona sin redondear (finito, ≥ 0).
   * @returns {number} Ese monto redondeado al centavo más cercano.
   *   Ejemplos: 3.3333 → 3.33; 27.5 → 27.5; 1.005 → 1.01.
   *
   * No lanza errores con entradas válidas.
   */
  aplicar(valor) {
    return Math.round(valor * 100 + TOLERANCIA) / 100;
  },
});
