import { AesService } from "./src/services/aesService.ts";
import { RsaService } from "./src/services/rsaService.ts";
import { Sha1Service } from "./src/services/sha1Service.ts";

async function main() {
  if (Deno.args.length === 1) {
    const arg = Deno.args[0];
    switch (arg) {
      case "sha1":
        await Sha1Service.test();
        break;
      case "aes":
        await AesService.test();
        break;
      case "rsa":
        await RsaService.test();
        break;
      default:
        console.error(
          `Invalid option ${arg}, valid options are: 'sha1', 'aes', 'rsa'`
        );
        break;
    }
  } else {
    await Sha1Service.test();
    await AesService.test();
    await RsaService.test();
  }
}

if (import.meta.main) {
  await main();
}
