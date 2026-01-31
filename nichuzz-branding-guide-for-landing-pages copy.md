# Nichuzz.com Branding Guide

Reference site: [retreats.nichuzz.com](https://retreats.nichuzz.com)

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Purple** | `#5e17eb` | rgb(94, 23, 235) | Primary brand color, buttons, accents |
| **Purple Light** | `#8b5cf6` | rgb(139, 92, 246) | Gradient end, hover states |
| **Gold** | `#ffdd27` | rgb(255, 221, 39) | CTAs, highlights, badges |
| **Gold Warm** | `#ffc107` | rgb(255, 193, 7) | Gradient end for gold elements |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Text Dark** | `#212529` | Headings, primary text |
| **Text Medium** | `#495057` | Body text, descriptions |
| **Background Light** | `#f8f9fa` | Section backgrounds, cards |
| **Border** | `#e9ecef` | Card borders, dividers |
| **White** | `#ffffff` | Card backgrounds, text on dark |
| **Dark** | `#212529` | Footer background |

### CSS Variables

```css
:root {
  /* Primary */
  --purple: #5e17eb;
  --purple-light: #8b5cf6;
  --gold: #ffdd27;
  --gold-warm: #ffc107;

  /* Neutrals */
  --text-dark: #212529;
  --text-medium: #495057;
  --bg-light: #f8f9fa;
  --border: #e9ecef;
  --white: #ffffff;
  --dark: #212529;

  /* Shadows */
  --shadow-light: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0 8px 24px rgba(0, 0, 0, 0.08);
  --shadow-heavy: 0 12px 32px rgba(0, 0, 0, 0.12);
  --shadow-purple: 0 4px 12px rgba(94, 23, 235, 0.3);
  --shadow-gold: 0 8px 24px rgba(255, 221, 39, 0.4);
}
```

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **Hero Title** | 4rem (64px) | 800 | 1.1 | Main page headlines |
| **Section Title** | 2.5rem (40px) | 800 | 1.2 | Section headings |
| **Card Title** | 1.875rem (30px) | 800 | 1.3 | Card headings |
| **Subsection Title** | 1.5rem (24px) | 700 | 1.3 | Sub-headings |
| **Body Large** | 1.25rem (20px) | 500 | 1.6 | Lead paragraphs |
| **Body** | 1rem-1.125rem | 400-500 | 1.6-1.7 | Body text |
| **Small/Caption** | 0.875rem (14px) | 500-600 | 1.4 | Tags, labels, meta |

### Responsive Typography

```css
/* Desktop */
.hero-title { font-size: 4rem; }
.section-title { font-size: 2.5rem; }

/* Tablet (768px) */
@media (max-width: 768px) {
  .hero-title { font-size: 2.5rem; }
  .section-title { font-size: 2rem; }
}

/* Mobile (480px) */
@media (max-width: 480px) {
  .hero-title { font-size: 2rem; }
  .section-title { font-size: 1.75rem; }
}
```

---

## Gradients

### Primary Purple Gradient
```css
background: linear-gradient(135deg, #5e17eb 0%, #8b5cf6 100%);
```

### Primary Gold Gradient
```css
background: linear-gradient(135deg, #ffdd27 0%, #ffc107 100%);
```

### Hero Overlay (with image)
```css
background-image:
  linear-gradient(135deg, rgba(94, 23, 235, 0.9) 0%, rgba(139, 92, 246, 0.85) 100%),
  url('/images/hero-bg.jpg');
```

### Radial Gold Accent
```css
background: radial-gradient(circle at 30% 50%, rgba(255, 221, 39, 0.15) 0%, transparent 60%);
```

### Subtle Purple Background
```css
background: linear-gradient(135deg, rgba(94, 23, 235, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
```

---

## Border Radius

| Element | Radius |
|---------|--------|
| Large cards | 24px |
| Medium cards | 20px |
| Buttons (large) | 16px |
| Buttons (medium) | 12px |
| Tags/Badges | 12px-20px |
| Circles (avatars, numbers) | 50% |
| Highlight blocks | 8px |

---

## Shadows

### Light (default)
```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
```

### Medium (cards)
```css
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
```

### Heavy (images, modals)
```css
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
```

### Purple Accent (buttons, hovers)
```css
box-shadow: 0 4px 12px rgba(94, 23, 235, 0.3);
/* Hover state */
box-shadow: 0 6px 20px rgba(94, 23, 235, 0.4);
```

### Gold Accent (CTA buttons)
```css
box-shadow: 0 8px 24px rgba(255, 221, 39, 0.4);
/* Hover state */
box-shadow: 0 12px 32px rgba(255, 221, 39, 0.5);
```

---

## Spacing

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .container { padding: 0 1.5rem; }
}

@media (max-width: 480px) {
  .container { padding: 0 1rem; }
}
```

### Section Padding
```css
/* Desktop */
section { padding: 6rem 0; }

