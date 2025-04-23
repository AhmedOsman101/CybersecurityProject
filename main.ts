/** biome-ignore-all lint/nursery/noAwaitInLoop: <explanation> */

import { AesTest } from "./src/AES.ts";
import { RsaTest } from "./src/RSA.ts";
import { Sha1Test } from "./src/SHA1.ts";

async function main() {
  if (Deno.args.length > 0) {
    for (const arg of Deno.args) {
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
      }
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
