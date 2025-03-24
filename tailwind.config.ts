import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components,examples}/**/*.{ts,tsx,js,jsx}",
  ],
} satisfies Config;
