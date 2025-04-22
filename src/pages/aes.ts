type Props = {
  text: string;
  key: string;
  encrypted: string;
  decrypted: string;
  error?: boolean;
};

export function render(props: Props): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0" />
        <title>Cybersecurity Project - AES-ECB</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css" />
      </head>
      <body>
        <center>
          <div>
            <h1>Encrypt/Decrypt Text with AES (ECB mode)</h1>
            <p>Navigation</p>
            <a href="/">Homepage</a>
            <br />
            <a href="/sha-1">Use SHA-1</a>
            <br />
            <a href="/rsa">Use RSA with LCG key generation</a>
          </div>
          <div>
            <h1>AES-ECB</h1>
            <form action="/aes" method="post">
              <label for="text">Text:</label>
              <input type="text" id="text" name="text" required value="${props.text}" />
              <br />
              <label for="key">Enter AES Key (16, 24, or 32 characters):</label>
              <textarea id="key" name="key" rows="2">${props.key}</textarea>
              <span style="color: red; display: ${
                props.error ? "block" : "none"
              };">
                Key must be 16, 24, or 32 characters long.
              </span>
              <br />
              <label for="text">Encrypted Text:</label>
              <textarea id="encrypted" name="encrypted" rows="2" readonly>${
                props.encrypted
              }</textarea>
              <br />
              <label for="text">Decrypted Text:</label>
              <textarea id="decrypted" name="decrypted" rows="2" readonly>${
                props.decrypted
              }</textarea>
              <br />
              <button type="submit">Process</button>
            </form>
            <br />
          </div>
        </center>
      </body>
    </html>
  `;
}
