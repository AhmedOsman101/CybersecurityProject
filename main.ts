import { AesTest } from "./src/aes.ts";
import { RsaTest } from "./src/rsa.ts";
import { Sha1Test } from "./src/sha1.ts";

async function main() {
  if (Deno.args.length === 1) {
    const arg = Deno.args[0];
    switch (arg) {
      case "sha1":
        await Sha1Test();
        break;
      case "aes":
        await AesTest();
        break;
      case "rsa":
        await RsaTest();
        break;
      default:
        console.error(
          `Invalid option ${arg}, valid options are: 'sha1', 'aes', 'rsa'`
        );
        break;
    }
  } else {
    await Sha1Test();
    await AesTest();
    await RsaTest();
  }
}

if (import.meta.main) {
  await main();
}
