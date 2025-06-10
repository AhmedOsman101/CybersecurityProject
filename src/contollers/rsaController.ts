import { Hono } from "hono";
import RsaPage from "../pages/rsa.tsx";
import { keysToPem, pemToComponents } from "../pem.ts";
import { generateRsaKeys, RsaDecrypt, RsaEncrypt } from "../rsa.ts";
import { base64ToBigInt, bigintToBase64 } from "../lib/utils.ts";

const rsaController = new Hono();

rsaController.get("/", c =>
  c.render(
    "Cybersecurity Project - RSA with LCG",
    RsaPage({
      message: "",
      publicKey: "",
      privateKey: "",
      encrypted: "",
      decrypted: "",
      mode: "g",
    })
  )
);

rsaController.get("/generate", async c => {
  const { publicKey, privateKey, primes } = generateRsaKeys();
  const { publicKeyPem, privateKeyPem } = await keysToPem({
    publicKey,
    privateKey,
    primes,
  });

  return c.render(
    "Cybersecurity Project - RSA with LCG",
    RsaPage({
      message: "",
      publicKey: publicKeyPem,
      privateKey: privateKeyPem,
      encrypted: "",
      decrypted: "",
      mode: "g",
    })
  );
});

rsaController.post("/encrypt", async c => {
  const body = await c.req.formData();

  const message = body.get("message")?.toString() || "";
  const publicKeyPem = body.get("publicKey")?.toString() || "";
  const privateKeyPem = body.get("privateKey")?.toString() || "";

  if (!publicKeyPem || !privateKeyPem) {
    return c.render(
      "Cybersecurity Project - RSA with LCG",
      RsaPage({
        message,
        publicKey: "",
        privateKey: "",
        encrypted: "",
        decrypted: "",
        mode: "e",
        error: true,
      })
    );
  }

  const { publicKey } = await pemToComponents(publicKeyPem, privateKeyPem);

  const encrypted = RsaEncrypt(message, publicKey);
  return c.render(
    "Cybersecurity Project - RSA with LCG",
    RsaPage({
      message,
      publicKey: publicKeyPem,
      privateKey: privateKeyPem,
      encrypted: bigintToBase64(encrypted),
      decrypted: "",
      mode: "e",
    })
  );
});

rsaController.post("/decrypt", async c => {
  const body = await c.req.formData();

  const encrypted = body.get("encrypted")?.toString() || "";
  const publicKeyPem = body.get("publicKey")?.toString() || "";
  const privateKeyPem = body.get("privateKey")?.toString() || "";

  if (!publicKeyPem || !privateKeyPem) {
    return c.render(
      "Cybersecurity Project - RSA with LCG",
      RsaPage({
        message: "",
        publicKey: "",
        privateKey: "",
        encrypted,
        decrypted: "",
        mode: "d",
        error: true,
      })
    );
  }

  const { privateKey } = await pemToComponents(publicKeyPem, privateKeyPem);

  const decrypted = RsaDecrypt(base64ToBigInt(encrypted), privateKey);
  return c.render(
    "Cybersecurity Project - RSA with LCG",
    RsaPage({
      message: "",
      publicKey: publicKeyPem,
      privateKey: privateKeyPem,
      encrypted,
      decrypted,
      mode: "d",
    })
  );
});

export default rsaController;
