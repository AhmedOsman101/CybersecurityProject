export type PublicKey = {
  e: bigint;
  n: bigint;
};

export type PrivateKey = {
  d: bigint;
  n: bigint;
};

export type RsaKeyComponents = {
  publicKey: PublicKey;
  privateKey: PrivateKey;
  primes: { p: bigint; q: bigint };
};
