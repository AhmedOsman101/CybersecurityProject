import { Hono } from "hono";
import { Sha1Service } from "../services/sha1Service.ts";
import Sha1Page from "../views/Sha1Page.tsx";

const sha1Controller = new Hono();

sha1Controller.get("/", c =>
  c.render("Cybersecurity Project - SHA-1", Sha1Page({ text: "", result: "" }))
);

sha1Controller.post("/", async c => {
  const body = await c.req.formData();

  const text = body.get("text")?.toString() || "";
  const result = Sha1Service.sha1(text);

  return c.render("Cybersecurity Project - SHA-1", Sha1Page({ text, result }));
});

export default sha1Controller;
