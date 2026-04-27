// SweetDash — Blush & Crema palette (minimalista repostería)
const P = {
  bg:         'oklch(98.5% 0.008 55)',
  bgSidebar:  'oklch(97.5% 0.012 28)',
  bgCard:     'oklch(99.8% 0.004 50)',
  border:     'oklch(91% 0.015 35)',
  primary:    'oklch(57% 0.13 355)',
  primaryMid: 'oklch(72% 0.09 355)',
  primaryLt:  'oklch(93% 0.04 355)',
  accent1:    'oklch(66% 0.09 290)',
  accent1Lt:  'oklch(93% 0.04 290)',
  accent2:    'oklch(69% 0.10 62)',
  accent2Lt:  'oklch(94% 0.04 62)',
  accent3:    'oklch(63% 0.09 155)',
  accent3Lt:  'oklch(93% 0.04 155)',
  textDark:   'oklch(22% 0.025 35)',
  textMid:    'oklch(50% 0.025 35)',
  textLight:  'oklch(69% 0.015 35)',
};

const palette = {
  ...P,
  // Legacy aliases so existing views keep working without changes
  background:    P.bg,
  sidebarBg:     P.bgSidebar,
  cardBg:        P.bgCard,
  cardBorder:    P.border,
  secondary:     P.primaryMid,
  accent:        P.accent1,
  soft:          P.primaryLt,
  textPrimary:   P.textDark,
  textSecondary: P.textMid,
  textMuted:     P.textLight,
  cardShadow:    '0 1px 4px oklch(0% 0 0 / 0.04)',
  sidebarText:   P.textDark,
  sidebarActive: P.primaryLt,
  sidebarHover:  P.primaryLt,
  sidebarIcon:   P.primary,
};

export default palette;
