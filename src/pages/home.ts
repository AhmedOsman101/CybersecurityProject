import styles from "../styles.ts";

export function render(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cybersecurity Project</title>
      <style>${styles}</style>
    </head>
    <body>
      <header style="text-align: center; padding: 20px;">
          <h1>Encryption/Decryption Tools</h1>
          <nav>
            <p>Welcome to our homepage!</p>
            <a href="/sha-1">Use SHA-1</a><br>
            <a href="/aes">Use AES with ECB mode</a></br>
            <a href="/rsa">Use RSA with LCG key generation</a>
          </nav>
        </header> 
    </body>
    </html>`;
}
