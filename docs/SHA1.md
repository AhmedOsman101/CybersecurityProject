# **File: `SHA1.ts`**

---

## Module Overview

Implements the SHA-1 cryptographic hash algorithm in TypeScript, including:

- Message preprocessing (padding, length encoding).
- Block-wise processing with the SHA-1 compression function.
- Utility for interactive testing via console input.

Exports:

- `sha1(message: string): string` – compute SHA-1 digest as a hex string.
- `Sha1Test(): Promise<void>` – prompt user for input, hash it, and log results.

---

## Dependencies

| Import   | Source        | Purpose                                         |
| -------- | ------------- | ----------------------------------------------- |
| `Buffer` | `node:buffer` | Byte-level operations, big-endian reads/writes. |
| `input`  | `./utils.ts`  | Read a line of text from the terminal.          |

---

## Internal Helper

### `rotateLeft(x: number, n: number): number`

Perform a 32-bit circular left rotation.

- **Parameters**
  - `x` (`number`): 32-bit unsigned value.
  - `n` (`number`): Number of bits to rotate left.
- **Returns**
  - (`number`): Result of `(x << n) | (x >>> (32 – n))`, forced to unsigned 32-bit.

---

## Preprocessing

### `preprocess(message: string): Buffer`

Prepare the input string for SHA-1 block processing.

1. Convert UTF-8 text → `Buffer`.
2. Append `0x80` byte (single '1' bit).
3. Pad with `0x00` bytes until length ≡ 56 mod 64.
4. Append 8-byte big-endian length (original bit-length).

- **Parameters**
  - `message` (`string`): Input text.
- **Returns**
  - (`Buffer`): Padded message whose length is a multiple of 64 bytes.

---

## Core Hash Function

### `sha1(message: string): string`

Compute SHA-1 digest of a string.

- **Parameters**
  - `message` (`string`): Text to hash.
- **Returns**
  - (`string`): 40-character lowercase hex digest.

#### Processing Steps

1. **Initialize** five 32-bit state words:
   ```
   H0 = 0x67452301
   H1 = 0xefcdab89
   H2 = 0x98badcfe
   H3 = 0x10325476
   H4 = 0xc3d2e1f0
   ```
2. **For each 64-byte chunk**:
   - Parse into sixteen 32-bit big-endian words `W[0..15]`.
   - Extend to `W[16..79]` via
     ```
     W[t] = ROTL1(W[t-3] ⊕ W[t-8] ⊕ W[t-14] ⊕ W[t-16])
     ```
   - Initialize working vars `a,b,c,d,e = H0..H4`.
   - Perform 80 rounds:
     - Select round function `f` and constant `k` based on t:  
       | t range | f | k |
       |---------|-----------------------------------|-----------|
       | 0–19 | (b & c) \| (~b & d) (Ch) | 0x5a827999|
       | 20–39 | b ⊕ c ⊕ d (Parity) | 0x6ed9eba1|
       | 40–59 | (b & c) \| (b & d) \| (c & d) (Maj)| 0x8f1bbcdc|
       | 60–79 | b ⊕ c ⊕ d (Parity) | 0xca62c1d6|
     - Compute
       ```
       temp = ROTL5(a) + f + e + k + W[t]
       e = d; d = c; c = ROTL30(b); b = a; a = temp
       ```
   - Add `a..e` back into `H0..H4`.
3. **Concatenate** `H0..H4` into a 20-byte buffer and output hex.

---

## Interactive Test

### `async function Sha1Test(): Promise<void>`

Prompt for plaintext, compute SHA-1, and print both.

- Uses `input()` from `utils.ts` for console prompt.
- Logs markers before and after test.
- Catches and logs any errors.

---

## Usage Example

```ts
import { sha1, Sha1Test } from "./SHA1.ts";

// Compute hash directly:
const digest = sha1("hello world");
// digest === "2aae6c35c94fcfb415dbe95f408b9ce91ee846ed"

// Run interactive test:
await Sha1Test();
```
