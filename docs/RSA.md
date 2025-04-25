# **File: `RSA.ts`**

---

## Module Overview

Implements RSA key‐generation, encryption, decryption, and an interactive test harness.

- **Key generation** uses a Linear Congruential Generator (LCG) to produce prime candidates.
- **Encryption/Decryption** operate on UTF-8 strings ↔ `bigint` ciphertext via modular exponentiation.
- **RsaTest** ties it all together: generate keys, export PEM, encrypt user input, then decrypt.

---

## Dependencies

| Import                                    | Source         | Purpose                                                                      |
| ----------------------------------------- | -------------- | ---------------------------------------------------------------------------- |
| `Buffer`                                  | `node:buffer`  | Convert between strings, hex, and `bigint`.                                  |
| `checkPrimeSync`                          | `node:crypto`  | Synchronous Miller–Rabin primality test for candidate primes.                |
| `PrivateKey, PublicKey, RsaKeyComponents` | `./index.d.ts` | Type definitions for RSA keys and components.                                |
| `getLcg, LCG`                             | `./LCG.ts`     | Generate pseudorandom `bigint` values for prime candidates.                  |
| `modInverse, modPower`                    | `./math.ts`    | Compute modular inverse and modular exponentiation.                          |
| `keysToPem`                               | `./pem.ts`     | Export RSA key components to PEM-encoded strings.                            |
| `bigintToBase64, bigintToBuffer, input`   | `./utils.ts`   | Encode `bigint` ↔ Base64; convert `bigint` ↔ `Buffer`; read console input. |

---

## Functions

### `generateLCGPrime(): bigint`

Produce a prime number using the LCG as a pseudorandom source.

- **Returns**
  - `bigint`: A prime ≥ 65 537.
- **Behavior**
  1. Draw a `candidate` from `getLcg(LCG)`.
  2. Reject if `< 65 537` or even (make odd).
  3. Test primality with `checkPrimeSync(..., { checks: 5 })`.
  4. Repeat until prime found.

---

### `generateRSAKeys(): RsaKeyComponents`

Generate an RSA key pair and return all components.

- **Returns**
  ```ts
  {
    publicKey: { e: bigint; n: bigint },
    privateKey: { d: bigint; n: bigint },
    primes: { p: bigint; q: bigint }
  }
  ```
- **Steps**
  1. Generate distinct primes `p, q` via `generateLCGPrime()`.
  2. Compute modulus `n = p * q`.
  3. Compute totient `φ = (p - 1) * (q - 1)`.
  4. Choose public exponent `e = 65 537n`.
  5. Compute private exponent `d = e⁻¹ mod φ` via `modInverse`.

---

### `RsaEncrypt(message: string, publicKey: PublicKey): bigint`

Encrypt a UTF-8 string under the RSA public key.

- **Parameters**
  - `message` (`string`): Plaintext.
  - `publicKey` (`{ e: bigint; n: bigint }`)
- **Returns**
  - `bigint`: Ciphertext \(c = m^e mod n\).
- **Behavior**
  1. Convert `message` → `Buffer` → hex string → `bigint` `m`.
  2. Compute `modPower(m, e, n)`.

---

### `RsaDecrypt(ciphertext: bigint, privateKey: PrivateKey): string`

Decrypt an RSA ciphertext to UTF-8.

- **Parameters**
  - `ciphertext` (`bigint`)
  - `privateKey` (`{ d: bigint; n: bigint }`)
- **Returns**
  - `string`: Recovered plaintext.
- **Behavior**
  1. Compute `m = modPower(ciphertext, d, n)`.
  2. Convert `m` → hex string, pad to even length.
  3. Build `Buffer` from hex, decode UTF-8.

---

### `async function RsaTest(): Promise<void>`

Interactive demonstration: generate keys, export PEM, encrypt/decrypt user input.

- **Flow**
  1. Generate RSA components via `generateRSAKeys()`.
  2. Export PEM strings with `keysToPem()`.
  3. Log public & private PEM.
  4. Prompt user for a message via `input()`.
  5. Encrypt with `RsaEncrypt`, display Base64 ciphertext.
  6. Decrypt with `RsaDecrypt`, display recovered message.
- **Side Effects**: console I/O.

---

## Usage Example

```ts
import { RsaEncrypt, RsaDecrypt, RsaTest, generateRSAKeys } from "./RSA.ts";

// Direct usage:
const { publicKey, privateKey } = generateRSAKeys();
const c = RsaEncrypt("Hello RSA", publicKey);
const m = RsaDecrypt(c, privateKey);

// Interactive:
await RsaTest();
```
