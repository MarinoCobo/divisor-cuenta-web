// Pruebas de la vista, armada igual que en la app real (mismas piezas que src/main.jsx).

import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

// Se importa App desde src/main.jsx para probar la vista armada EXACTAMENTE como en la
// app real, igual que el pantalla_test.dart de Flutter usaba crearControlador(). Así esta
// prueba no vuelve a nombrar las implementaciones concretas de src/data/.
import { App } from '../src/main.jsx'

/**
 * Renderiza la vista y devuelve atajos para escribir en los campos y calcular.
 *
 * @returns {{escribir: (testId: string, texto: string) => void, calcular: () => void}}
 */
function abrirPantalla() {
  render(<App />)
  return {
    escribir: (testId, texto) =>
      fireEvent.change(screen.getByTestId(testId), { target: { value: texto } }),
    calcular: () => fireEvent.click(screen.getByText('Calcular')),
  }
}

it('100, 4 personas y 10 % muestran 27.50', () => {
  const pantalla = abrirPantalla()

  pantalla.escribir('campoMonto', '100')
  pantalla.escribir('campoPersonas', '4')
  pantalla.escribir('campoPropina', '10')
  pantalla.calcular()

  expect(screen.getByText('27.50')).toBeInTheDocument()
})

it('50 y 0 personas muestran el error y ningún resultado', () => {
  const pantalla = abrirPantalla()

  pantalla.escribir('campoMonto', '50')
  pantalla.escribir('campoPersonas', '0')
  pantalla.calcular()

  expect(screen.getByText('Debe haber al menos una persona')).toBeInTheDocument()
  expect(screen.queryByTestId('resultado')).not.toBeInTheDocument()
  expect(screen.queryByText('Cada persona paga')).not.toBeInTheDocument()
})

it('"abc" en el monto muestra "Monto inválido"', () => {
  const pantalla = abrirPantalla()

  pantalla.escribir('campoMonto', 'abc')
  pantalla.calcular()

  expect(screen.getByText('Monto inválido')).toBeInTheDocument()
})
