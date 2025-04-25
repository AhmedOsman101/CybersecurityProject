# Cybersecurity Project

## Features

1. SHA-1 Encryption
2. AES encryption and decryption with ECB mode
3. RSA encryption and decryption with LCG key generation
4. Website for using the encryption/decryption tools

## How to Run The Project

1. Install Deno on your system

**Windows**:

```powershell
irm https://deno.land/install.ps1 | iex
```

**MacOS/Linux**

```shell
curl -fsSL https://deno.land/install.sh | sh
```

2. Clone the repository

```shell
git clone https://github.com/AhmedOsman101/CybersecurityProject.git
```

3. Install the dependecies

```shell
deno install
```

4. Run the Project

**CLI Version:**

```shell
deno task cli
```

**Website:**

```shell
deno task dev
```

**Compile The Project (optional):**

For Windows:

```shell
deno task compile-windows
```

For Linux:

```shell
deno task compile-linux
```
