/**
 * La única vista de la app: tres campos, el modo de redondeo, el botón "Calcular" y el
 * resultado.
 *
 * Existe solo para dibujar. Toda decisión (qué calcular, qué mostrar) la toma el hook
 * que recibe por `props`. En la versión Flutter esto era `PantallaDivisor`, un
 * `StatefulWidget` que recibía un `DivisorController`.
 *
 * @param {Object} props
 * @param {ReturnType<typeof import('./useDivisor.js').useDivisor>} props.divisor El
 *   estado y las acciones, ya armados en `src/main.jsx`.
 * @returns {JSX.Element} La vista.
 *
 * No lanza errores.
 */
export function PantallaDivisor({ divisor }) {
  const {
    monto,
    personas,
    propina,
    modos,
    modoSeleccionado,
    resultado,
    error,
    cambiarMonto,
    cambiarPersonas,
    cambiarPropina,
    seleccionarModo,
    calcular,
  } = divisor;

  /**
   * Deja en el campo de personas solo dígitos, máximo 6. Reemplaza a los
   * `inputFormatters` de Flutter (`FilteringTextInputFormatter.digitsOnly` y
   * `LengthLimitingTextInputFormatter(6)`).
   *
   * @param {string} texto Lo que el usuario escribió.
   * @returns {void}
   */
  function alCambiarPersonas(texto) {
    cambiarPersonas(texto.replace(/\D/g, '').slice(0, 6));
  }

  return (
    <main className="divisor">
      <h1>Divisor de cuenta</h1>

      <label className="campo">
        <span>Monto total</span>
        <input
          data-testid="campoMonto"
          type="text"
          inputMode="decimal"
          value={monto}
          onChange={(evento) => cambiarMonto(evento.target.value)}
        />
      </label>

      <label className="campo">
        <span>Número de personas</span>
        <input
          data-testid="campoPersonas"
          type="text"
          inputMode="numeric"
          value={personas}
          onChange={(evento) => alCambiarPersonas(evento.target.value)}
        />
      </label>

      <label className="campo">
        <span>Propina (%)</span>
        <input
          data-testid="campoPropina"
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={propina}
          onChange={(evento) => cambiarPropina(evento.target.value)}
        />
      </label>

      <p className="etiquetaModo">Redondeo</p>
      <div className="selectorModo" data-testid="selectorModo" role="group" aria-label="Redondeo">
        {modos.map((modo) => (
          <button
            key={modo}
            type="button"
            aria-pressed={modo === modoSeleccionado}
            onClick={() => seleccionarModo(modo)}
          >
            {modo}
          </button>
        ))}
      </div>

      <button
        className="botonCalcular"
        data-testid="botonCalcular"
        type="button"
        onClick={calcular}
      >
        Calcular
      </button>

      {resultado !== null && (
        <>
          <p className="etiquetaResultado">Cada persona paga</p>
          <p className="resultado" data-testid="resultado">
            {resultado}
          </p>
        </>
      )}

      {error !== null && (
        <p className="mensajeError" data-testid="mensajeError" role="alert">
          {error}
        </p>
      )}
    </main>
  );
}
