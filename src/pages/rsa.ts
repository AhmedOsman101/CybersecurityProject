import Body from "./components/body.ts";
import Navbar from "./components/navbar.ts";

type Props = {
  message: string;
  publicKey: string;
  privateKey: string;
  encrypted: string;
  decrypted: string;
  mode: "e" | "d" | "g";
  error?: boolean;
};

export function render({
  message,
  publicKey,
  privateKey,
  encrypted,
  decrypted,
  mode,
  error,
}: Props): string {
  const links = [
    {
      url: "/",
      label: "Homepage",
    },
    {
      url: "/sha-1",
      label: "Use SHA-1",
    },
    {
      url: "/aes",
      label: "Use AES with ECB mode",
    },
  ];
  const slot = `
  ${Navbar("RSA Encryption/Decryption with LCG Key Generation", links)}
  <main class="rsa-grid">
    <!-- Key display -->
    <div class="full-width">
      <h2>Keys</h2>
    </div>
    <div>
      <label for="public-key">Public Key:</label>
      <textarea id="public-key" name="publicKey" readonly rows="7">${publicKey}</textarea>
    </div>
    <div>
      <label for="private-key">Private Key:</label>
      <textarea id="private-key" name="privateKey" readonly rows="7">${privateKey}</textarea>
    </div>
    <div class="full-width">
      <button type="button" onclick="location.href='/rsa/generate'">Generate Keys</button>
    </div>
    <span class="full-width error ${error ? "visible" : ""}">
      You must Generate keys first to encrypt or decrypt text
    </span>

    <!-- Encryption section -->
    <form action="/rsa/encrypt" method="post">
      <h2>Encrypt</h2>

      <input type="hidden" name="publicKey" value="${publicKey}">
      <input type="hidden" name="privateKey" value="${privateKey}">
      <label for="rsa-text">Plaintext:</label>
      <textarea required id="rsa-text" name="message" rows="4" placeholder="Enter text to encrypt">${mode === "e" ? message : ""}</textarea>
      <button type="submit">Encrypt</button>
      <h2>Ciphertext</h2>
      <label for="rsa-encrypted">Encrypted:</label>
      <textarea id="rsa-encrypted" name="encrypted" readonly rows="4">${mode === "e" ? encrypted : ""}</textarea>
    </form>

    <!-- Decryption section -->
    <form action="/rsa/decrypt" method="post">
      <h2>Decrypt</h2>

      <input type="hidden" name="publicKey" value="${publicKey}">
      <input type="hidden" name="privateKey" value="${privateKey}">
      <label for="rsa-cipher">Cipher Text:</label>
      <textarea required id="rsa-cipher" name="encrypted" rows="4" placeholder="Enter ciphertext">${mode === "d" ? encrypted : ""}</textarea>
      <button type="submit">Decrypt</button>
      <h2>Plaintext</h2>
      <label for="rsa-decrypted">Decrypted:</label>
      <textarea required id="rsa-decrypted" name="decrypted" readonly rows="4">${mode === "d" ? decrypted : ""}</textarea>
    </form>
  </main>
  `;

  return Body("Cybersecurity Project - RSA with LCG", slot);
}
