export class Lcg {
  /*
    These values are common parameters for LCG.
    They are based on the parameters table provided from wikipedia (MMIX by Donald Knuth):
    https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
  */

  // m => A power of 2 (2^64) for efficient 64-bit arithmetic
  private static readonly MODULUS = 18_446_744_073_709_551_616n;

  // a => Primitive root modulo
  private static readonly MULTIPLIER = 6_364_136_223_846_793_005n as const;

  // c => Setting c = 0 makes this a Multiplicative Congruential Generator (MCG)
  private static readonly INCREMENT = 1_442_695_040_888_963_407n as const;

  // Random initial seed within the range [1, m - 1]
  private static readonly INITIAL_SEED = BigInt(Date.now());

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
