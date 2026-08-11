/** LEAD Design System, Tailwind theme.
 *  Colour, type, spacing and shape for LEAD.
 *  @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#00232F',
          deep: '#001A23',
          body: '#22383F',
          muted: '#5F7278'
        },
        accent: {
          DEFAULT: '#E97132',
          light: '#F5A472',
          text: '#A84A16'
        },
        cream: '#E9DDC7',
        canvas: '#F7F2E8',
        surface: '#FFFFFF',
        line: '#DCD3C2',
        success: '#1F7A5C',
        warning: '#E9A13B',
        error: '#B3341F',
        info: '#2E6F8E'
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif']
      },
      fontSize: {
        // [size, { lineHeight, letterSpacing, fontWeight }]
        display: ['64px', { lineHeight: '66px', letterSpacing: '-1px', fontWeight: '900' }],
        h1: ['44px', { lineHeight: '48px', letterSpacing: '-0.5px', fontWeight: '900' }],
        h2: ['32px', { lineHeight: '38px', fontWeight: '700' }],
        h3: ['22px', { lineHeight: '28px', fontWeight: '700' }],
        eyebrow: ['12px', { lineHeight: '16px', letterSpacing: '1.8px', fontWeight: '700' }],
        lead: ['20px', { lineHeight: '32px', fontWeight: '500' }],
        body: ['16px', { lineHeight: '28px', fontWeight: '400' }],
        small: ['14px', { lineHeight: '22px', fontWeight: '400' }],
        label: ['12px', { lineHeight: '18px', letterSpacing: '1.2px', fontWeight: '600' }],
        stat: ['72px', { lineHeight: '72px', letterSpacing: '-2px', fontWeight: '900' }],
        button: ['15px', { lineHeight: '16px', letterSpacing: '0.3px', fontWeight: '700' }]
      },
      spacing: {
        1: '4px', 2: '8px', 3: '12px', 4: '16px', 6: '24px',
        8: '32px', 12: '48px', 16: '64px', 24: '96px', 32: '128px'
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '16px',
        full: '999px'
      },
      boxShadow: {
        sm: '0 2px 4px rgba(0,35,47,0.08)',
        lg: '0 12px 30px rgba(0,35,47,0.16)'
      },
      maxWidth: {
        container: '1200px',
        measure: '62ch'
      },
      backgroundImage: {
        // Signature device: the dot grid
        dotgrid: 'radial-gradient(circle, rgba(0,35,47,0.13) 1.6px, transparent 1.6px)',
        'dotgrid-dark': 'radial-gradient(circle, rgba(233,221,199,0.16) 1.6px, transparent 1.6px)'
      },
      backgroundSize: {
        dotgrid: '22px 22px'
      }
    }
  },
  plugins: []
};
