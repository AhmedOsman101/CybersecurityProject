import Navbar from "./components/navbar.tsx";

function HomePage() {
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

  return Navbar("Encryption/Decryption Tools", links);
}

export default HomePage;
