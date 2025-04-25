# **File: `LCG.ts`**

---

## Module Overview

This module implements a Linear Congruential Generator (LCG) for producing a deterministic sequence of pseudorandom `bigint` values. It defines commonly used parameters (modulus, multiplier, increment), constructs the generator, and exposes both the generator instance and a helper to retrieve successive values.

---

## Constants

| Name           | Value                         | Type     | Description                                                                               |
| -------------- | ----------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| `MODULUS`      | `18_446_744_073_709_551_616n` | `bigint` | The modulus $m$. Here set to $2^{64}$, a prime power.                                 |
| `MULTIPLIER`   | `6_364_136_223_846_793_005n`  | `bigint` | The multiplier $a$. A primitive root modulo m, per MMIX parameters (Knuth).             |
| `INCREMENT`    | `1_442_695_040_888_963_407n`  | `bigint` | The increment $c$. Nonzero makes this a full LCG; if zero, becomes a multiplicative CG. |
| `INITIAL_SEED` | `BigInt(Date.now())`          | `bigint` | Initial seed value in $[0, m-1]$, derived from the current timestamp in milliseconds.   |

---

## Generator Function

### `function* LcgGenerator(m: bigint, a: bigint, c: bigint, seed: bigint): Generator<bigint>`

Produce an infinite sequence of pseudorandom `bigint` values via the recurrence:

$$
X\_{n+1} = (a \cdot X_n + c) \bmod m
$$

- **Parameters**

  - `m` (`bigint`): Modulus.
  - `a` (`bigint`): Multiplier.
  - `c` (`bigint`): Increment.
  - `seed` (`bigint`): Starting state $X_0$.

- **Yields**

  - `bigint`: Next state $X\_{n+1}$ on each iteration.

- **Behavior**
  1. In an infinite loop, update `seed = (a * seed + c) % m`.
  2. Yield the new `seed`.

---

## Exports

- `export const getLcg = (lcg: Generator<bigint>): bigint => lcg.next().value;`  
  **Helper function**

  - **Parameter**:
    - `lcg` (`Generator<bigint>`): An LCG generator instance.
  - **Returns**:
    - `bigint`: The next pseudorandom value from the generator.
  - **Usage**: Call `getLcg(LCG)` to advance the sequence and retrieve a value.

- `export const LCG = LcgGenerator(MODULUS, MULTIPLIER, INCREMENT, INITIAL_SEED);`  
  **Generator instance**
  - Preconfigured LCG using the module’s constants.
  - Can be passed into `getLcg` to produce pseudorandom outputs.

---

## Usage Example

```ts
import { LCG, getLcg } from "./LCG.ts";

// Retrieve three pseudorandom values:
const r1 = getLcg(LCG);
const r2 = getLcg(LCG);
const r3 = getLcg(LCG);
```
