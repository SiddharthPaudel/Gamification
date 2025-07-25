/** @type {import('tailwindcss').Config} */
export default {
  content: [    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
       transform: ["group-hover"],
        transformOrigin: {
    'center': 'center center',
  },
  transform: ['group-hover'],

        animation: {
      'fade-in': 'fadeIn 0.3s ease-in-out',
    },
      keyframes: {
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      
    },
    
    
    
    },
  },
  plugins: [],
}

