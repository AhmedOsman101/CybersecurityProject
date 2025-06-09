import type { PublicKey, RsaKeyComponents } from "./index.d.ts";
import { modInverse } from "./math.ts";
import { ab2b64, base64UrlToBigInt, toBase64Url } from "./utils.ts";

/** Insert `\n` every 64 chars */
function wrap64(b64: string): string {
  // biome-ignore lint/style/noNonNullAssertion: The RegEx is always valid
  return b64.match(/.{1,64}/g)!.join("\n");
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

export function pemToArrayBuffer(pem: string): ArrayBuffer {
  // strip header/footer and line-breaks
  const b64 = pem
    .replace(/-----(BEGIN|END)[\w\s]+-----/g, "")
    .replace(/\s+/g, "");

  // decode Base64 to Uint8Array
  const raw = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return raw.buffer;
}

export async function pemToComponents(
  publicKeyPem: string,
  privateKeyPem: string
): Promise<RsaKeyComponents> {
  const spkiBuf = pemToArrayBuffer(publicKeyPem);
  const pubKey = await crypto.subtle.importKey(
    "spki",
    spkiBuf,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );

  const pkcs8Buf = pemToArrayBuffer(privateKeyPem);
  const privKey = await crypto.subtle.importKey(
    "pkcs8",
    pkcs8Buf,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    true,
    ["sign"]
  );

  const pubJwk = await crypto.subtle.exportKey("jwk", pubKey);
  const privJwk = await crypto.subtle.exportKey("jwk", privKey);

  const n = base64UrlToBigInt(pubJwk.n as string);
  const e = base64UrlToBigInt(pubJwk.e as string);
  const d = base64UrlToBigInt(privJwk.d as string);
  const p = base64UrlToBigInt(privJwk.p as string);
  const q = base64UrlToBigInt(privJwk.q as string);

  return {
    publicKey: { e, n },
    privateKey: { d, n },
    primes: { p, q },
  };
}
