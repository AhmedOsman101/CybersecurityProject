import { Hono } from "hono";
import { base64ToBigInt, bigintToBase64 } from "../lib/utils.ts";
import { PemService } from "../services/pemService.ts";
import { RsaService } from "../services/rsaService.ts";
import RsaPage from "../views/RsaPage.tsx";

const rsaController = new Hono();

const title = "Cybersecurity Project - RSA with LCG" as const;

rsaController.get("/", c =>
  c.render(
    title,
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
  const { publicKeyPem, privateKeyPem } = await PemService.keysToPem(
    RsaService.generateRsaKeys()
  );

  return c.render(
    title,
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
      title,
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

  const { publicKey } = await PemService.pemToComponents(
    publicKeyPem,
    privateKeyPem
  );

  const encrypted = RsaService.encrypt(message, publicKey);
  return c.render(
    title,
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
      title,
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

  const { privateKey } = await PemService.pemToComponents(
    publicKeyPem,
    privateKeyPem
  );

  const decrypted = RsaService.decrypt(base64ToBigInt(encrypted), privateKey);
  return c.render(
    title,
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
