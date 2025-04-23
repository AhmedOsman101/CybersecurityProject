import { Buffer } from "node:buffer"; // Node.js readline module for terminal input
import { randomInt } from "node:crypto";
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

// Convert BigInt to Buffer for crypto module
export function bigintToBuffer(n: bigint): Buffer {
  let hex = n.toString(16);
  if (hex.length % 2) hex = `0${hex}`; // Pad even-length hex
  return Buffer.from(hex, "hex");
}

/**
 * Generates a random string of a specified length.
 * The string includes a mix of lowercase letters, uppercase letters, and numbers.
 *
 * @param length The desired length of the string.
 * @returns A randomly generated string.
 */
export function generateRandomKey(length: number): string {
  // Define the character sets to use for the string
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";

  // Combine all character sets into one string
  const allChars = lowerCaseChars + upperCaseChars + numberChars;

  let password = "";
  // Generate the string by randomly selecting characters from the combined set
  for (let i = 0; i < length; i++) {
    password += allChars[randomInt(0, allChars.length)];
  }

  return password;
}

export function base64UrlToBigInt(b64url: string): bigint {
  // Base64URL → Base64
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  // Pad with “=” to multiple of 4
  const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
  const bin = atob(b64 + pad);
  // Hexify
  const hex = Array.from(bin, c =>
    c.charCodeAt(0).toString(16).padStart(2, "0")
  ).join("");
  return BigInt(`0x${hex}`);
}

/** Convert ArrayBuffer -> Base64 string */
export function ab2b64(ab: ArrayBuffer): string {
  return Buffer.from(new Uint8Array(ab)).toString("base64");
}

export function toBase64Url(n: bigint): string {
  let hex = n.toString(16);
  if (hex.length % 2 === 1) hex = `0${hex}`; // ensure even length
  return Buffer.from(hex, "hex").toString("base64url");
}

/** Convert a BigInt to standard Base-64 string */
export function bigintToBase64(x: bigint): string {
  // 1) BigInt -> hex (no "0x"), pad to even length
  let hex = x.toString(16);
  if (hex.length % 2) hex = `0${hex}`;

  // 2) hex -> Buffer (byte array)
  const buf = Buffer.from(hex, "hex");

  // 3) Buffer -> Base-64
  return buf.toString("base64");
}
