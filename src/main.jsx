import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { redondeoExacto } from './data/redondeoExacto.js';
import { redondeoHaciaArriba } from './data/redondeoHaciaArriba.js';
import { calcularDivision } from './domain/calcularDivision.js';
import { validarEntrada } from './domain/validarEntrada.js';
import { formatearMoneda } from './presentation/formateadorMoneda.js';
import { PantallaDivisor } from './presentation/PantallaDivisor.jsx';
import { useDivisor } from './presentation/useDivisor.js';

import './index.css';

/**
 * Los modos de redondeo con el nombre que ve el usuario, en orden. El primero es el modo
 * inicial (FR-006: "exacto").
 *
 * Este objeto es el ÚNICO lugar de `src/` donde se nombran las implementaciones concretas
 * de `src/data/` (constitución II). Para agregar un modo nuevo se crea su módulo y se
 * agrega una línea aquí; nada más cambia (OCP).
 *
 * @type {Record<string, import('./domain/estrategiaRedondeo.js').EstrategiaRedondeo>}
 */
const ESTRATEGIAS = {
  Exacto: redondeoExacto,
  'Hacia arriba': redondeoHaciaArriba,
};

/**
 * Arma la vista con todas sus piezas concretas.
 *
 * Existe para que el punto de composición sea un solo lugar: es el equivalente de
 * `crearControlador()` en el `main.dart` de la versión Flutter. Se exporta para que
 * `test/pantalla.test.jsx` pruebe la vista armada EXACTAMENTE como en la app real, sin
 * volver a nombrar las implementaciones concretas de `src/data/` (constitución II).
 *
 * @returns {JSX.Element} La vista lista para montar.
 *
 * No lanza errores.
 */
export function App() {
  const divisor = useDivisor({
    validarEntrada,
    calcularDivision,
    formateador: formatearMoneda,
    estrategias: ESTRATEGIAS,
  });
  return <PantallaDivisor divisor={divisor} />;
}

/**
 * Punto de entrada: monta la app en el `#root` de `index.html`.
 *
 * Va detrás de una comprobación porque en el entorno de pruebas (jsdom) no existe
 * `#root`: así, importar este módulo desde una prueba reutiliza la composición sin
 * arrancar la app. En Dart esto era gratis, porque importar `main.dart` no ejecuta
 * `main()`; en JavaScript el código de nivel superior sí corre al importar.
 */
const raiz = document.getElementById('root');
if (raiz !== null) {
  createRoot(raiz).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
