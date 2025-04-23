import { Buffer } from "node:buffer";
import type { PublicKey, RsaKeyComponents } from "./index.d.ts";
import { modInverse } from "./math.ts";

/** Convert ArrayBuffer → Base64 string */
function ab2b64(ab: ArrayBuffer): string {
  return Buffer.from(new Uint8Array(ab)).toString("base64");
}
/** Insert `\n` every 64 chars */
function wrap64(b64: string): string {
  return b64.match(/.{1,64}/g)!.join("\n");
}

function toBase64Url(n: bigint): string {
  let hex = n.toString(16);
  if (hex.length % 2 === 1) hex = `0${hex}`; // ensure even length
  return Buffer.from(hex, "hex").toString("base64url");
}

/** Export an RSA public key to PEM (SPKI) */
async function exportPublicKeyPem(pub: PublicKey): Promise<string> {
  // build minimal JWK
  const jwk = {
    kty: "RSA",
    n: toBase64Url(pub.n),
    e: toBase64Url(pub.e),
    alg: "RSA-OAEP-256",
    ext: true,
  };
  // import as RSA-OAEP key (encrypt usage) :contentReference[oaicite:3]{index=3}
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
  // export SPKI DER bytes :contentReference[oaicite:4]{index=4}
  const der = await crypto.subtle.exportKey("spki", key);
  const b64 = ab2b64(der);
  return [
    "-----BEGIN PUBLIC KEY-----",
    wrap64(b64),
    "-----END PUBLIC KEY-----",
  ].join("\n");
}

/** Export an RSA private key to PEM (PKCS#8) */
async function exportPrivateKeyPem(keys: RsaKeyComponents): Promise<string> {
  const {
    privateKey: { d, n },
    publicKey: { e },
    primes: { p, q },
  } = keys;
  // compute CRT params
  const dp = d % (p - 1n);
  const dq = d % (q - 1n);
  const qi = modInverse(q, p);
  // build full JWK :contentReference[oaicite:5]{index=5}
  const jwkPriv = {
    kty: "RSA",
    n: toBase64Url(n),
    e: toBase64Url(e),
    d: toBase64Url(d),
    p: toBase64Url(p),
    q: toBase64Url(q),
    dp: toBase64Url(dp),
    dq: toBase64Url(dq),
    qi: toBase64Url(qi),
    alg: "RS256",
    ext: true,
  };
  // import as RSASSA-PKCS1-v1_5 key (sign usage)
  const key = await crypto.subtle.importKey(
    "jwk",
    jwkPriv,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    true,
    ["sign"]
  );
  // export PKCS#8 DER bytes :contentReference[oaicite:6]{index=6}
  const der = await crypto.subtle.exportKey("pkcs8", key);
  const b64 = ab2b64(der);
  return [
    "-----BEGIN PRIVATE KEY-----",
    wrap64(b64),
    "-----END PRIVATE KEY-----",
  ].join("\n");
}

/** Top-level: returns both PEM strings */
export async function keysToPem(keys: RsaKeyComponents): Promise<{
  publicKeyPem: string;
  privateKeyPem: string;
}> {
  const [publicKeyPem, privateKeyPem] = await Promise.all([
    exportPublicKeyPem(keys.publicKey),
    exportPrivateKeyPem(keys),
  ]);
  return { publicKeyPem, privateKeyPem };
}
