# Wijnproef App - Design Style Guide

## Typography

### Primary Fonts
- **Headings**: Lusitana (Google Font)
  - Weights: 400 (Regular), 700 (Bold)
  - Usage: All h1, h2, h3, h4 elements
  - Character: Classic, elegant serif with wine/literary sophistication

- **Body**: Inter (Google Font)
  - Variable font with full weight range
  - Usage: Body text, UI elements
  - Character: Clean, modern sans-serif with excellent readability

- **Monospace**: Geist Mono
  - Usage: Code, technical data
  - Character: Modern geometric monospace

## Color Palette (OKLCH)

### Light Mode
- **Background**: `oklch(96% 0.02 52)` - Warm off-white
- **Foreground**: `oklch(22% 0.05 30)` - Deep brown-black
- **Primary**: `oklch(40% 0.15 20)` - Rich warm brown
- **Primary Foreground**: `oklch(96% 0.02 52)` - Light cream
- **Secondary**: `oklch(90% 0.03 20)` - Light warm neutral
- **Secondary Foreground**: `oklch(30% 0.08 25)` - Dark brown
- **Accent**: `oklch(88% 0.04 350)` - Soft rose/pink
- **Accent Foreground**: `oklch(30% 0.08 350)` - Deep rose
- **Muted**: `oklch(92% 0.02 50)` - Very light neutral
- **Muted Foreground**: `oklch(48% 0.04 30)` - Medium brown
- **Border**: `oklch(90% 0.01 50)` - Subtle warm gray
- **Card**: `oklch(100% 0 0)` - Pure white
- **Destructive**: `oklch(55% 0.16 25)` - Warm red-brown

### Dark Mode
- **Background**: `oklch(18% 0.03 10)` - Very dark brown
- **Foreground**: `oklch(95% 0.02 52)` - Light cream
- **Primary**: `oklch(70% 0.12 30)` - Warm tan/beige
- **Secondary**: `oklch(30% 0.04 15)` - Dark neutral brown
- **Accent**: `oklch(38% 0.04 350)` - Muted rose
- **Card**: `oklch(24% 0.04 15)` - Dark card surface

### Color Philosophy
- Warm, earthy palette inspired by wine culture
- Low saturation for sophistication
- OKLCH color space for perceptual uniformity
- Consistent warmth across light and dark modes

## Design System

### Border Radius
- **Base**: `0.625rem` (10px)
- **Small**: `calc(0.625rem - 4px)` = 6px
- **Medium**: `calc(0.625rem - 2px)` = 8px
- **Large**: `0.625rem` = 10px
- **Extra Large**: `calc(0.625rem + 4px)` = 14px
- **Components**: Often use `rounded-2xl` (1rem/16px) for cards

### Spacing & Layout
- Container max-width: `max-w-5xl` (80rem/1280px)
- Generous padding: `px-6 py-16` for sections
- Flex-based layouts with gap utilities
- Responsive breakpoints using Tailwind defaults

### Visual Style
- **Cards**: White background, subtle borders, soft shadows (`shadow-sm`)
- **Gradients**: Subtle overlays using primary/accent with low opacity
  - Example: `bg-gradient-to-br from-primary/10 via-transparent to-accent/20`
- **Borders**: Minimal, subtle borders (`border` class)
- **Shadows**: Soft, understated (`shadow-sm` primarily)

### Typography Scale
- Hero heading: `text-4xl sm:text-5xl` (2.25rem-3rem)
- Section headings: `text-xl` (1.25rem)
- Body text: `text-lg` for primary content, `text-sm` for secondary
- Small text: `text-xs` for metadata
- Weight: `font-semibold` or `font-bold` for headings

## Component Patterns

### Badges
- Variant: `secondary`
- Usage: Labels, status indicators
- Paired with supporting text in muted foreground

### Buttons
- Sizes: `lg` for primary CTAs
- Variants: Default (primary), `ghost` for secondary actions
- Often use `asChild` pattern with Next.js Link

### Cards
- Structure: `rounded-2xl border bg-card p-6 shadow-sm`
- Often contain gradient overlays for visual interest
- Nested content with semantic spacing

### Icons
- Library: Lucide React
- Size: `h-10 w-10` for feature icons
- Color: `text-primary` for emphasis
- Usage: Decorative (aria-hidden) and functional

## Overall Aesthetic

### Brand Personality
- **Sophisticated**: Lusitana serif font conveys refinement
- **Welcoming**: Warm color palette, generous spacing
- **Modern**: Clean layouts, subtle animations ready
- **Focused**: Minimal decoration, content-first approach

### Key Characteristics
1. Warm, earthy color temperature throughout
2. Generous whitespace and breathing room
3. Soft, rounded corners everywhere
4. Subtle depth through shadows and overlays
5. Typography contrast (serif headings + sans body)
6. Low-saturation, tasteful color palette

### Technical Stack
- Tailwind CSS v4
- Shadcn/ui components
- Dark mode support via ThemeProvider
- Antialiased text rendering
- CSS custom properties for theme tokens