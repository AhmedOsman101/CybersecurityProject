import { Buffer } from "node:buffer"; // Node.js readline module for terminal input
import process from "node:process";
import { createInterface } from "node:readline";

// Function to convert Buffer to hex string for display
export function toHexString(buffer: Buffer): string {
  return buffer.toString("hex");
}

export async function input(prompt: string): Promise<string> {
  // Create readline interface
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Get user input using a promise
  const plaintext = await new Promise<string>(resolve => {
    rl.question(prompt, answer => {
      resolve(answer);
    });
  });

  // Close the readline interface
  rl.close();

  return plaintext;
}

// Utility to convert string to BigInt
export function stringToBigInt(message: string): bigint {
  if (message === null || message === undefined) {
    throw new Error("Input must be a valid string");
  }
  // Use Buffer for potentially better performance and standard Node way
  const buffer = Buffer.from(message, "utf8");
  return BigInt("0x" + buffer.toString("hex")); // Convert buffer hex to BigInt

  /* // Original method (also works)
  let result = 0n;
  for (let i = 0; i < message.length; i++) {
      result = result * 256n + BigInt(message.charCodeAt(i));
  }
  return result;
  */
}

// Utility to convert BigInt back to string
export function bigIntToString(num: bigint): string {
  if (num < 0n) {
    throw new Error("Input must be a non-negative BigInt");
  }
  if (num === 0n) return "";

  let hex = num.toString(16);
  // Ensure even length for Buffer.from hex
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }

  const buffer = Buffer.from(hex, "hex");
  return buffer.toString("utf8"); // Interpret buffer as UTF8 bytes

  /* // Original method (works but less direct than Buffer hex)
  // Calculate length first
  let tempNum = num;
  let length = 0;
  while (tempNum > 0n) {
   length++;
   tempNum /= 256n;
  }

  // Create buffer directly with known length
  const buffer = Buffer.alloc(length);
  for (let i = length - 1; i >= 0; i--) {
   buffer[i] = Number(num % 256n);
   num /= 256n;
  }
  // Convert Buffer to string (UTF-8)
  return buffer.toString("utf8");
  */
}

// Modular exponentiation for encryption/decryption
export function modPow(
  base: bigint,
  exponent: bigint,
  modulus: bigint
): bigint {
  if (exponent < 0n) {
    throw new Error("Exponent must be non-negative");
  }
  if (modulus <= 0n) {
    throw new Error("Modulus must be positive");
  }
  if (modulus === 1n) return 0n; // Edge case

  let result = 1n;
  base %= modulus;
  while (exponent > 0n) {
    // If exponent is odd, multiply result with base
    if (exponent & 1n) {
      // Faster check for oddness
      result = (result * base) % modulus;
    }
    // Square the base and reduce modulo n
    base = (base * base) % modulus;
    // Halve the exponent (integer division)
    exponent >>= 1n; // Faster division by 2
  }
  return result;
}
