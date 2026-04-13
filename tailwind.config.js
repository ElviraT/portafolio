/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ["./*.html", "./js/**/*.js", "./posts/**/*.html"],
    theme: {
        extend: {
            colors: {
                brand: {
                    base: 'var(--color-bg)',
                    surface: 'var(--color-surface)',
                    primary: 'var(--color-primary)',
                    secondary: 'var(--color-secondary)',
                    text: 'var(--color-text-main)',
                    muted: 'var(--color-text-muted)',
                    border: 'var(--color-border)'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            }
        }
    }
}