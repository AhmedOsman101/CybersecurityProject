# **File: `index.d.ts`**

---

## Module Overview

This declaration file defines TypeScript types representing RSA key material and its components. These types are used to describe the shape of public/private keys and their underlying prime factors.

---

## Type Definitions

### `PublicKey`

Represents the public portion of an RSA key pair.

| Property | Type     | Description                      |
| -------- | -------- | -------------------------------- |
| `e`      | `bigint` | Public exponent.                 |
| `n`      | `bigint` | Modulus (product of two primes). |

```ts
export type PublicKey = {
  e: bigint;
  n: bigint;
};
```

---

### `PrivateKey`

Represents the private portion of an RSA key pair.

| Property | Type     | Description                          |
| -------- | -------- | ------------------------------------ |
| `d`      | `bigint` | Private exponent.                    |
| `n`      | `bigint` | Modulus (same as in the public key). |

```ts
export type PrivateKey = {
  d: bigint;
  n: bigint;
};
```

---

### `RsaKeyComponents`

Groups both public and private keys along with the prime factors used to generate the modulus.

| Property     | Type                       | Description                                                 |
| ------------ | -------------------------- | ----------------------------------------------------------- |
| `publicKey`  | `PublicKey`                | The RSA public key (`e`, `n`).                              |
| `privateKey` | `PrivateKey`               | The RSA private key (`d`, `n`).                             |
| `primes`     | `{ p: bigint; q: bigint }` | The two prime factors `p` and `q` whose product equals `n`. |

```ts
export type RsaKeyComponents = {
  publicKey: PublicKey;
  privateKey: PrivateKey;
  primes: { p: bigint; q: bigint };
};
```

---

## Usage

These types enable strong typing when generating, exporting, or consuming RSA keys in a Deno/TypeScript codebase. For example:

```ts
import type { PublicKey, PrivateKey, RsaKeyComponents } from "./index.d.ts";

function encryptWithPublicKey(msg: bigint, key: PublicKey): bigint {
  return msg ** key.e % key.n;
}

function generateKeys(): RsaKeyComponents {
  // ... key generation logic producing p, q, e, d ...
  return { publicKey: { e, n }, privateKey: { d, n }, primes: { p, q } };
}
```
