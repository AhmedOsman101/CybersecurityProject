// const p: bigint = 61n;
// const q: bigint = 53n;
// const r: bigint = (p - 1n) * (q - 1n); // φ(n) = (p-1)(q-1)
// const e: bigint = 65_537n;
// const d: bigint = (1n / e) % r;
// console.log(d);

function gcd(a: bigint, b: bigint): bigint {
  let r = 0n;
  let i = 0n;
  do {
    r = a - i * b;
    console.log(r);
    if (0n <= r && r < b) return i;
    i++;
  } while (r >= 0);
  return i - 1n;
}

function gcd2(a: bigint, b: bigint): bigint {
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}
console.log(gcd(1071n, 462n)); // 2n
// console.log(gcd2(1071n, 462n)); // 21n

function extended_gcd(a: bigint, b: bigint) {
  let [old_r, r] = [a, b];
  let [old_s, s] = [1, 0];
  let [old_t, t] = [0, 1];

  while (r !== 0n) {
    const quotient = gcd(old_r, r);
    [old_r, r] = [r, (old_r − quotient * r)];
    [old_s, s] = [s, old_s − quotient * s];
    [old_t, t] = [t, old_t − quotient * t];
  }
  console.log("Bézout coefficients:", (old_s, old_t));
  console.log("greatest common divisor:", old_r);
  console.log("quotients by the gcd:", (t, s));
}
