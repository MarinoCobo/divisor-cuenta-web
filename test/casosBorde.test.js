// Casos borde del domain, portados de test/casos_borde_test.dart (Flutter).
// Cubren los "Edge Cases" de la spec que los 6 escenarios de aceptación no toca.
// No importa react: todo esto es JavaScript puro.

import { describe, expect, it } from 'vitest'

import { redondeoExacto } from '../src/data/redondeoExacto.js'
import { redondeoHaciaArriba } from '../src/data/redondeoHaciaArriba.js'
import { calcularDivision } from '../src/domain/calcularDivision.js'
import { crearCuenta } from '../src/domain/cuenta.js'
import {
  MONTO_INVALIDO,
  MONTO_MAXIMO,
  PERSONAS_INSUFICIENTES,
  PROPINA_INVALIDA,
  validarEntrada,
} from '../src/domain/validarEntrada.js'
import { formatearMoneda } from '../src/presentation/formateadorMoneda.js'

/** Atajo: valida una terna de números ya parseados. */
const validar = (monto, personas, propina) =>
  validarEntrada({ monto, personas, propina })

/** Atajo: calcula y formatea, como lo haría la vista. */
const calcularYFormatear = (monto, personas, propina, estrategia) =>
  formatearMoneda(
    calcularDivision(crearCuenta({ monto, personas, propina }), estrategia)
      .montoPorPersona,
  )

describe('validarEntrada: monto', () => {
  it('monto 0, negativo, infinito o mayor al máximo es inválido', () => {
    expect(validar(0, 4, 0)).toBe(MONTO_INVALIDO)
    expect(validar(-5, 4, 0)).toBe(MONTO_INVALIDO)
    expect(validar(Number.POSITIVE_INFINITY, 4, 0)).toBe(MONTO_INVALIDO)
    expect(validar(Number.NaN, 4, 0)).toBe(MONTO_INVALIDO)
    expect(validar(MONTO_MAXIMO + 1, 4, 0)).toBe(MONTO_INVALIDO)
  })

  it('el monto máximo y montos pequeños son válidos', () => {
    expect(validar(MONTO_MAXIMO, 1, 0)).toBeNull()
    expect(validar(0.01, 1, 0)).toBeNull()
  })
})

describe('validarEntrada: personas y propina', () => {
  it('personas negativas o cero piden al menos una persona', () => {
    expect(validar(50, 0, 0)).toBe(PERSONAS_INSUFICIENTES)
    expect(validar(50, -3, 0)).toBe(PERSONAS_INSUFICIENTES)
  })

  it('propina negativa, mayor a 100 o no numérica es inválida', () => {
    expect(validar(90, 3, -1)).toBe(PROPINA_INVALIDA)
    expect(validar(90, 3, 101)).toBe(PROPINA_INVALIDA)
    expect(validar(90, 3, Number.NaN)).toBe(PROPINA_INVALIDA)
    expect(validar(90, 3, 100)).toBeNull() // 100 % sí es válida
  })

  it('con varios errores gana el primero: monto, personas, propina', () => {
    expect(validar(Number.NaN, 0, 999)).toBe(MONTO_INVALIDO)
    expect(validar(50, 0, 999)).toBe(PERSONAS_INSUFICIENTES)
    expect(validar(50, 2, 999)).toBe(PROPINA_INVALIDA)
  })
})

describe('estrategias de redondeo', () => {
  it('exacto redondea la mitad hacia arriba pese al ruido binario', () => {
    // 1.005 se guarda como 1.00499999...; sin la tolerancia bajaría a 1.00.
    expect(redondeoExacto.aplicar(1.005)).toBeCloseTo(1.01, 2)
    expect(redondeoExacto.aplicar(3.3333)).toBeCloseTo(3.33, 2)
    expect(redondeoExacto.aplicar(27.5)).toBeCloseTo(27.5, 2)
  })

  it('hacia arriba no sube un valor que ya es entero', () => {
    expect(redondeoHaciaArriba.aplicar(30)).toBe(30)
    // Ruido de punto flotante: 30.000000000000004 NO debe convertirse en 31.
    expect(redondeoHaciaArriba.aplicar(30.000000000000004)).toBe(30)
  })

  it('hacia arriba sí sube una fracción real, aunque sea pequeña', () => {
    expect(redondeoHaciaArriba.aplicar(30.01)).toBe(31)
    expect(redondeoHaciaArriba.aplicar(0.01)).toBe(1)
  })
})

describe('límites del cálculo (dos decimales siempre correctos)', () => {
  it('monto máximo con 100 % de propina y 1 persona', () => {
    expect(calcularYFormatear(MONTO_MAXIMO, 1, 100, redondeoExacto)).toBe(
      '2000000000.00',
    )
  })

  it('999 999 personas', () => {
    expect(calcularYFormatear(MONTO_MAXIMO, 999999, 0, redondeoExacto)).toBe(
      '1000.00',
    )
  })

  it('decimales de monto y propina no dejan ruido visible', () => {
    // 100 × 1.1 / 4 da 27.500000000000004 en coma flotante; se muestra 27.50.
    expect(calcularYFormatear(100, 4, 10, redondeoExacto)).toBe('27.50')
    expect(calcularYFormatear(33.33, 3, 7.5, redondeoExacto)).toBe('11.94')
  })
})

describe('LSP/OCP: el cálculo no distingue la estrategia', () => {
  it('la misma cuenta con las dos estrategias solo difiere en el redondeo', () => {
    const cuenta = crearCuenta({ monto: 10, personas: 3, propina: 0 })
    expect(calcularDivision(cuenta, redondeoExacto).montoPorPersona).toBeCloseTo(3.33, 2)
    expect(calcularDivision(cuenta, redondeoHaciaArriba).montoPorPersona).toBeCloseTo(4, 2)
  })

  it('una estrategia inventada en la prueba también sirve (OCP)', () => {
    // Prueba de que agregar un modo no obliga a tocar calcularDivision.
    const redondeoHaciaAbajo = { aplicar: (valor) => Math.floor(valor) }
    const cuenta = crearCuenta({ monto: 10, personas: 3, propina: 0 })
    expect(
      calcularDivision(cuenta, redondeoHaciaAbajo).montoPorPersona,
    ).toBe(3)
  })
})
