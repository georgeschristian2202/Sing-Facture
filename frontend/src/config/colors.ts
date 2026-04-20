/**
 * Charte graphique SING S.A.
 * Couleurs officielles Pantone
 */

export const SING_COLORS = {
  // Couleur principale - Pantone 228 C (Magenta/Rose)
  primary: {
    main: '#8E0B56',      // Pantone 228 C
    light: '#B8155E',
    dark: '#6A0842',
    rgb: 'rgb(142, 11, 86)',
    hex: '#8E0B56'
  },

  // Couleur secondaire - Pantone 606 C (Jaune)
  secondary: {
    main: '#DFC52F',      // Pantone 606 C
    light: '#E8D15F',
    dark: '#C5AD1A',
    rgb: 'rgb(223, 197, 47)',
    hex: '#DFC52F'
  },

  // Couleur tertiaire - Pantone 7553 C (Marron)
  tertiary: {
    main: '#5C4621',      // Pantone 7553 C
    light: '#7D5E2C',
    dark: '#3D2E16',
    rgb: 'rgb(92, 70, 33)',
    hex: '#5C4621'
  },

  // Couleur accent - Pantone 3145 C (Turquoise)
  accent: {
    main: '#00758D',      // Pantone 3145 C
    light: '#0095B3',
    dark: '#005566',
    rgb: 'rgb(0, 117, 141)',
    hex: '#00758D'
  },

  // Couleur complémentaire - Pantone 547 C (Bleu foncé)
  complement: {
    main: '#0C303C',      // Pantone 547 C
    light: '#164555',
    dark: '#081E26',
    rgb: 'rgb(12, 48, 60)',
    hex: '#0C303C'
  },

  // Neutre - Pantone Neutral Black C
  neutral: {
    black: '#1D1D1B',     // Pantone Neutral Black C
    white: '#EDEDED',     // Pantone 663 C (Gris très clair)
    gray: {
      100: '#F5F5F5',
      200: '#EDEDED',
      300: '#D1D1D1',
      400: '#A8A8A8',
      500: '#808080',
      600: '#5C5C5C',
      700: '#3D3D3D',
      800: '#2A2A2A',
      900: '#1D1D1B'
    }
  },

  // Couleurs de statut
  status: {
    success: '#10b981',   // Vert
    warning: '#f59e0b',   // Orange
    error: '#ef4444',     // Rouge
    info: '#3b82f6'       // Bleu
  },

  // Couleurs de fond
  background: {
    main: '#F5F5F5',      // Fond principal
    secondary: '#FFFFFF', // Fond secondaire (cartes)
    dark: '#0C303C'       // Fond sombre
  },

  // Couleurs de texte
  text: {
    primary: '#1D1D1B',   // Texte principal
    secondary: '#5C5C5C', // Texte secondaire
    light: '#A8A8A8',     // Texte clair
    white: '#FFFFFF'      // Texte blanc
  },

  // Couleurs de bordure
  border: '#E5E7EB',

  // Gradients SING
  gradients: {
    primary: 'linear-gradient(135deg, #8E0B56 0%, #B8155E 100%)',
    secondary: 'linear-gradient(135deg, #DFC52F 0%, #E8D15F 100%)',
    accent: 'linear-gradient(135deg, #00758D 0%, #0095B3 100%)',
    hero: 'linear-gradient(135deg, #8E0B56 0%, #00758D 50%, #DFC52F 100%)',
    dark: 'linear-gradient(135deg, #0C303C 0%, #1D1D1B 100%)'
  }
};

/**
 * Palette de couleurs pour les graphiques et visualisations
 */
export const CHART_COLORS = [
  SING_COLORS.primary.main,
  SING_COLORS.secondary.main,
  SING_COLORS.accent.main,
  SING_COLORS.tertiary.main,
  SING_COLORS.complement.main,
  SING_COLORS.primary.light,
  SING_COLORS.secondary.light,
  SING_COLORS.accent.light
];

/**
 * Thème complet SING
 */
export const SING_THEME = {
  colors: SING_COLORS,
  
  // Typographie
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Poppins', 'Inter', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace"
  },

  // Espacements
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },

  // Bordures
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },

  // Ombres
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  }
};

export default SING_COLORS;
