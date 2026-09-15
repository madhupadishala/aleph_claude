import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ivory: "#F7FAFA", forest: "#123F3D", clinic: "#087F73", gold: "#D5ED84", terracotta: "#9A3F50", sage: "#54746F", ink: "#153D3A", mist: "#EAF4F1", line: "#D8E4E1" },
      boxShadow: { soft: "0 24px 80px rgba(18, 54, 41, 0.12)", glow: "0 20px 50px rgba(197, 154, 61, 0.22)" },
      borderRadius: { aleph: "12px" }
    }
  },
  plugins: []
};

export default config;
