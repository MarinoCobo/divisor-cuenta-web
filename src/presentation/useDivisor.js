import { useState } from 'react';

import { crearCuenta } from '../domain/cuenta.js';

/**
 * Convierte el texto de un campo en número. Acepta coma o punto como separador decimal
 * (FR-010).
 *
 * Existe porque `Number('')` devuelve 0 y `parseFloat('12abc')` devuelve 12: las dos
 * cosas romperían la spec. Un monto vacío debe dar "Monto inválido", no 0; y "abc" debe
 * dar `NaN`, no un número.
 *
 * @param {string} texto El contenido del campo.
 * @param {number} siEstaVacio Qué devolver cuando el campo está vacío.
 * @returns {number} El número leído, `siEstaVacio` si el campo está vacío, o `NaN` si el
 *   texto no es un número.
 *
 * No lanza errores.
 */
function leerDecimal(texto, siEstaVacio) {
  const normalizado = texto.trim().replaceAll(',', '.');
  if (normalizado === '') return siEstaVacio;
  return Number(normalizado);
}

/**
 * Coordina la vista: guarda lo que escribió el usuario, pide el cálculo y expone lo que
 * hay que mostrar.
 *
 * Existe para que la vista solo dibuje. Recibe todas sus dependencias como argumento
 * (DIP): no crea ninguna estrategia concreta, solo conoce el contrato
 * `EstrategiaRedondeo`. En la versión Flutter esto era la clase `DivisorController`; la
 * API pública es la misma, campo por campo.
 *
 * Las tres entradas se guardan como **texto**, no como número, porque el escenario 4 de
 * la spec exige que "abc" llegue tal cual al validador.
 *
 * @param {Object} dependencias
 * @param {(entrada: {monto: number, personas: number, propina: number}) => (string | null)} dependencias.validarEntrada
 *   Caso de uso que valida; devuelve el mensaje de error o `null`.
 * @param {(cuenta: {monto: number, personas: number, propina: number}, estrategia: import('../domain/estrategiaRedondeo.js').EstrategiaRedondeo) => {montoPorPersona: number}} dependencias.calcularDivision
 *   Caso de uso que calcula.
 * @param {(monto: number) => string} dependencias.formateador Da formato al resultado.
 * @param {Record<string, import('../domain/estrategiaRedondeo.js').EstrategiaRedondeo>} dependencias.estrategias
 *   Los modos de redondeo con el nombre que ve el usuario. El primero es el modo inicial.
 * @returns {Object} El estado de la vista y las acciones que la vista puede disparar.
 *
 * @throws {Error} Si `estrategias` está vacío: la vista necesita al menos un modo.
 */
export function useDivisor({
  validarEntrada,
  calcularDivision,
  formateador,
  estrategias,
}) {
  const modos = Object.keys(estrategias);
  if (modos.length === 0) {
    throw new Error('Debe registrarse al menos un modo de redondeo');
  }

  const [monto, setMonto] = useState('');
  const [personas, setPersonas] = useState('');
  const [propina, setPropina] = useState('');
  const [modoSeleccionado, setModoSeleccionado] = useState(modos[0]);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Borra lo que se esté mostrando. Se llama cuando el usuario cambia una entrada, para
   * no dejar en pantalla un resultado que ya no corresponde (FR-011).
   * @returns {void}
   */
  function limpiar() {
    setResultado(null);
    setError(null);
  }

  /**
   * Cambia un campo de texto y borra el resultado anterior.
   * @param {(texto: string) => void} asignar El `setState` del campo.
   * @returns {(texto: string) => void} El manejador que usa la vista.
   */
  function cambiar(asignar) {
    return (texto) => {
      asignar(texto);
      limpiar();
    };
  }

  /**
   * Cambia el modo de redondeo y borra el resultado anterior, que ya no corresponde al
   * modo nuevo (FR-011).
   *
   * @param {string} modo Uno de `modos`.
   * @returns {void}
   * @throws {Error} Si `modo` no es uno de `modos`.
   */
  function seleccionarModo(modo) {
    if (!Object.hasOwn(estrategias, modo)) {
      throw new Error(`Modo de redondeo desconocido: ${modo}`);
    }
    setModoSeleccionado(modo);
    limpiar();
  }

  /**
   * Lee los tres campos, valida y, si todo está bien, calcula cuánto paga cada persona.
   *
   * Si `validarEntrada` encuentra un error, lo guarda en `error`, borra el resultado
   * anterior y NO calcula (FR-007). Si no, guarda en `resultado` el monto por persona ya
   * formateado.
   *
   * @returns {void}
   *
   * No lanza errores.
   */
  function calcular() {
    const montoLeido = leerDecimal(monto, Number.NaN);
    const personasLeidas = personas.trim() === '' ? 0 : Number(personas.trim());
    const propinaLeida = leerDecimal(propina, 0);

    const mensaje = validarEntrada({
      monto: montoLeido,
      personas: personasLeidas,
      propina: propinaLeida,
    });
    if (mensaje !== null) {
      setResultado(null);
      setError(mensaje);
      return;
    }

    const cuenta = crearCuenta({
      monto: montoLeido,
      personas: personasLeidas,
      propina: propinaLeida,
    });
    const calculado = calcularDivision(cuenta, estrategias[modoSeleccionado]);
    setResultado(formateador(calculado.montoPorPersona));
    setError(null);
  }

  return {
    monto,
    personas,
    propina,
    modos,
    modoSeleccionado,
    resultado,
    error,
    cambiarMonto: cambiar(setMonto),
    cambiarPersonas: cambiar(setPersonas),
    cambiarPropina: cambiar(setPropina),
    seleccionarModo,
    calcular,
    limpiar,
  };
}
