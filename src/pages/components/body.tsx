import styles from "../../styles.ts";

function MainBody(pageTitle: string, slot: string | Promise<string>) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>{pageTitle}</title>
        <style>{styles}</style>
      </head>
      <body>{slot}</body>
    </html>
  );
}

export default MainBody;
