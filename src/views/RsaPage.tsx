import Navbar from "./components/navbar.tsx";

type Props = {
  message: string;
  publicKey: string;
  privateKey: string;
  encrypted: string;
  decrypted: string;
  mode: "e" | "d" | "g";
  error?: boolean;
};

function RsaPage({
  message,
  publicKey,
  privateKey,
  encrypted,
  decrypted,
  mode,
  error,
}: Props) {
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

  return (
    <>
      {Navbar("RSA Encryption/Decryption with LCG Key Generation", links)}
      <main className="rsa-grid">
        {/* Key display */}
        <div className="full-width">
          <h2>Keys</h2>
        </div>
        <div>
          <label htmlFor="public-key">Public Key:</label>
          <textarea id="public-key" name="publicKey" readOnly rows={7}>
            {publicKey}
          </textarea>
        </div>
        <div>
          <label htmlFor="private-key">Private Key:</label>
          <textarea id="private-key" name="privateKey" readOnly rows={7}>
            {privateKey}
          </textarea>
        </div>
        <div className="full-width">
          <button
            onclick="window.location.href = '/rsa/generate'"
            type="button"
          >
            Generate Keys
          </button>{" "}
        </div>
        <span className={`full-width error ${error ? "visible" : ""}`}>
          You must Generate keys first to encrypt or decrypt text
        </span>

        {/* Encryption section */}
        <form action="/rsa/encrypt" method="post">
          <h2>Encrypt</h2>
          <input name="publicKey" type="hidden" value={publicKey} />
          <input name="privateKey" type="hidden" value={privateKey} />
          <label htmlFor="rsa-text">Plaintext:</label>
          <textarea
            id="rsa-text"
            name="message"
            placeholder="Enter text to encrypt"
            required
            rows={4}
          >
            {mode === "e" ? message : ""}
          </textarea>
          <button type="submit">Encrypt</button>
          <h2>Ciphertext</h2>
          <label htmlFor="rsa-encrypted">Encrypted:</label>
          <textarea id="rsa-encrypted" name="encrypted" readOnly rows={4}>
            {mode === "e" ? encrypted : ""}
          </textarea>
        </form>

        {/* Decryption section */}
        <form action="/rsa/decrypt" method="post">
          <h2>Decrypt</h2>
          <input name="publicKey" type="hidden" value={publicKey} />
          <input name="privateKey" type="hidden" value={privateKey} />
          <label htmlFor="rsa-cipher">Cipher Text:</label>
          <textarea
            id="rsa-cipher"
            name="encrypted"
            placeholder="Enter ciphertext"
            required
            rows={4}
          >
            {mode === "d" ? encrypted : ""}
          </textarea>
          <button type="submit">Decrypt</button>
          <h2>Plaintext</h2>
          <label htmlFor="rsa-decrypted">Decrypted:</label>
          <textarea
            id="rsa-decrypted"
            name="decrypted"
            readOnly
            required
            rows={4}
          >
            {mode === "d" ? decrypted : ""}
          </textarea>
        </form>
      </main>
    </>
  );
}

export default RsaPage;
