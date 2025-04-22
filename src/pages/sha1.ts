import styles from "../styles.ts";

type Props = {
  text: string;
  result: string;
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
        <title>Cybersecurity Project - SHA-1</title>
        <style>${styles}</style>

      </head>
      <body>
        <header style="text-align: center; padding: 20px;">
          <h1>Encryption Using SHA-1</h1>
          <nav>
            <p>Navigation</p>
            <a href="/">Homepage</a><br>
            <a href="/aes">Use AES with ECB mode</a></br>
            <a href="/rsa">Use RSA with LCG key generation</a>
          </nav>
        </header>

        <center>
          <div>
            <h1>SHA-1</h1>
            <form
              action="/sha-1"
              method="post">
              <label for="text">Text: </label>
              <input
                placeholder="Enter text to hash"
                type="text"
                id="text"
                name="text"
                value="${props.text}"
                required />
              <br />
              <label for="result">Result:</label>
              <textarea
                type="text"
                id="result"
                rows="2"
                name="result"
                readonly>${props.result}</textarea>
              <br />
              <button type="submit">Encrypt</button>
            </form>
            <br />
          </div>
        </center>
      </body>
    </html>
  `;
}
