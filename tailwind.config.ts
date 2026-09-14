import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ivory: "#FBF8F1", forest: "#123629", clinic: "#0F766E", gold: "#C59A3D", terracotta: "#C86745", sage: "#8FA69A", ink: "#18231F", mist: "#EDF4F1", line: "#DCE6E1" },
      boxShadow: { soft: "0 24px 80px rgba(18, 54, 41, 0.12)", glow: "0 20px 50px rgba(197, 154, 61, 0.22)" },
      borderRadius: { aleph: "28px" }
    }
  },
  plugins: []
};

export default config;
