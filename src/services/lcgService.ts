/*
These values are common parameters for LCG.
They are based on the parameters table provided from wikipedia (MMIX by Donald Knuth):
https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
*/

export class Lcg {
  private static MODULUS = 18_446_744_073_709_551_616n as const; // m => A prime number (2^16+1)
  private static MULTIPLIER = 6_364_136_223_846_793_005n as const; // a => Primitive root modulo

  // c => Setting c = 0 makes this a Multiplicative Congruential Generator (MCG)
  private static INCREMENT = 1_442_695_040_888_963_407n as const;

  private static INITIAL_SEED = BigInt(Date.now()); // Random initial seed within the range [1, m - 1]

  private static *lcgGenerator(
    m: bigint,
    a: bigint,
    c: bigint,
    seed: bigint
  ): Generator<bigint, bigint> {
    while (true) {
      // biome-ignore lint/style/noParameterAssign: Ignored on generators
      seed = (a * seed + c) % m;
      yield seed;
    }
  }
  private static generator = this.lcgGenerator(
    this.MODULUS,
    this.MULTIPLIER,
    this.INCREMENT,
    this.INITIAL_SEED
  );

  static get() {
    return Lcg.generator.next().value;
  }
}
