import Body from "./components/body.ts";
import Navbar from "./components/navbar.ts";

type Props = {
  text: string;
  key: string;
  encrypted: string;
  decrypted: string;
  error?: boolean;
  mode: "e" | "d";
};

export function render({
  text,
  key,
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
      url: "/rsa",
      label: "Use RSA with LCG key generation",
    },
  ];

  const slot = `
  ${Navbar("Encrypt/Decrypt Text with AES (ECB mode)", links)}
  <main class="container">
    <section class="column">
      <h2>Encryption</h2>
      <form action="/aes/encrypt" method="post">
        <label for="encrypt-text">Input Text:</label>
        <textarea id="encrypt-text" name="text" rows="4" placeholder="Enter text to encrypt">${mode === "e" ? text : ""}</textarea>
        <label for="encrypt-key">Encryption Key (16, 24, or 32 characters):</label>
        <textarea id="encrypt-key" name="key" rows="2" placeholder="Enter AES key">${mode === "e" ? key : ""}</textarea>
        <span class="error ${error && mode === "e" ? "visible" : ""}">
          Key must be 16, 24, or 32 characters long.
        </span>
        <label for="encrypt-output">Encrypted Output:</label>
        <textarea id="encrypt-output" name="encrypted" rows="4" readonly>${mode === "e" ? encrypted : ""}</textarea>
        <button type="submit">Encrypt</button>
      </form>
    </section>
    <section class="column">
      <h2>Decryption</h2>
      <form action="/aes/decrypt" method="post">
        <label for="decrypt-cipher">Cipher Text:</label>
        <textarea
          id="decrypt-cipher"
          name="encrypted"
          rows="4"
          placeholder="Enter cipher text"
        >${mode === "d" ? encrypted : ""}</textarea>
        <label for="decrypt-key">Decryption Key (16, 24, or 32 characters):</label>
        <textarea
          id="decrypt-key"
          name="key" rows="2"
          placeholder="Enter AES key"
        >${mode === "d" ? key : ""}</textarea>
        <span class="error ${error && mode === "d" ? "visible" : ""}">
          Key must be 16, 24, or 32 characters long.
        </span>
        <label for="decrypt-output">Decrypted Output:</label>
        <textarea
          id="decrypt-output"
          name="decrypted"
          rows="4" readonly
        >${mode === "d" ? decrypted : ""}</textarea>
        <button type="submit">Decrypt</button>
      </form>
    </section>
  </main>
  `;

  return Body("Cybersecurity Project - AES-ECB", slot);
}
