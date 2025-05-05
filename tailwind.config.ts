/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "@/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        greenicon: "hsl(var(--greenicon))",
        personality: {
          Cool: {
            DEFAULT: "hsl(var(--personality-cool-bg))",
            disabled: "hsl(var(--personality-cool-bg-grayscale-90))",
            marked: "hsl(var(--personality-cool-bg-marked))",
          },
          Gloomy: {
            DEFAULT: "hsl(var(--personality-gloomy-bg))",
            disabled: "hsl(var(--personality-gloomy-bg-grayscale-90))",
            marked: "hsl(var(--personality-gloomy-bg-marked))",
          },
          Jolly: {
            DEFAULT: "hsl(var(--personality-jolly-bg))",
            disabled: "hsl(var(--personality-jolly-bg-grayscale-90))",
            marked: "hsl(var(--personality-jolly-bg-marked))",
          },
          Mad: {
            DEFAULT: "hsl(var(--personality-mad-bg))",
            disabled: "hsl(var(--personality-mad-bg-grayscale-90))",
            marked: "hsl(var(--personality-mad-bg-marked))",
          },
          Naive: {
            DEFAULT: "hsl(var(--personality-naive-bg))",
            disabled: "hsl(var(--personality-naive-bg-grayscale-90))",
            marked: "hsl(var(--personality-naive-bg-marked))",
          },
        },
        taskcard: {
          DEFAULT: "hsl(var(--taskcard))",
          foreground: "hsl(var(--taskcard-foreground))",
          border: "hsl(var(--taskcard-border))",
        },
        foodcard: {
          DEFAULT: "hsl(var(--foodcard))",
          border: "hsl(var(--foodcard-border))",
          frame: "hsl(var(--foodcard-frame))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      brightness: {
        80: ".8",
        15: ".15",
      },
      rotate: {
        10: "10deg",
      },
      spacing: {
        "1/8": "12.5%",
        14: "3.5rem",
        18: "4.5rem",
        22: "5.5rem",
      },
      width: {
        14: "3.5rem",
        18: "4.5rem",
        22: "5.5rem",
      },
      height: {
        14: "3.5rem",
        18: "4.5rem",
        22: "5.5rem",
      },
      backgroundImage: {
        "board-special": "url('/boards/Rect_03.webp')",
        "board-special-disabled": "url('/boards/Rect_05.webp')",
        "board-high": "url('/boards/Rect_06.webp')",
        "board-high-disabled": "url('/boards/Rect_07.webp')",
        "board-normal": "url('/boards/Rect_01.webp')",
        "board-normal-disabled": "url('/boards/Rect_02.webp')",
        "board-gate": "url('/boards/Rect_04.webp')",
        "task-title": "url('/schedule/Deco_Task_Colored.webp')",
        "item-slot-value": "url('/itemslot/ItemSlot_ValueBase.webp')",
        restaurant: "url('/foods/MyHomeRestaurant_background_crop.webp')",
        dish: "url('/foods/Icon_RestaurantDish.webp')",
      },
    },
    fontFamily: {
      onemobile: ["ONE-Mobile-POP"],
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities, theme }) {
      const shadowSizes = [0.75, 1.25, 1.5, 1.75, 2, 2.25, 2.5];
      const colors = theme("colors");

      const newUtilities = {};

      // 기본값 설정
      newUtilities[".text-shadow-glow"] = {
        "--tw-text-shadow-width": "1px",
        "--tw-text-shadow-color": "hsl(var(--background))",
        // 그림자 20개를 겹쳐서 글자 테두리 효과 구현
        textShadow: Array(20)
          .fill(`0 0 var(--tw-text-shadow-width) var(--tw-text-shadow-color)`)
          .join(", "),
      };

      // 그림자 길이 조절
      shadowSizes.forEach((size) => {
        newUtilities[
          `.text-shadow-glow-${size.toString().replace(".", "\\.")}`
        ] = {
          "--tw-text-shadow-width": `${size}px`,
          "--tw-text-shadow-color": "hsl(var(--background))",
          textShadow: Array(20)
            .fill(`0 0 var(--tw-text-shadow-width) var(--tw-text-shadow-color)`)
            .join(", "),
        };
      });

      // 그림자 색상 설정
      Object.entries(colors).forEach(([colorName, colorValue]) => {
        if (colorValue && typeof colorValue === "object") {
          Object.entries(colorValue).forEach(([shade, hex]) => {
            newUtilities[`.text-shadow-glow-${colorName}-${shade}`] = {
              "--tw-text-shadow-color": hex,
            };
          });
        } else {
          newUtilities[`.text-shadow-glow-${colorName}`] = {
            "--tw-text-shadow-color": colorValue,
          };
        }
      });

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
