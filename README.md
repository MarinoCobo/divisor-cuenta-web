# divisor_cuenta_web

Página web de una sola vista para dividir la cuenta de un restaurante. Escribes el monto
total, el número de personas y el porcentaje de propina, eliges el modo de redondeo
(exacto o hacia arriba) y al hacer clic en **Calcular** ves cuánto paga cada persona, con
dos decimales. Funciona sin conexión: no usa red ni guarda datos.

Es la versión **React** del [Deber 2](respuestas.md) de Programación Asistida de
Aplicaciones (USFQ): el mismo divisor de cuenta del laboratorio anterior, que estaba en
Flutter, reimplementado **reutilizando la misma especificación sin cambiarla**.

> La spec de este proyecto es byte por byte la del proyecto Flutter (mismo SHA-256,
> `423d0f60…`). Lo único que se rehízo fue el plan, las tareas y el código.

## Los artefactos de SDD

| Artefacto | Dónde |
|---|---|
| Especificación (importada sin cambios) | [`specs/001-divisor-cuenta/spec.md`](specs/001-divisor-cuenta/spec.md) |
| Plan de implementación | [`specs/001-divisor-cuenta/plan.md`](specs/001-divisor-cuenta/plan.md) |
| Tareas | [`specs/001-divisor-cuenta/tasks.md`](specs/001-divisor-cuenta/tasks.md) |
| Constitución | [`.specify/memory/constitution.md`](.specify/memory/constitution.md) |
| Análisis QUÉ / CÓMO / MIXTO | [`analisis_spec.md`](analisis_spec.md) |
| Respuestas del deber | [`respuestas.md`](respuestas.md) |
| Salida de `/speckit-analyze` | [`specs/001-divisor-cuenta/analisis-speckit.md`](specs/001-divisor-cuenta/analisis-speckit.md) |
| Salida de `/speckit-converge` | [`specs/001-divisor-cuenta/convergencia-speckit.md`](specs/001-divisor-cuenta/convergencia-speckit.md) |

La bitácora con las métricas está en `bitacora.md`, en la rama `sdd` del proyecto Flutter.

## Requisitos

- Node.js 22.12 o superior (probado con v26.8.2) y npm.
- No hace falta ninguna API key ni cuenta.

## Instalar y correr

```bash
npm install
npm run dev          # Ctrl+C para cortarlo
```

## Comprobar

```bash
npm test             # 34 pruebas: 6 escenarios + LSP + 3 de la vista + 24 de casos borde
npm run build        # debe terminar sin errores
```

Para correr solo los 6 escenarios de aceptación de la spec:

```bash
npx vitest run test/division.test.js
```

Los pasos de comprobación a mano, y los comandos que verifican SOLID y las capas, están en
[`specs/001-divisor-cuenta/quickstart.md`](specs/001-divisor-cuenta/quickstart.md).

## Arquitectura

Tres capas, con la regla de dependencia `presentation -> domain <- data`:

```text
src/
├── domain/          JavaScript puro: no importa react ni nada del DOM
│   ├── cuenta.js                  entidad: monto, personas, propina
│   ├── resultado.js               entidad: monto por persona
│   ├── estrategiaRedondeo.js      el contrato: una función aplicar(valor)  (ISP)
│   ├── calcularDivision.js        solo calcula                             (SRP)
│   └── validarEntrada.js          solo valida                              (SRP)
├── data/
│   ├── redondeoExacto.js          cumple el contrato                       (OCP/LSP)
│   └── redondeoHaciaArriba.js     cumple el contrato                       (OCP/LSP)
├── presentation/
│   ├── useDivisor.js              hook; recibe sus dependencias            (DIP)
│   ├── formateadorMoneda.js       solo formatea                            (SRP)
│   └── PantallaDivisor.jsx        solo dibuja
└── main.jsx                       único punto de composición
```

Para agregar un modo de redondeo nuevo: se crea su módulo en `src/data/` y se agrega una
línea al mapa de `src/main.jsx`. No se edita ningún módulo existente.

## Estándares

- Nombres de módulos, funciones y variables en español.
- Sin librerías de estado externas: el estado de una sola vista se cubre con `useState`.
- Todo módulo y función exportada de `src/` lleva JSDoc con qué hace, por qué existe, qué
  recibe, qué devuelve y qué errores produce.
