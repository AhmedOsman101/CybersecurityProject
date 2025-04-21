import { Buffer } from "node:buffer";
import { checkPrimeSync } from "node:crypto";
import { GetLcg, LCG } from "./LCG.ts"; // Your existing LCG implementation

// Convert BigInt to Buffer for crypto module
function bigintToBuffer(n: bigint): Buffer {
  let hex = n.toString(16);
  if (hex.length % 2) hex = `0${hex}`; // Pad even-length hex
  return Buffer.from(hex, "hex");
}

// Generate prime candidates using LCG
function generateLCGPrime(): bigint {
  let candidate: bigint;
  do {
    candidate = GetLcg(LCG);
    // Ensure minimum size and oddness
    if (candidate < 65537n) continue;
    if (candidate % 2n === 0n) candidate += 1n;
  } while (!checkPrimeSync(bigintToBuffer(candidate), { checks: 5 }));
  return candidate;
}

// Modular inverse using Extended Euclidean Algorithm
function modInverse(a: bigint, m: bigint): bigint {
  let [oldR, r] = [a, m];
  let [oldS, s] = [1n, 0n];
  while (r !== 0n) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }
  return oldR === 1n ? (oldS + m) % m : 1n;
}

// Generate RSA keys using LCG primes
export function generateRSAKeys() {
  const p = generateLCGPrime();
  let q = generateLCGPrime();
  while (p === q) q = generateLCGPrime(); // Ensure distinct primes

  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const e = 65537n;
  const d = modInverse(e, phi);

  return {
    publicKey: { e, n },
    privateKey: { d, n },
    primes: { p, q }, // Normally secret!
  };
}

// Example usage
const { privateKey, publicKey } = generateRSAKeys();
console.log("Public Key:", publicKey);
console.log("Private Key:", privateKey);

// console.log("Original Message:", new TextDecoder().decode(message));
// console.log("Encrypted:", Buffer.from(encrypted).toString("base64"));
// console.log("Decrypted:", new TextDecoder().decode(decrypted));

// const { privateKey, publicKey } = generateKeyPairSync("rsa", {
//   modulusLength: 2048,
//   publicKeyEncoding: {
//     type: "spki",
//     format: "pem",
//   },
//   privateKeyEncoding: {
//     type: "pkcs8",
//     format: "pem",
//   },
// });
// console.log(privateKey, publicKey);
