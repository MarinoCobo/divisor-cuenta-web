// Casos borde de la vista y del hook, portados de test/pantalla_borde_test.dart y de las
// pruebas del DivisorController (Flutter). Comprueban el parseo de los campos, el estado
// inicial y las reglas de borrado (FR-006, FR-007, FR-010, FR-011).

import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PantallaDivisor } from '../src/presentation/PantallaDivisor.jsx'
import { useDivisor } from '../src/presentation/useDivisor.js'
import { App } from '../src/main.jsx'

/** Renderiza la app real y devuelve atajos de interacción. */
function abrirPantalla() {
  render(<App />)
  return {
    escribir: (testId, texto) =>
      fireEvent.change(screen.getByTestId(testId), { target: { value: texto } }),
    elegirModo: (nombre) => fireEvent.click(screen.getByText(nombre)),
    calcular: () => fireEvent.click(screen.getByText('Calcular')),
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('modo de redondeo', () => {
  it('el modo inicial es "Exacto" y "Hacia arriba" da 4.00', () => {
    const pantalla = abrirPantalla()

    expect(screen.getByText('Exacto')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Hacia arriba')).toHaveAttribute('aria-pressed', 'false')

    pantalla.escribir('campoMonto', '10')
    pantalla.escribir('campoPersonas', '3')
    pantalla.calcular()
    expect(screen.getByTestId('resultado')).toHaveTextContent('3.33')

    pantalla.elegirModo('Hacia arriba')
    pantalla.calcular()
    expect(screen.getByTestId('resultado')).toHaveTextContent('4.00')
  })

  it('cambiar de modo después de calcular borra el resultado (FR-011)', () => {
    const pantalla = abrirPantalla()

    pantalla.escribir('campoMonto', '10')
    pantalla.escribir('campoPersonas', '3')
    pantalla.calcular()
    expect(screen.getByTestId('resultado')).toBeInTheDocument()

    pantalla.elegirModo('Hacia arriba')
    expect(screen.queryByTestId('resultado')).not.toBeInTheDocument()
  })
})

describe('borrado del resultado (FR-011)', () => {
  it('editar un campo después de calcular borra el resultado', () => {
    const pantalla = abrirPantalla()

    pantalla.escribir('campoMonto', '90')
    pantalla.escribir('campoPersonas', '3')
    pantalla.calcular()
    expect(screen.getByTestId('resultado')).toHaveTextContent('30.00')

    pantalla.escribir('campoMonto', '91')
    expect(screen.queryByTestId('resultado')).not.toBeInTheDocument()
    expect(screen.queryByText('Cada persona paga')).not.toBeInTheDocument()
  })

  it('nunca se ven a la vez el resultado y un error', () => {
    const pantalla = abrirPantalla()

    pantalla.escribir('campoMonto', '90')
    pantalla.escribir('campoPersonas', '3')
    pantalla.calcular()
    expect(screen.getByTestId('resultado')).toBeInTheDocument()
    expect(screen.queryByTestId('mensajeError')).not.toBeInTheDocument()

    pantalla.escribir('campoPersonas', '0')
    pantalla.calcular()
    expect(screen.getByTestId('mensajeError')).toBeInTheDocument()
    expect(screen.queryByTestId('resultado')).not.toBeInTheDocument()
  })
})

describe('campo de personas', () => {
  it('solo acepta hasta 6 dígitos y descarta letras y signos', () => {
    const pantalla = abrirPantalla()
    const campo = screen.getByTestId('campoPersonas')

    pantalla.escribir('campoPersonas', '1234567890')
    expect(campo).toHaveValue('123456')

    pantalla.escribir('campoPersonas', 'abc')
    expect(campo).toHaveValue('')

    pantalla.escribir('campoPersonas', '-3')
    expect(campo).toHaveValue('3')

    pantalla.escribir('campoPersonas', '2.5')
    expect(campo).toHaveValue('25')
  })

  it('personas vacías piden al menos una persona', () => {
    const pantalla = abrirPantalla()

    pantalla.escribir('campoMonto', '50')
    pantalla.calcular()

    expect(screen.getByText('Debe haber al menos una persona')).toBeInTheDocument()
  })
})

describe('parseo de monto y propina (FR-010)', () => {
  it('acepta coma como separador decimal en monto y propina', () => {
    const pantalla = abrirPantalla()

    pantalla.escribir('campoMonto', '100,00')
    pantalla.escribir('campoPersonas', '4')
    pantalla.escribir('campoPropina', '10,0')
    pantalla.calcular()

    expect(screen.getByTestId('resultado')).toHaveTextContent('27.50')
  })

  it('propina vacía cuenta como 0 %', () => {
    const pantalla = abrirPantalla()

    pantalla.escribir('campoMonto', '90')
    pantalla.escribir('campoPersonas', '3')
    pantalla.calcular()

    expect(screen.getByTestId('resultado')).toHaveTextContent('30.00')
  })

  it('monto vacío, con dos separadores o con espacios internos es inválido', () => {
    const pantalla = abrirPantalla()
    pantalla.escribir('campoPersonas', '4')

    for (const texto of ['', '1.2.3', '1,2,3', '1 000']) {
      pantalla.escribir('campoMonto', texto)
      pantalla.calcular()
      expect(screen.getByText('Monto inválido')).toBeInTheDocument()
    }
  })

  it('el monto admite espacios alrededor', () => {
    const pantalla = abrirPantalla()

    pantalla.escribir('campoMonto', '  90  ')
    pantalla.escribir('campoPersonas', '3')
    pantalla.calcular()

    expect(screen.getByTestId('resultado')).toHaveTextContent('30.00')
  })
})

describe('contrato del hook', () => {
  it('rechaza un mapa de estrategias vacío', () => {
    /** Componente de prueba que compone el hook sin ninguna estrategia. */
    function SinEstrategias() {
      const divisor = useDivisor({
        validarEntrada: () => null,
        calcularDivision: () => ({ montoPorPersona: 0 }),
        formateador: (monto) => String(monto),
        estrategias: {},
      })
      return <PantallaDivisor divisor={divisor} />
    }

    // React escribe el error en consola al propagarlo; se silencia para no ensuciar la salida.
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<SinEstrategias />)).toThrow(
      'Debe registrarse al menos un modo de redondeo',
    )
  })
})
