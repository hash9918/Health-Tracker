/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Health-focused palette: calm teal/blue base, muted signal colors for readings
        clinic: {
          bg: "#F5FAFA", // page background — soft cool mint-white
          surface: "#FFFFFF",
          border: "#E2ECEC",
          ink: "#0F2A2A", // primary text
          muted: "#5B7373", // secondary text
        },
        pulse: {
          50: "#EEFBF8",
          100: "#D3F3EC",
          400: "#2FA69A",
          500: "#0F766E", // primary teal — brand color
          600: "#0B5C55",
          700: "#08433E",
        },
        vein: {
          400: "#5B8DEF", // diastolic / secondary data line
          500: "#3B6FE0",
        },
        signal: {
          normal: "#1E9E6B", // healthy reading green
          elevated: "#D89A2E", // elevated/borderline amber
          high: "#D14343", // high reading red (muted, not alarmist)
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 42, 42, 0.04), 0 4px 16px rgba(15, 42, 42, 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
