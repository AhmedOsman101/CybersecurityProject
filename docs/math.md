# **File: `math.ts`**

---

## Module Overview

This module provides fundamental bit- and modular-arithmetic operations on `bigint` values, including:

- Counting binary digits.
- Computing modular inverses via the Extended Euclidean Algorithm.
- Performing modular exponentiation efficiently.

All functions operate strictly on `bigint` inputs and return `bigint` or `number` results as appropriate.

---

## Dependencies

This file has no external imports; it relies solely on built-in `bigint` arithmetic.

---

## Functions

### `countBits(num: bigint): number`

Determine the number of bits required to represent a given integer in binary.

- **Parameters**
  - `num` (`bigint`): The integer whose bit-length is to be counted. May be positive, negative, or zero.
- **Returns**
  - `number`: The count of binary digits (bits).
- **Behavior**
  1. If `num` is exactly `0n`, returns `1` (one bit to represent zero).
  2. Works with the absolute value of `num`.
  3. Repeatedly shifts right by one bit (`temp >>= 1n`) until the value becomes zero, incrementing a counter on each shift.

---

### `modInverse(a: bigint, m: bigint): bigint`

Compute the modular multiplicative inverse of `a` modulo `m`, i.e. find `x` such that `(a * x) % m === 1`.

- **Parameters**
  - `a` (`bigint`): The value whose inverse is sought.
  - `m` (`bigint`): The modulus.
- **Returns**
  - `bigint`: The modular inverse in the range `[0, m-1]` if one exists; otherwise returns `1n`.
- **Behavior**
  1. Uses the Extended Euclidean Algorithm to compute coefficients `(oldS, oldR)` satisfying `oldS·a + oldT·m = gcd(a,m)`.
  2. Iteratively updates remainders and coefficients until the remainder is zero.
  3. If the greatest common divisor is `1`, adjusts `oldS` into the range `[0, m)` and returns it; otherwise returns `1n`.

---

### `modPower(base: bigint, exp: bigint, modulus: bigint): bigint`

Perform modular exponentiation: compute `(base^exp) % modulus` efficiently using the "exponentiation by squaring" method.

- **Parameters**
  - `base` (`bigint`): The base value.
  - `exp` (`bigint`): The exponent (non-negative).
  - `modulus` (`bigint`): The modulus.
- **Returns**
  - `bigint`: The result of modular exponentiation in the range `[0, modulus-1]`.
- **Behavior**
  1. Reduces `base` modulo `modulus`.
  2. Initializes `result = 1n`.
  3. While `exp > 0`:
     - If the current least significant bit of `exp` is `1`, multiply `result` by `base` modulo `modulus`.
     - Square `base` modulo `modulus`.
     - Divide `exp` by 2 (integer division).
  4. Returns `result`.
