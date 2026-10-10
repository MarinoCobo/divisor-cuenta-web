/**
 * El contrato de una regla para redondear el monto que paga cada persona.
 *
 * Existe para que agregar un modo de redondeo nuevo sea crear un módulo que cumpla este
 * contrato, sin editar el cálculo (OCP). Tiene una única función para que nadie dependa
 * de algo que no usa (ISP).
 *
 * En la versión Flutter esto era `abstract interface class EstrategiaRedondeo` con el
 * método `redondear`. JavaScript no tiene `interface`, así que el contrato es
 * estructural: cualquier objeto con una función `aplicar` sirve. Este archivo no genera
 * código en tiempo de ejecución; es donde vive el contrato que `calcularDivision`
 * consume y que `src/data/` cumple.
 *
 * @typedef {Object} EstrategiaRedondeo
 * @property {(valor: number) => number} aplicar Recibe el monto por persona sin
 *   redondear (finito y mayor o igual a 0) y devuelve el monto redondeado según la regla
 *   de la implementación. No lanza errores con entradas válidas.
 */

export {};
