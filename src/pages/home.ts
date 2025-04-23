import Body from "./components/body.ts";
import Navbar from "./components/navbar.ts";

export function render(): string {
  const links = [
    {
      url: "/sha-1",
      label: "Use SHA-1",
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

  return Body(
    "Cybersecurity Project",
    Navbar("Encryption/Decryption Tools", links)
  );
}
