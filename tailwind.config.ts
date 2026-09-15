import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ivory: "#FBF9F5", forest: "#1B3B2B", clinic: "#D97757", gold: "#F4E8D1", terracotta: "#D97757", sage: "#8A9A86", ink: "#1B3B2B", mist: "#F4E8D1", line: "#D8D8CC" },
      boxShadow: { soft: "0 24px 80px rgba(27, 59, 43, 0.12)", glow: "0 20px 50px rgba(217, 119, 87, 0.20)" },
      borderRadius: { aleph: "12px" }
    }
  },
  plugins: []
};

export default config;
