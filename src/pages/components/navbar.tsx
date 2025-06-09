type Link = {
  url: string;
  label: string;
};

function Navbar(title: string, links: Link[]) {
  return (
    <header>
      <h1>{title}</h1>
      <nav>
        {links.map((link, index) => (
          <>
            <a href={link.url} key={link.label}>
              {link.label}
            </a>
            <span> {index < links.length - 1 ? "|" : ""} </span>
          </>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
