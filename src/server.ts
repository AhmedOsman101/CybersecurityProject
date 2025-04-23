import { Buffer } from "node:buffer";
import { Application, Router } from "@oak/oak";
import { AesDecrypt, AesEncrypt, validateKey } from "./AES.ts";
import { keysToPem, pemToComponents } from "./pem.ts";
import { generateRSAKeys, RsaDecrypt, RsaEncrypt } from "./RSA.ts";
import { sha1 } from "./SHA1.ts";
import { base64ToBigInt, bigintToBase64, generateRandomKey } from "./utils.ts";

// Initialize Oak application and router
const app = new Application();
const router = new Router();

// Import page modules dynamically
const homePage = await import("./pages/home.ts");
const rsaPage = await import("./pages/rsa.ts");
const sha1Page = await import("./pages/sha1.ts");
const aesPage = await import("./pages/aes.ts");

// Define routes
router
  .get("/", ctx => {
    // Pass custom input to the home page
    const html = homePage.render();
    ctx.response.body = html;
    ctx.response.type = "text/html";
  })
  .get("/sha-1", ctx => {
    // Pass custom input to the about page
    const html = sha1Page.render({ text: "", result: "" });
    ctx.response.body = html;
    ctx.response.type = "text/html";
  })
  .post("/sha-1", async ctx => {
    const body = await ctx.request.body.form();

    const text = body.get("text") || "";
    const result = sha1(text);

    const html = sha1Page.render({ text, result });
    ctx.response.body = html;
    ctx.response.type = "text/html";
  })
  .get("/aes", ctx => {
    // Pass custom input to the about page
    const html = aesPage.render({
      text: "",
      key: "",
      encrypted: "",
      decrypted: "",
      mode: "e",
    });
    ctx.response.body = html;
    ctx.response.type = "text/html";
  })
  .post("/aes/encrypt", async ctx => {
    const body = await ctx.request.body.form();

    const text = body.get("text") || "";
    let key = body.get("key");
    let keyBuffer: Buffer;

    if (!key) {
      key = generateRandomKey(16);
      keyBuffer = Buffer.from(key);
    } else {
      keyBuffer = Buffer.from(key);
      const error = !validateKey(keyBuffer);

      if (error) {
        // Pass custom input to the about page
        const html = aesPage.render({
          text,
          key,
          encrypted: "",
          decrypted: "",
          error,
          mode: "e",
        });
        ctx.response.body = html;
        ctx.response.type = "text/html";
        return;
      }
    }

    const encrypted = AesEncrypt(text, keyBuffer);

    // Pass custom input to the about page
    const html = aesPage.render({
      text,
      key,
      encrypted,
      decrypted: "",
      mode: "e",
    });
    ctx.response.body = html;
    ctx.response.type = "text/html";
  })
  .post("/aes/decrypt", async ctx => {
    const body = await ctx.request.body.form();

    const encrypted = body.get("encrypted") || "";
    const key = body.get("key") || "";
    const keyBuffer: Buffer = Buffer.from(key);
    const error = !validateKey(keyBuffer);

    if (error) {
      // Pass custom input to the about page
      const html = aesPage.render({
        text: "",
        key,
        encrypted,
        decrypted: "",
        error,
        mode: "d",
      });
      ctx.response.body = html;
      ctx.response.type = "text/html";
      return;
    }

    const decrypted = AesDecrypt(encrypted, keyBuffer);

    // Pass custom input to the about page
    const html = aesPage.render({
      text: "",
      key,
      encrypted,
      decrypted,
      mode: "d",
    });
    ctx.response.body = html;
    ctx.response.type = "text/html";
  })
  .get("/rsa", ctx => {
    // Pass custom input to the about page
    const html = rsaPage.render({
      message: "",
      publicKey: "",
      privateKey: "",
      encrypted: "",
      decrypted: "",
      mode: "g",
    });
    ctx.response.body = html;
    ctx.response.type = "text/html";
  })
  .get("/rsa/generate", async ctx => {
    const { publicKey, privateKey, primes } = generateRSAKeys();
    const { publicKeyPem, privateKeyPem } = await keysToPem({
      publicKey,
      privateKey,
      primes,
    });

    // Pass custom input to the about page
    const html = rsaPage.render({
      message: "",
      publicKey: publicKeyPem,
      privateKey: privateKeyPem,
      encrypted: "",
      decrypted: "",
      mode: "g",
    });
    ctx.response.body = html;
    ctx.response.type = "text/html";
  })
  .post("/rsa/encrypt", async ctx => {
    const body = await ctx.request.body.form();

    const message = body.get("message") || "";
    const publicKeyPem = body.get("publicKey") || "";
    const privateKeyPem = body.get("privateKey") || "";

    if (!publicKeyPem || !privateKeyPem) {
      // Pass custom input to the about page
      const html = rsaPage.render({
        message,
        publicKey: "",
        privateKey: "",
        encrypted: "",
        decrypted: "",
        mode: "e",
        error: true,
      });
      ctx.response.body = html;
      ctx.response.type = "text/html";
      return;
    }

    const { publicKey } = await pemToComponents(publicKeyPem, privateKeyPem);

    const encrypted = RsaEncrypt(message, publicKey);

    // Pass custom input to the about page
    const html = rsaPage.render({
      message,
      publicKey: publicKeyPem,
      privateKey: privateKeyPem,
      encrypted: bigintToBase64(encrypted),
      decrypted: "",
      mode: "e",
    });
    ctx.response.body = html;
    ctx.response.type = "text/html";
  })
  .post("/rsa/decrypt", async ctx => {
    const body = await ctx.request.body.form();

    const encrypted = body.get("encrypted") || "";
    const publicKeyPem = body.get("publicKey") || "";
    const privateKeyPem = body.get("privateKey") || "";

    if (!publicKeyPem || !privateKeyPem) {
      // Pass custom input to the about page
      const html = rsaPage.render({
        message: "",
        publicKey: "",
        privateKey: "",
        encrypted,
        decrypted: "",
        mode: "d",
        error: true,
      });
      ctx.response.body = html;
      ctx.response.type = "text/html";
      return;
    }

    const { privateKey } = await pemToComponents(publicKeyPem, privateKeyPem);

    const decrypted = RsaDecrypt(base64ToBigInt(encrypted), privateKey);

    // Pass custom input to the about page
    const html = rsaPage.render({
      message: "",
      publicKey: publicKeyPem,
      privateKey: privateKeyPem,
      encrypted,
      decrypted,
      mode: "d",
    });
    ctx.response.body = html;
    ctx.response.type = "text/html";
  });

// Use router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
console.log("Server running on http://localhost:5000");
await app.listen({ port: 5000 });
