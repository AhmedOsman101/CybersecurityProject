**File: `utils.ts`**

---

## Module Overview

This module provides a set of utility functions for:

- Converting between binary representations (`Buffer`, `ArrayBuffer`, `BigInt`) and textual encodings (hex, Base64, Base64URL).
- Generating cryptographically-secure random data (strings, integers).
- Reading user input from the terminal.

All functions are exported for use elsewhere in the codebase.

---

## Dependencies

| Import            | Source          | Purpose                                                      |
| ----------------- | --------------- | ------------------------------------------------------------ |
| `Buffer`          | `node:buffer`   | Handle binary data and perform encoding/decoding operations. |
| `randomInt`       | `node:crypto`   | Generate cryptographically secure random integers.           |
| `process`         | `node:process`  | Access standard input/output streams for user interaction.   |
| `createInterface` | `node:readline` | Construct a readline interface for terminal input.           |

---

## Functions

### `toHexString(buffer: Buffer): string`

Convert a `Buffer` into its hexadecimal string representation.

- **Parameters**
  - `buffer` (`Buffer`): Binary data to convert.
- **Returns**
  - `string`: Lowercase hex string (e.g. `"0a3f"`).

---

### `input(prompt: string): Promise<string>`

Prompt the user on the terminal and read a line of input.

- **Parameters**
  - `prompt` (`string`): Text displayed to the user before input.
- **Returns**
  - `Promise<string>`: Resolves to the user’s input (without trailing newline).

---

### `bigintToBuffer(n: bigint): Buffer`

Convert a `BigInt` value into a `Buffer` of its big-endian binary representation.

- **Parameters**
  - `n` (`bigint`): Integer to convert.
- **Returns**
  - `Buffer`: Byte array representing the integer.

---

### `generateRandomKey(length: number): string`

Produce a random alphanumeric string of specified length using a secure RNG.

- **Parameters**
  - `length` (`number`): Desired length of the output string.
- **Returns**
  - `string`: Random string composed of `[a–zA–Z0–9]`.

---

### `base64UrlToBigInt(b64url: string): bigint`

Decode a Base64-URL-encoded string into a `BigInt`.

- **Parameters**
  - `b64url` (`string`): Base64URL string (characters `A–Z`, `a–z`, `0–9`, `-`, `_`).
- **Returns**
  - `bigint`: Integer value represented by the decoded bytes.
- **Behavior**
  1. Replace URL-safe characters (`-` → `+`, `_` → `/`).
  2. Pad with `=` to reach a length divisible by 4.
  3. Decode to binary via `atob`.
  4. Convert binary to hex, then to `BigInt`.

---

### `ab2b64(ab: ArrayBuffer): string`

Convert an `ArrayBuffer` into a standard Base64 string.

- **Parameters**
  - `ab` (`ArrayBuffer`): Raw binary buffer.
- **Returns**
  - `string`: Base64-encoded representation.

---

### `toBase64Url(n: bigint): string`

Encode a `BigInt` as a Base64URL string.

- **Parameters**
  - `n` (`bigint`): Integer to encode.
- **Returns**
  - `string`: URL-safe Base64 string (no padding).
- **Behavior**
  1. Convert `BigInt` → hex, pad to even length.
  2. Create `Buffer` from hex.
  3. Encode using Base64URL variant.

---

### `bigintToBase64(x: bigint): string`

Encode a `BigInt` as a standard Base64 string.

- **Parameters**
  - `x` (`bigint`): Integer to encode.
- **Returns**
  - `string`: Standard Base64 string (with `=` padding as needed).

---

### `base64ToBigInt(base64: string): bigint`

Decode a standard Base64 string into a `BigInt`.

- **Parameters**
  - `base64` (`string`): Base64-encoded input.
- **Returns**
  - `bigint`: Integer value of the decoded data.
- **Errors Thrown**
  - If input is empty or not a string.
  - If input contains invalid Base64 characters.
  - If decoding produces an empty buffer.
  - Any other failure during decoding.
