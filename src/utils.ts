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

// Convert BigInt to Buffer for crypto module
export function bigintToBuffer(n: bigint): Buffer {
  let hex = n.toString(16);
  if (hex.length % 2) hex = `0${hex}`; // Pad even-length hex
  return Buffer.from(hex, "hex");
}
