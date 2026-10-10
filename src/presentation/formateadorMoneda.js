/**
 * Convierte un monto en el texto que se muestra en pantalla.
 *
 * Existe para que el formato viva en un solo lugar y el cálculo no tenga que saber cómo
 * se ve el número (SRP).
 *
 * @param {number} monto Un monto finito.
 * @returns {string} El texto con exactamente dos decimales y punto decimal, sin símbolo
 *   de moneda: 27.5 → "27.50".
 *
 * No lanza errores.
 */
export function formatearMoneda(monto) {
  return monto.toFixed(2);
}
