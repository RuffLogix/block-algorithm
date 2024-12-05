import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: "#F31256",
        warning: "#FDD961",
        success: "#19F2A6",
        info: "#32BBF7",
        "primary-background": "#101820",
        "secondary-background": "#0C111B",
      },
    },
  },
  plugins: [],
} satisfies Config;
