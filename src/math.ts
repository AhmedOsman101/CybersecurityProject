export function countBits(num: bigint): number {
  if (num === 0n) {
    return 1;
  }
  let count = 0;
  let temp = num < 0n ? -num : num; // Work with the absolute value
  while (temp > 0n) {
    temp >>= 1n; // Equivalent to integer division by 2
    count++;
  }
  return count;
}

// Modular inverse using Extended Euclidean Algorithm
export function modInverse(a: bigint, m: bigint): bigint {
  let [oldR, r] = [a, m];
  let [oldS, s] = [1n, 0n];
  while (r !== 0n) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }
  return oldR === 1n ? (oldS + m) % m : 1n;
}

// Helper function for modular exponentiation
export function modPower(base: bigint, exp: bigint, modulus: bigint): bigint {
  let result = 1n;
  base %= modulus;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % modulus;
    base = (base * base) % modulus;
    exp /= 2n;
  }
  return result;
}
