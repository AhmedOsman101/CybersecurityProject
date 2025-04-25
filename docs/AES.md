# **File: `AES.ts`**

---

## Module Overview

Provides AES-ECB encryption and decryption utilities using CryptoJS, plus a simple console-based test harness. Exports:

- **`validateKey`** – check AES key length.
- **`AesEncrypt`** – encrypt UTF-8 text → Base64 ciphertext.
- **`AesDecrypt`** – decrypt Base64 ciphertext → UTF-8 text.
- **`AesTest`** – interactive demo: generate key, encrypt/decrypt user input, log hex outputs.

---

## Dependencies

| Import                 | Source        | Purpose                                                  |
| ---------------------- | ------------- | -------------------------------------------------------- |
| `Buffer`               | `node:buffer` | Binary data handling, encoding/decoding.                 |
| `randomBytes`          | `node:crypto` | Generate cryptographically secure random key bytes.      |
| `CryptoJS`             | `crypto-js`   | AES algorithm implementation (ECB mode, PKCS#7 padding). |
| `input`, `toHexString` | `./utils.ts`  | Read console input; convert `Buffer` → hex string.       |

---

## Functions

### `validateKey(key: Buffer): boolean`

Verify that a key’s length is valid for AES (16, 24, or 32 bytes).

- **Parameters**
  - `key` (`Buffer`): Raw key bytes.
- **Returns**
  - `boolean`: `true` if key length is 16, 24, or 32; otherwise `false`.

---

### `AesEncrypt(text: string, key: Buffer): string`

Encrypt a UTF-8 string under AES-ECB with PKCS#7 padding.

- **Parameters**
  - `text` (`string`): Plaintext to encrypt.
  - `key` (`Buffer`): AES key (validated length).
- **Returns**
  - `string`: Ciphertext encoded as a Base64 string.
- **Behavior**
  1. Wrap raw `Buffer` key as CryptoJS `WordArray`.
  2. Perform `CryptoJS.AES.encrypt` in ECB mode with PKCS#7 padding.
  3. Return the Base64 ciphertext.

---

### `AesDecrypt(encrypted: string, key: Buffer): string`

Decrypt a Base64-encoded AES-ECB ciphertext back to UTF-8.

- **Parameters**
  - `encrypted` (`string`): Base64 ciphertext from `AesEncrypt`.
  - `key` (`Buffer`): Same AES key used for encryption.
- **Returns**
  - `string`: Decrypted plaintext (UTF-8).
- **Behavior**
  1. Wrap raw `Buffer` key as CryptoJS `WordArray`.
  2. Perform `CryptoJS.AES.decrypt` in ECB mode with PKCS#7 padding.
  3. Convert result to UTF-8 string.

---

### `async function AesTest(): Promise<void>`

Interactive console demo for AES-ECB encryption/decryption.

- **Flow**

  1. Generate a random 16-byte key via `randomBytes(16)`.
  2. Display key in uppercase hex.
  3. Prompt user for plaintext via `input()`.
  4. Encrypt plaintext with `AesEncrypt`, convert ciphertext to hex, and display.
  5. Decrypt ciphertext with `AesDecrypt` and display result.
  6. Wrap in try/catch to log errors, and delimit output with markers.

- **Side Effects**
  - Reads from `stdin`, writes logs to `stdout`/`stderr`.

---

## Usage Example

```ts
import { validateKey, AesEncrypt, AesDecrypt, AesTest } from "./AES.ts";
import { randomBytes } from "node:crypto";

// Simple encryption:
const key = randomBytes(16);
if (!validateKey(key)) throw new Error("Invalid key length");
const cipherB64 = AesEncrypt("Hello, AES!", key);
const plain = AesDecrypt(cipherB64, key);

// Run interactive test:
await AesTest();
```
