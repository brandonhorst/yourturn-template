import { define } from "../utils.ts";

export const handler = define.handlers({
  GET() {
    return new Response("", {
      status: 307,
      headers: { Location: "/lobby" },
    });
  },
});
