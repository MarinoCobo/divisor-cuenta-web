# Quickstart: comprobar que el divisor funciona

## Requisitos

- Node.js 22.12 o superior (este proyecto se desarrolló con v26.8.2)
- npm (viene con Node)

## Instalar y levantar

```bash
cd divisor_cuenta_web
npm install
npm run dev          # Ctrl+C para cortarlo
```

Abre la dirección que imprime Vite (por defecto <http://localhost:5173>).

## Comprobar a mano los 6 escenarios de la spec

| # | Monto | Personas | Propina | Modo | Esperado en pantalla |
|---|---|---|---|---|---|
| 1 | 100 | 4 | 10 | Exacto | `27.50` |
| 2 | 90 | 3 | 0 | Exacto | `30.00` |
| 3 | 50 | 0 | 0 | Exacto | "Debe haber al menos una persona" y ningún número |
| 4 | abc | 4 | 0 | Exacto | "Monto inválido" |
| 5 | 10 | 3 | 0 | Exacto | `3.33` |
| 6 | 10 | 3 | 0 | Hacia arriba | `4.00` |

Después de cada cálculo, cambia cualquier campo o el modo: el resultado debe desaparecer
hasta el próximo clic en "Calcular" (FR-011).

## Comprobar automáticamente

```bash
npx vitest run test/division.test.js   # los 6 escenarios + LSP
npm test                               # toda la suite (10 pruebas)
npm run build                          # debe terminar sin errores
```

## Comprobar SOLID y las capas

```bash
git grep -n "from 'react'" -- src/domain/                            # sin salida
git grep -n "redondeoExacto\|redondeoHaciaArriba" -- src/            # solo data/ y main.jsx
git grep -n "instanceof\|=== 'exacto'\|=== 'arriba'" -- src/domain/calcularDivision.js
git grep -n "toFixed\|inválido\|al menos una persona" -- src/domain/calcularDivision.js
```

Las dos últimas no deben devolver nada.

## Comprobar que funciona sin conexión (FR-009 / SC-004)

```bash
git grep -nE "fetch|axios|XMLHttpRequest|localStorage|sessionStorage" -- src/
```

Sin salida: la app no hace ninguna llamada de red ni guarda datos. Una vez cargada la
página, funciona con el navegador desconectado.
