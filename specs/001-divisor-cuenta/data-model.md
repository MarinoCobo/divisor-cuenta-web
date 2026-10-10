# Data Model: Divisor de cuenta

Todas las entidades viven en `src/domain/` (JavaScript puro, sin `react` ni DOM) y se
tratan como inmutables: se crean con una función fábrica y nadie les reasigna campos.

## Cuenta

Lo que el usuario ingresó, ya convertido a números.

| Campo | Tipo | Regla (la aplica `validarEntrada`) |
|---|---|---|
| `monto` | `number` | finito, > 0 y ≤ 1 000 000 000; si no: "Monto inválido" |
| `personas` | `number` (entero) | ≥ 1; si no: "Debe haber al menos una persona" |
| `propina` | `number` | porcentaje finito entre 0 y 100; si no: "Propina inválida" |

Orden de validación: monto → personas → propina. Se devuelve solo el primer error.

## Resultado

| Campo | Tipo | Significado |
|---|---|---|
| `montoPorPersona` | `number` | lo que paga cada persona, ya redondeado por la estrategia |

## estrategiaRedondeo (contrato)

Es el "modo de redondeo" de la spec: el usuario ve un modo ("Exacto", "Hacia arriba"),
el código lo implementa como un objeto que cumple este contrato. En Dart era
`abstract interface class` con el método `redondear`; en JavaScript es un contrato
estructural con la función `aplicar`.

| Función | Recibe | Devuelve |
|---|---|---|
| `aplicar` | `number` monto por persona sin redondear (finito, ≥ 0) | `number` monto redondeado |

Implementaciones en `src/data/`:

| Módulo | Regla | Ejemplos |
|---|---|---|
| `redondeoExacto` | al centavo más cercano, mitad hacia arriba | 3.3333 → 3.33; 27.5 → 27.50; 1.005 → 1.01 |
| `redondeoHaciaArriba` | al entero superior, salvo que ya sea entero | 3.3333 → 4.00; 30.0 → 30.00 |

## Estado de la vista (en `useDivisor`)

```text
            cambia una entrada / modo
   ┌───────────────────────────────────────┐
   ↓                                       │
[VACÍO] ──Calcular (válido)──→ [CON RESULTADO]
   │  ↑                                    │
   │  └──── cambia una entrada / modo ─────┤
   │                                       │
   └──Calcular (inválido)──→ [CON ERROR] ←─┘ Calcular (inválido)
```

- `resultado` y `error` nunca tienen valor al mismo tiempo (FR-007).
- `modoSeleccionado` empieza en el primer modo del mapa ("Exacto", FR-006).
- Las tres entradas se guardan como **texto**, no como número: el escenario 4 de la spec
  exige que "abc" llegue al validador tal cual.
