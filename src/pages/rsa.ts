import Body from "./components/body.ts";
import Navbar from "./components/navbar.ts";

type Props = {
  text: string;
  publicKey: string;
  privateKey: string;
  encrypted: string;
  decrypted: string;
  error?: boolean;
  mode: "e" | "d" | "g";
};

export function render({
  text,
  publicKey,
  privateKey,
  encrypted,
  decrypted,
  error,
  mode,
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
      <textarea id="public-key" readonly rows="4">${publicKey}</textarea>
    </div>
    <div>
      <label for="private-key">Private Key:</label>
      <textarea id="private-key" readonly rows="4">${privateKey}</textarea>
    </div>
    <div class="full-width">
      <button type="button" onclick="location.href='/rsa/generate'">Generate Keys</button>
    </div>

    <!-- Encryption section -->
    <div>
      <h2>Encrypt</h2>
      <label for="rsa-text">Plaintext:</label>
      <textarea id="rsa-text" name="text" rows="4" placeholder="Enter text to encrypt">${mode === "e" ? text : ""}</textarea>
      <button style="width: 200%;" type="button" onclick="document.forms.encryptForm.submit()">Encrypt</button>
    </div>
    <div>
      <h2>Ciphertext</h2>
      <label for="rsa-encrypted">Encrypted:</label>
      <textarea id="rsa-encrypted" name="encrypted" readonly rows="4">${mode === "e" ? encrypted : ""}</textarea>
    </div>

    <!-- Decryption section -->
    <div>
      <h2>Decrypt</h2>
      <label for="rsa-cipher">Cipher Text:</label>
      <textarea id="rsa-cipher" name="encrypted" rows="4" placeholder="Enter ciphertext">${mode === "d" ? encrypted : ""}</textarea>
      <button style="width: 200%;" type="button" onclick="document.forms.decryptForm.submit()">Decrypt</button>
    </div>
    <div>
      <h2>Plaintext</h2>
      <label for="rsa-decrypted">Decrypted:</label>
      <textarea id="rsa-decrypted" name="decrypted" readonly rows="4">${mode === "d" ? decrypted : ""}</textarea>
    </div>
  </main>
  `;

  return Body("Cybersecurity Project - RSA with LCG", slot);
}
