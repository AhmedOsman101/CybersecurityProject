import { Hono } from "hono";
import Sha1Page from "../pages/sha1.tsx";
import { sha1 } from "../sha1.ts";

const sha1Controller = new Hono();

sha1Controller.get("/", c =>
  c.render("Cybersecurity Project - SHA-1", Sha1Page({ text: "", result: "" }))
);

sha1Controller.post("/", async c => {
  const body = await c.req.formData();

  const text = body.get("text")?.toString() || "";
  const result = sha1(text);

  return c.render("Cybersecurity Project - SHA-1", Sha1Page({ text, result }));
});

export default sha1Controller;
