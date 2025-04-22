import { AesTest } from "./AES.ts";
import { RsaTest } from "./RSA.ts";
import { Sha1Test } from "./SHA1.ts";

// Run the example
AesTest().then(() => {
  Sha1Test().then(() => {
    RsaTest();
  });
});
