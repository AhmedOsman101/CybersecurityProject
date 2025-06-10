import { Buffer } from "node:buffer";
import { Hono } from "hono";
import { generateRandomKey } from "../lib/utils.ts";
import { AesService } from "../services/aesService.ts";
import AesPage from "../views/AesPage.tsx";

const aesController = new Hono().basePath("/");

aesController.get("/", c =>
  c.render(
    "Cybersecurity Project - AES-ECB",
    AesPage({
      text: "",
      key: "",
      encrypted: "",
      decrypted: "",
      mode: "e",
    })
  )
);

aesController.post("/encrypt", async c => {
  const body = await c.req.formData();

  const text = body.get("text")?.toString() || "";
  let key = body.get("key")?.toString();
  let keyBuffer: Buffer;

  if (!key) {
    key = generateRandomKey(32);
    keyBuffer = Buffer.from(key);
  } else {
    keyBuffer = Buffer.from(key);
    const error = !AesService.validateKey(keyBuffer);

    if (error) {
      return c.render(
        "Cybersecurity Project - AES-ECB",
        AesPage({
          text,
          key,
          encrypted: "",
          decrypted: "",
          error,
          mode: "e",
        })
      );
    }
  }

  const encrypted = AesService.encrypt(text, keyBuffer);

  return c.render(
    "Cybersecurity Project - AES-ECB",
    AesPage({
      text,
      key,
      encrypted,
      decrypted: "",
      mode: "e",
    })
  );
});

aesController.post("/decrypt", async c => {
  const body = await c.req.formData();

  const encrypted = body.get("encrypted")?.toString() || "";
  const key = body.get("key")?.toString() || "";
  const keyBuffer: Buffer = Buffer.from(key);
  const error = !AesService.validateKey(keyBuffer);

  if (error) {
    return c.render(
      "Cybersecurity Project - AES-ECB",
      AesPage({
        text: "",
        key,
        encrypted,
        decrypted: "",
        error,
        mode: "d",
      })
    );
  }

  const decrypted = AesService.decrypt(encrypted, keyBuffer);

  return c.render(
    "Cybersecurity Project - AES-ECB",
    AesPage({
      text: "",
      key,
      encrypted,
      decrypted,
      mode: "d",
    })
  );
});

export default aesController;
