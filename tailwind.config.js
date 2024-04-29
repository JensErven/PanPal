/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        frost: "#D4E3ED", // Describes a cool, icy background tone
        slate: "#4E6584", // Resembles the color of dark, slate rocks
        midnight: "#11263C", // Reflects the darkness of midnight sky
        pearl: "#FFFEFE", // Evokes the brightness and purity of a pearl
        porcelain: "#F0F5F9", // Suggests the smoothness and whiteness of porcelain
        terracotta: "#EC6C4C", // Resembles the rich, earthy tone of terracotta clay
        coral: "#EF775C", // Mimics the vibrant, warm hue of coral reefs
        steel: "#C0C9D8", // Evokes the cool, metallic tone of steel
      },
    },
  },
  plugins: [],
};
