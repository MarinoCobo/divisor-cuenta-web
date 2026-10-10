// Corre y verifica los casos de test/casosDePrueba.js contra el domain.
// No importa react: calcularDivision y validarEntrada son JavaScript puro.

import { describe, expect, it } from 'vitest'

import { redondeoExacto } from '../src/data/redondeoExacto.js'
import { redondeoHaciaArriba } from '../src/data/redondeoHaciaArriba.js'
import { calcularDivision } from '../src/domain/calcularDivision.js'
import { crearCuenta } from '../src/domain/cuenta.js'
import { validarEntrada } from '../src/domain/validarEntrada.js'

import { casos } from './casosDePrueba.js'

/**
 * Los modos que nombran los casos, con la estrategia que les corresponde. Este mapa vive
 * en la prueba, no en el domain: `calcularDivision` nunca pregunta de qué modo se trata.
 */
const estrategiaPorModo = {
  exacto: redondeoExacto,
  arriba: redondeoHaciaArriba,
}

/**
 * Envuelve una estrategia real y cuenta cuántas veces se usó. Sirve para comprobar que
 * con un error de validación no se calcula nada.
 *
 * @param {{aplicar: (valor: number) => number}} real La estrategia que envuelve.
 * @returns {{aplicar: (valor: number) => number, llamadas: number}} La espía.
 */
function espiar(real) {
  return {
    llamadas: 0,
    aplicar(valor) {
      this.llamadas += 1
      return real.aplicar(valor)
    },
  }
}

describe('escenarios de aceptación de la spec', () => {
  for (const caso of casos) {
    it(caso.nombre, () => {
      // Cada caso espera un resultado o un error, no ambos.
      expect(
        (caso.esperado === undefined) !== (caso.errorEsperado === undefined),
      ).toBe(true)

      const espia = espiar(estrategiaPorModo[caso.modo])

      const error = validarEntrada({
        monto: caso.monto,
        personas: caso.personas,
        propina: caso.propina,
      })
      const resultado =
        error === null
          ? calcularDivision(
              crearCuenta({
                monto: caso.monto,
                personas: caso.personas,
                propina: caso.propina,
              }),
              espia,
            )
          : null

      if (caso.errorEsperado !== undefined) {
        expect(error).toBe(caso.errorEsperado)
        expect(resultado).toBeNull()
        expect(espia.llamadas).toBe(0) // con un error no se calcula nada
      } else {
        expect(error).toBeNull()
        expect(resultado.montoPorPersona).toBeCloseTo(caso.esperado, 2)
        expect(espia.llamadas).toBe(1)
      }
    })
  }
})

it('LSP: el mismo calcularDivision funciona con cualquier estrategia de redondeo', () => {
  const cuenta = crearCuenta({ monto: 10, personas: 3, propina: 0 })
  const intercambiables = [redondeoExacto, redondeoHaciaArriba]

  // Un solo bucle, sin ningún if ni comprobación de tipo: calcularDivision no sabe —ni
  // pregunta— cuál de las dos estrategias está recibiendo.
  const montos = intercambiables.map(
    (estrategia) => calcularDivision(cuenta, estrategia).montoPorPersona,
  )

  expect(montos[0]).toBeCloseTo(3.33, 2)
  expect(montos[1]).toBeCloseTo(4.00, 2)
})
