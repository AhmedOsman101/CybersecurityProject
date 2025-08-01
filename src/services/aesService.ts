import { Buffer } from "node:buffer";
import { randomBytes } from "node:crypto";
import CryptoJs from "crypto-js";
import { input, toHexString } from "../lib/utils.ts";

export class AesService {
  // Validates the key's length
  static validateKey(key: Buffer): boolean {
    const keyString = key.toString("utf8");

    return [16, 24, 32].includes(keyString.length);
  }

  // Encrypt function returning Buffer
  static encrypt(text: string, key: Buffer): string {
    const keyWordArray = CryptoJs.lib.WordArray.create(key);

    const encrypted = CryptoJs.AES.encrypt(text, keyWordArray, {
      mode: CryptoJs.mode.ECB,
      padding: CryptoJs.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  // Decrypt function returning string
  static decrypt(encrypted: string, key: Buffer): string {
    const keyWordArray = CryptoJs.lib.WordArray.create(key);
    const decrypted = CryptoJs.AES.decrypt(encrypted, keyWordArray, {
      mode: CryptoJs.mode.ECB,
      padding: CryptoJs.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJs.enc.Utf8);
  }

  // Main AES-ECB encryption and decryption
  static async test() {
    try {
      console.log("# ---- AES-ECB ---- #");

      // Generate a random key as Buffer
      const key = randomBytes(16);
      console.log(`Key (hex): ${toHexString(Buffer.from(key)).toUpperCase()}`);

      const plaintext = await input("Enter text to cipher (AES-ECB): ");
      console.log(`Plaintext: ${plaintext}`);

      // Encrypt
      const encrypted = AesService.encrypt(plaintext, key);
      const ciphertextHex = toHexString(Buffer.from(encrypted));
      console.log(`Ciphertext (hex): ${ciphertextHex.toUpperCase()}`);

      // Decrypt
      const decrypted = AesService.decrypt(encrypted, key);
      console.log(`Decrypted: ${decrypted}`);
    } catch (err) {
      const error = err as Error;
      console.error("Error:", error);
    } finally {
      console.log("# ---- AES-ECB ---- #\n");
    }
  }
}
