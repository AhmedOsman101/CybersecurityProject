import { Buffer } from "node:buffer";
import { randomBytes } from "node:crypto";
import CryptoJS from "crypto-js";
import { input, toHexString } from "./utils.ts";

export function validateKey(key: Buffer): boolean {
  const keyString = key.toString("utf8");

  return [16, 24, 32].includes(keyString.length);
}

// Encrypt function returning Buffer
export function AesEncrypt(text: string, key: Buffer): string {
  const keyWordArray = CryptoJS.lib.WordArray.create(key);
  const encrypted = CryptoJS.AES.encrypt(text, keyWordArray, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

// Decrypt function returning string
export function AesDecrypt(encrypted: string, key: Buffer): string {
  const keyWordArray = CryptoJS.lib.WordArray.create(key);
  const decrypted = CryptoJS.AES.decrypt(encrypted, keyWordArray, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Main AES-ECB encryption and decryption
export async function AesTest() {
  try {
    console.log("# ---- AES-ECB ---- #");

    // Generate a random key as Buffer
    const key = randomBytes(16);
    console.log(`Key (hex): ${toHexString(Buffer.from(key)).toUpperCase()}`);

    const plaintext = await input("Enter text to cipher (AES-ECB): ");
    console.log(`Plaintext: ${plaintext}`);

    // Encrypt
    const encrypted = AesEncrypt(plaintext, key);
    const ciphertextHex = toHexString(Buffer.from(encrypted));
    console.log(`Ciphertext (hex): ${ciphertextHex.toUpperCase()}`);

    // Decrypt
    const decrypted = AesDecrypt(encrypted, key);
    console.log(`Decrypted: ${decrypted}`);
  } catch (err) {
    const error = err as Error;
    console.error("Error:", error);
  } finally {
    console.log("# ---- AES-ECB ---- #\n");
  }
}
