type link = {
  url: string;
  label: string;
};

function Navbar(title: string, links: link[]) {
  return `
    <header>
      <h1>${title}</h1>
      <nav>
        ${links.map(l => `<a href="${l.url}">${l.label}</a>`).join(" |")}
      </nav>
    </header>`;
}

export default Navbar;
