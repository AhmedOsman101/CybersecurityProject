import Navbar from "./components/navbar.tsx";

type Props = {
  text: string;
  result: string;
};

function Sha1Page({ text, result }: Props) {
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

  return (
    <>
      {Navbar("Encryption Using SHA-1", links)}
      <main className="sha-container">
        <section className="panel">
          <h1>SHA-1 Hash</h1>
          <form action="/sha-1" method="post">
            <label htmlFor="text">Text to hash:</label>
            <input
              id="text"
              name="text"
              placeholder="Enter text to hash"
              required
              type="text"
              value={text}
            />
            <label htmlFor="result">Hash Result:</label>
            <textarea id="result" name="result" readOnly rows={2}>
              {result}
            </textarea>
            <button type="submit">Encrypt</button>
          </form>
        </section>
      </main>
    </>
  );
}

export default Sha1Page;
