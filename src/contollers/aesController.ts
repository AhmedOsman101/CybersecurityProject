import { Buffer } from "node:buffer";
import { Hono } from "hono";
import { AesDecrypt, AesEncrypt, validateKey } from "../aes.ts";
import AesPage from "../pages/aes.tsx";
import { generateRandomKey } from "../utils.ts";

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
    key = generateRandomKey(16);
    keyBuffer = Buffer.from(key);
  } else {
    keyBuffer = Buffer.from(key);
    const error = !validateKey(keyBuffer);

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

  const encrypted = AesEncrypt(text, keyBuffer);

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
  const error = !validateKey(keyBuffer);

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

  const decrypted = AesDecrypt(encrypted, keyBuffer);

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
