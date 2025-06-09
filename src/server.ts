import { Buffer } from "node:buffer";
import { Hono } from "hono";
import { AesDecrypt, AesEncrypt, validateKey } from "./aes.ts";
import AesPage from "./pages/aes.tsx";
import MainBody from "./pages/components/body.tsx";
import HomePage from "./pages/home.tsx";
import RsaPage from "./pages/rsa.tsx";
import Sha1Page from "./pages/sha1.tsx";
import { keysToPem, pemToComponents } from "./pem.ts";
import { generateRsaKeys, RsaDecrypt, RsaEncrypt } from "./rsa.ts";
import { sha1 } from "./sha1.ts";
import { base64ToBigInt, bigintToBase64, generateRandomKey } from "./utils.ts";

// Initialize Hono application
const app = new Hono();

declare module "hono" {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: Overrides the existing interface
    (
      pageTitle: string,
      slot: string | Promise<string>
    ): Response | Promise<Response>;
  }
}

// Use layout middleware
app.use(async (c, next) => {
  c.setRenderer((pageTitle, slot) => {
    return c.html(MainBody(pageTitle, slot));
  });
  await next();
});

// Define routes
app
  .get("/", c => c.render("Cybersecurity Project", HomePage()))

  .get("/sha-1", c =>
    c.render(
      "Cybersecurity Project - SHA-1",
      Sha1Page({ text: "", result: "" })
    )
  )

  .post("/sha-1", async c => {
    const body = await c.req.formData();

    const text = body.get("text")?.toString() || "";
    const result = sha1(text);

    return c.render(
      "Cybersecurity Project - SHA-1",
      Sha1Page({ text, result })
    );
  })

  .get("/aes", c =>
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
  )

  .post("/aes/encrypt", async c => {
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
  })

  .post("/aes/decrypt", async c => {
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
  })

  .get("/rsa", c =>
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
  )

  .get("/rsa/generate", async c => {
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
  })
  .post("/rsa/encrypt", async c => {
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
  })

  .post("/rsa/decrypt", async c => {
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

// Start the server
Deno.serve({ port: 5000 }, app.fetch);
