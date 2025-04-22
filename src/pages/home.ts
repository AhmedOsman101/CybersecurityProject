export function render(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cybersecurity Project</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
    </head>
    <body>
      <center>
        <div>
          <h1>Encryption/Decryption Tools</h1>
          <p>Welcome to our homepage!</p>
          <a href="/sha-1">Use SHA-1</a>
          <br>
          <a href="/aes">Use AES with ECB mode</a>
          <br>
          <a href="/rsa">Use RSA with LCG key generation</a>
        </div>
    </center>
    </body>
    </html>`;
}
