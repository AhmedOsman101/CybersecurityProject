# **File: `pem.ts`**

---

## Module Overview

Handles conversion between RSA key components and PEM‐encoded strings (SPKI for public, PKCS#8 for private), plus parsing PEM back into raw key components.

- Export RSA keys (JWK → Web Crypto → DER → Base64 → PEM).
- Import PEM (strip headers → ArrayBuffer → Web Crypto → JWK → BigInt components).

---

## Dependencies

| Import                                   | Source         | Purpose                                                      |
| ---------------------------------------- | -------------- | ------------------------------------------------------------ |
| `PublicKey, RsaKeyComponents`            | `./index.d.ts` | Type definitions for RSA keys and prime components.          |
| `modInverse`                             | `./math.ts`    | Compute modular inverse for CRT parameters.                  |
| `ab2b64, base64UrlToBigInt, toBase64Url` | `./utils.ts`   | Encoding conversions between ArrayBuffer, Base64URL, BigInt. |

---

## Internal Helper

### `wrap64(b64: string): string`

Insert line breaks every 64 characters in a Base64 string for PEM formatting.

- **Parameter**
  - `b64` (`string`): Unbroken Base64 text.
- **Returns**
  - `string`: Same text with `\n` after every 64 characters.

---

## Export Functions

### `exportPublicKeyPem(pub: PublicKey): Promise<string>`

Convert a public RSA key to a PEM‐encoded SPKI string.

- **Parameter**
  - `pub` (`PublicKey`): `{ e: bigint; n: bigint }`
- **Returns**
  - `Promise<string>`: PEM text:
    ```
    -----BEGIN PUBLIC KEY-----
    …Base64 SPKI…
    -----END PUBLIC KEY-----
    ```
- **Behavior**
  1. Build minimal JWK with `kty`, `n`, `e`, `alg`, `ext`.
  2. Import into Web Crypto as `"RSA-OAEP"` key.
  3. Export DER bytes in SPKI format.
  4. Base64-encode DER, wrap lines, and add PEM headers/footers.

---

### `exportPrivateKeyPem(keys: RsaKeyComponents): Promise<string>`

Convert full RSA key components to a PEM‐encoded PKCS#8 private key.

- **Parameter**
  - `keys` (`RsaKeyComponents`):
    ```ts
    { publicKey: { e, n }, privateKey: { d, n }, primes: { p, q } }
    ```
- **Returns**
  - `Promise<string>`: PEM text:
    ```
    -----BEGIN PRIVATE KEY-----
    …Base64 PKCS#8…
    -----END PRIVATE KEY-----
    ```
- **Behavior**
  1. Compute CRT parameters:
     - `dp = d mod (p-1)`
     - `dq = d mod (q-1)`
     - `qi = q⁻¹ mod p`
  2. Build full JWK with `n,e,d,p,q,dp,dq,qi,alg,ext`.
  3. Import as `"RSASSA-PKCS1-v1_5"` key.
  4. Export DER bytes in PKCS#8 format.
  5. Base64-encode, wrap, add PEM headers/footers.

---

### `keysToPem(keys: RsaKeyComponents): Promise<{ publicKeyPem: string; privateKeyPem: string }>`

Top-level helper to export both public and private PEM in parallel.

- **Parameter**
  - `keys` (`RsaKeyComponents`)
- **Returns**
  - `Promise<{ publicKeyPem: string; privateKeyPem: string }>`

---

### `pemToArrayBuffer(pem: string): ArrayBuffer`

Convert a PEM string into raw DER bytes.

- **Parameter**
  - `pem` (`string`): PEM with header/footer and line breaks.
- **Returns**
  - `ArrayBuffer`: DER-encoded key bytes.
- **Behavior**
  1. Strip `-----BEGIN/END ...-----` lines and whitespace.
  2. Base64-decode to `Uint8Array`.
  3. Return its `.buffer`.

---

### `pemToComponents(publicKeyPem: string, privateKeyPem: string): Promise<RsaKeyComponents>`

Parse PEM-encoded public & private keys back into raw BigInt components.

- **Parameters**
  - `publicKeyPem` (`string`): SPKI PEM.
  - `privateKeyPem` (`string`): PKCS#8 PEM.
- **Returns**
  - `Promise<RsaKeyComponents>`: Extracted `{ publicKey, privateKey, primes }`.
- **Behavior**
  1. Convert each PEM → `ArrayBuffer`.
  2. Import via Web Crypto (`"RSA-OAEP"` for public, `"RSASSA-PKCS1-v1_5"` for private).
  3. Export each key as JWK.
  4. Convert JWK Base64URL fields `n,e,d,p,q` back to `bigint`.

---

## Usage Example

```ts
import { keysToPem, pemToComponents } from "./pem.ts";
import { generateRsaKeys } from "./yourKeyGenModule.ts"; // returns RsaKeyComponents

async function demo() {
  const keys = await generateRsaKeys();
  const { publicKeyPem, privateKeyPem } = await keysToPem(keys);

  console.log(publicKeyPem);
  console.log(privateKeyPem);

  // Parse back into components:
  const parsed = await pemToComponents(publicKeyPem, privateKeyPem);
  console.log(parsed.publicKey.e, parsed.publicKey.n);
}
```
