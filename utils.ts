import { createDefine } from "fresh";
import { getCookies, setCookie } from "@std/http/cookie";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  shared: string;
}

export const YOURTURN_TOKEN_COOKIE = "yourturn_token";

export const define = createDefine<State>();

export function checkAuth(headers: Headers): string | undefined {
  const cookies = getCookies(headers);
  return cookies[YOURTURN_TOKEN_COOKIE];
}

export function setAuth(headers: Headers, token: string): void {
  setCookie(headers, {
    name: YOURTURN_TOKEN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
