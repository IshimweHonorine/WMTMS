/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    // fontFamily: {
    //   'custom': ['Krona One', 'sans-serif'],
    // },
    colors:{
      primary:'#047857',
      secondary:'#f9fafb',
      btn_primary:"#ffffff",
      text_primary:"#065f46",
      text_secondary:'#6b7280',
      text_secondary_2:"#d1d5db"
    }
  },
  
}
