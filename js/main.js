// tailwind設定
tailwind.config = {
  theme: {
    extend: {
      colors: {
        back: "#FAF3E0",
        "button-back": "#00897B",
        "button-text": "#FFFFFF",
        "card-back": "#FFFAFA",
        "card-text": "#424242",
        "input-back": "#E0F2F1",
        "input-text": "#00695C",
      },
      keyframes: {
        customBounce: {
          "0%, 100%": { transform: "translateY(-10%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      animation: {
        customBounce: "customBounce 1s infinite",
      },
    },
  },
};
