import Body from "./components/body.ts";
import Navbar from "./components/navbar.ts";

type Props = {
  text: string;
  result: string;
};

export function render({ text, result }: Props): string {
  const links = [
    {
      url: "/",
      label: "Homepage",
    },
    {
      url: "/aes",
      label: "Use AES with ECB mode",
    },
    {
      url: "/rsa",
      label: "Use RSA with LCG key generation",
    },
  ];

  const slot = `
  ${Navbar("Encryption Using SHA-1", links)}
  <main class="sha-container">
    <section class="panel">
      <h1>SHA-1 Hash</h1>
      <form action="/sha-1" method="post">
        <label for="text">Text to hash:</label>
        <input
          type="text"
          id="text"
          name="text"
          placeholder="Enter text to hash"
          value="${text}" 
          required
        />

        <label for="result">Hash Result:</label>
        <textarea
          id="result"
          name="result"
          rows="2"
          readonly
        >${result}</textarea>

        <button type="submit">Encrypt</button>
      </form>
    </section>
  </main>
  `;

  return Body("Cybersecurity Project - SHA-1", slot);
}
