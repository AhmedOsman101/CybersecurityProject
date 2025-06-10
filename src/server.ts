import { Hono } from "hono";
import aesController from "./contollers/aesController.ts";
import rsaController from "./contollers/rsaController.ts";
import sha1Controller from "./contollers/sha1Controller.ts";
import MainBody from "./views/components/MainBody.tsx";
import HomePage from "./views/HomePage.tsx";

// Initialize Hono application
const app = new Hono();

declare module "hono" {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: Overrides the existing interface
    (
      title: string,
      slot: string | Promise<string>
    ): Response | Promise<Response>;
  }
}

// Use layout middleware
app.use(async (c, next) => {
  c.setRenderer((title, slot) => {
    return c.html(MainBody(title, slot));
  });
  await next();
});

// Define routes
app.get("/", c => c.render("Cybersecurity Project", HomePage()));
app.route("/sha-1", sha1Controller);
app.route("/aes", aesController);
app.route("/rsa", rsaController);

// Start the server
Deno.serve({ port: 5000 }, app.fetch);