/* Tablet */
@media (max-width: 768px) {
  section { padding: 4rem 0; }
}

/* Mobile */
@media (max-width: 480px) {
  section { padding: 3rem 0; }
}
```

### Common Gaps
| Size | Value | Usage |
|------|-------|-------|
| Small | 1rem | Inline elements, tight lists |
| Medium | 1.5rem-2rem | Card grids, form fields |
| Large | 3rem-4rem | Sections, major content blocks |

---

## Buttons

### Primary (Gold CTA)
```css
.btn-primary {
  background: linear-gradient(135deg, #ffdd27 0%, #ffc107 100%);
  color: #212529;
  padding: 1.25rem 3rem;
  border-radius: 16px;
  border: none;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(255, 221, 39, 0.4);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(255, 221, 39, 0.5);
}
```

### Secondary (White/Outline)
```css
.btn-secondary {
  background: white;
  color: #5e17eb;
  padding: 1.25rem 3rem;
  border-radius: 16px;
  border: 2px solid #e9ecef;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #5e17eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(94, 23, 235, 0.15);
}
```

### Purple Button
```css
.btn-purple {
  background: linear-gradient(135deg, #5e17eb 0%, #8b5cf6 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(94, 23, 235, 0.3);
  transition: all 0.3s ease;
}

.btn-purple:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(94, 23, 235, 0.4);
}
```

---

## Cards

### Standard Card
```css
.card {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  border: 1px solid #e9ecef;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(94, 23, 235, 0.12);
  border-color: #5e17eb;
}
```

### Feature Card (with number)
```css
.feature-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(94, 23, 235, 0.15);
  border-color: #5e17eb;
}

.feature-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #5e17eb 0%, #8b5cf6 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 12px rgba(94, 23, 235, 0.3);
}
```

---

## Tags & Badges

### Hero Tag
```css
.tag {
  display: inline-block;
  background: rgba(255, 221, 39, 0.2);
  color: #ffdd27;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1px solid rgba(255, 221, 39, 0.4);
}
```

### Badge (on cards/images)
```css
.badge {
  background: rgba(255, 221, 39, 0.95);
  color: #212529;
  padding: 0.5rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## Animations

### Fade In Up (hero content)
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease;
}
```

### Slide Up (modals)
```css
@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### Fade In (overlays)
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Standard Transition
```css
transition: all 0.3s ease;
```

### Hover Transforms
```css
/* Light lift */
transform: translateY(-2px);

/* Medium lift */
transform: translateY(-4px);

/* Heavy lift (cards) */
transform: translateY(-6px);

/* Maximum lift (feature cards) */
transform: translateY(-8px);
```

---

## Hero Section Pattern

```css
.hero {
  position: relative;
  height: 90vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #5e17eb 0%, #8b5cf6 100%);
  background-image:
    linear-gradient(135deg, rgba(94, 23, 235, 0.9) 0%, rgba(139, 92, 246, 0.85) 100%),
    url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  overflow: hidden;
}

/* Gold radial accent overlay */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255, 221, 39, 0.15) 0%, transparent 60%);
  pointer-events: none;
}
```

---

## Footer Pattern

```css
.footer {
  background: #212529;
  color: white;
  padding: 3rem 0 1.5rem;
}

.footer-brand {
  background: linear-gradient(135deg, #5e17eb 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-link {
  color: white;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.footer-link:hover {
  opacity: 1;
  color: #ffdd27;
  transform: translateY(-2px);
}
```

---

## Highlight Block

```css
.highlight {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(94, 23, 235, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border-left: 4px solid #5e17eb;
  border-radius: 8px;
}
```

---

## Grid Patterns

### Auto-fit Cards
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

### 4-Column Feature Grid
```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}
```

### 2-Column About Grid
```css
.about-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
```

---

## Social Icons

Use inline SVGs with `fill="currentColor"` for easy color inheritance.

WhatsApp: `#25D366` (can use on hover)
Instagram: Gradient or `#E4405F`

---

## Checklist for New Landing Pages

1. **Colors**: Use purple gradient for headers/CTAs, gold for primary actions
2. **Typography**: 800 weight for titles, 600-700 for subtitles, 400-500 for body
3. **Spacing**: 6rem section padding (desktop), 2rem container padding
4. **Cards**: 24px radius, 1px border, subtle shadow, purple border on hover
5. **Buttons**: Gold for primary CTA, purple or white for secondary
6. **Shadows**: Always include hover shadow enhancement
7. **Animations**: 0.3s ease transitions, translateY lifts on hover
8. **Footer**: Dark background (#212529), gradient text for brand name
9. **Hero**: Full-height with purple gradient overlay on images
10. **Mobile**: Scale down typography and padding at 768px and 480px breakpoints
