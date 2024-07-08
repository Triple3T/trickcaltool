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
      },
      rotate: {
        10: "10deg",
      },
      spacing: {
        '1/8': '12.5%',
      },
      width: {
        14: "3.5rem",
        18: "4.5rem",
      },
      height: {
        14: "3.5rem",
        18: "4.5rem",
      },
      backgroundImage: {
        "board-special": "url('/boards/Rect_03.png')",
        "board-special-disabled": "url('/boards/Rect_05.png')",
        "board-high": "url('/boards/Rect_06.png')",
        "board-high-disabled": "url('/boards/Rect_07.png')",
        "board-normal": "url('/boards/Rect_01.png')",
        "board-normal-disabled": "url('/boards/Rect_02.png')",
        "task-title": "url('/schedule/Deco_Task_Colored.png')",
        "item-slot-value": "url('/itemslot/ItemSlot_ValueBase.png')",
        "restaurant": "url('/foods/MyHomeRestaurant_background_crop.png')",
        "dish": "url('/foods/Icon_RestaurantDish.png')",
      },
    },
    fontFamily: {
      onemobile: ['ONE-Mobile-POP'],
    },
  },
  plugins: [require("tailwindcss-animate")],
};
