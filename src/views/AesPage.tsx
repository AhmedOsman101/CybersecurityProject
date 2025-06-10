import Navbar from "./components/Navbar.tsx";

type Props = {
  text: string;
  key: string;
  encrypted: string;
  decrypted: string;
  error?: boolean;
  mode: "e" | "d";
};

function AesPage({ text, key, encrypted, decrypted, error, mode }: Props) {
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

  return (
    <>
      {Navbar("Encrypt/Decrypt Text with AES (ECB mode)", links)}
      <main className="container">
        <section className="column">
          <h2>Encryption</h2>
          <form action="/aes/encrypt" method="post">
            <label htmlFor="encrypt-text">Input Text:</label>
            <textarea
              id="encrypt-text"
              name="text"
              placeholder="Enter text to encrypt"
              required
              rows={4}
            >
              {text}
            </textarea>
            <label htmlFor="encrypt-key">
              Encryption Key (16, 24, or 32 characters):
            </label>
            <textarea
              id="encrypt-key"
              name="key"
              placeholder="Enter AES key"
              rows={2}
            >
              {mode === "e" ? key : ""}
            </textarea>
            <span className={`error ${error && mode === "e" ? "visible" : ""}`}>
              Key must be 16, 24, or 32 characters long.
            </span>
            <label htmlFor="encrypt-output">Encrypted Output:</label>
            <textarea id="encrypt-output" name="encrypted" readOnly rows={4}>
              {mode === "e" ? encrypted : ""}
            </textarea>
            <button type="submit">Encrypt</button>
          </form>
        </section>
        <section className="column">
          <h2>Decryption</h2>
          <form action="/aes/decrypt" method="post">
            <label htmlFor="decrypt-cipher">Cipher Text:</label>
            <textarea
              id="decrypt-cipher"
              name="encrypted"
              placeholder="Enter cipher text"
              rows={4}
            >
              {mode === "d" ? encrypted : ""}
            </textarea>
            <label htmlFor="decrypt-key">
              Decryption Key (16, 24, or 32 characters):
            </label>
            <textarea
              id="decrypt-key"
              name="key"
              placeholder="Enter AES key"
              rows={2}
            >
              {mode === "d" ? key : ""}
            </textarea>
            <span className={`error ${error && mode === "d" ? "visible" : ""}`}>
              Key must be 16, 24, or 32 characters long.
            </span>
            <label htmlFor="decrypt-output">Decrypted Output:</label>
            <textarea id="decrypt-output" name="decrypted" readOnly rows={4}>
              {mode === "d" ? decrypted : ""}
            </textarea>
            <button type="submit">Decrypt</button>
          </form>
        </section>
      </main>
    </>
  );
}

export default AesPage;
