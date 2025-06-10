import { Buffer } from "node:buffer";
import { checkPrimeSync } from "node:crypto";
import { modInverse, modPower } from "../lib/math.ts";
import type { PrivateKey, PublicKey, RsaKeyComponents } from "../lib/rsa.d.ts";
import { bigintToBase64, bigintToBuffer, input } from "../lib/utils.ts";
import { Lcg } from "./lcgService.ts";
import { PemService } from "./pemService.ts";

export class RsaService {
  // Generate prime candidates using LCG
  private static generateLcgPrime(): bigint {
    let candidate: bigint;
    do {
      candidate = Lcg.get();
      // Ensure minimum size and oddness
      if (candidate < 65_537n) continue;
      if (candidate % 2n === 0n) candidate += 1n;
    } while (!checkPrimeSync(bigintToBuffer(candidate), { checks: 5 }));
    return candidate;
  }

  // Generate RSA keys using LCG primes
  static generateRsaKeys(): RsaKeyComponents {
    // 1. Key Generation
    const p: bigint = RsaService.generateLcgPrime();
    let q: bigint = RsaService.generateLcgPrime();
    while (p === q) q = RsaService.generateLcgPrime(); // Ensure distinct primes

    // 2. Calculate n (Modulus)
    const n: bigint = p * q; // n = p * q

    // 3. Calculate phi(n) (Euler's Totient Function)
    const phi: bigint = (p - 1n) * (q - 1n); // φ(n) = (p-1)(q-1)

    // 4. Choose public exponent e (must be 1 < e < phi_n and gcd(e, phi_n) = 1)
    const e: bigint = 65_537n;

    // 5. Calculate private exponent d (Modular Inverse of e mod phi_n)
    const d: bigint = modInverse(e, phi); // d * e ≡ 1 (mod phi_n)

    return {
      publicKey: { e, n },
      privateKey: { d, n },
      primes: { p, q }, // Normally secret!
    };
  }

  // Function to encrypt a message
  static encrypt(message: string, publicKey: PublicKey): bigint {
    const messageBuffer = Buffer.from(message, "utf-8");
    const messageBigInt = BigInt(`0x${messageBuffer.toString("hex")}`);
    return modPower(messageBigInt, publicKey.e, publicKey.n); // c = m^e (mod n)
  }

  // Function to decrypt a ciphertext
  static decrypt(ciphertext: bigint, privateKey: PrivateKey): string {
    const decryptedBigInt = modPower(ciphertext, privateKey.d, privateKey.n); // m = c^d (mod n)

    const decryptedHex = decryptedBigInt.toString(16); // 16 => hex

    // Pad with leading zero if the hex string has an odd length
    const paddedHex =
      decryptedHex.length % 2 === 0 ? decryptedHex : `0${decryptedHex}`;

    const messageBuffer = Buffer.from(paddedHex, "hex");
    return messageBuffer.toString("utf-8");
  }

  static async test() {
    console.log("# ---- RSA ---- #");

    // --- Generate RSA keys --- //
    const { publicKey, privateKey, primes } = RsaService.generateRsaKeys();
    const { publicKeyPem, privateKeyPem } = await PemService.keysToPem({
      publicKey,
      privateKey,
      primes,
    });

    console.log("RSA keys:");
    console.log(publicKeyPem, "\n");
    console.log(privateKeyPem, "\n");

    // --- Encryption/Decryption --- //

    // Get message from the user
    const message = await input("Enter the message to encrypt (RSA): ");
    console.log("Original Message:", message);

    // Encrypt the message
    const ciphertext = RsaService.encrypt(message, publicKey);
    console.log("Ciphertext (base64):", bigintToBase64(ciphertext));

    // Decrypt the ciphertext
    const decryptedMessage = RsaService.decrypt(ciphertext, privateKey);
    console.log(`Decrypted message (m): ${decryptedMessage}`);
    console.log("# ---- RSA ---- #");
  }
}
