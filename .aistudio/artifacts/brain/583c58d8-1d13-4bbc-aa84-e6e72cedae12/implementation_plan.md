# GOJJA SmartTV — Mobile Responsive Polish & Optimization Plan

## 1. Objectives & Context
Following user clarification and Design System v1.1 standards (§9.3, §14):
- **Dashboard Navigation on Mobile**: Full slide-out navigation drawer with backdrop blur, smooth entrance/exit, and complete access to all `WORKSPACE` and `ADMINISTRATION` tabs.
- **Login Screen on Mobile**: Compact luxury resort photo header with priority authentication card, avoiding unnecessary vertical scrolling to reach the form fields and CTA.
- **Data & Tables on Mobile**: Horizontally scrollable and comfortably padded tables with sticky columns or card-like readability.
- **Charts & KPIs on Mobile**: Responsive 2-column KPI grid, fluid dual-line SVG chart with touch tooltip support, and minimum 44px tap targets.

---

## 2. Proposed Changes

### Component 1: `src/components/LoginLandingView.tsx`
- **Compact Mobile Resort Header**:
  - On mobile (`< 1024px`), display a high-impact luxury resort photo strip at the top with the official `gojja` logo and brief tagline.
  - Position the curved pearl authentication card prominently so users can immediately interact with email, password, and sign-in buttons without scrolling.
  - Keep the utility bar (language, theme toggle pill, help) pinned or easily accessible.
  - Maintain the expandable 16-role persona testing drawer on mobile for seamless evaluator testing.

### Component 2: `src/App.tsx` (Dashboard Shell & Overview)
- **Slide-out Navigation Drawer**:
  - Add state `mobileMenuOpen` (boolean) toggled by the hamburger menu button in the top bar.
  - Implement mobile backdrop overlay (`bg-black/60 backdrop-blur-xs`) and sliding left drawer (`w-72 max-w-[85vw]`).
  - Render the complete sidebar contents inside the drawer:
    - Official vector logo header & `PROPERTY WORKSPACE` badge
    - Full `WORKSPACE` navigation list (Overview, Rooms & Guests, Devices, Discovery & Deploy, etc.)
    - Full `ADMINISTRATION` navigation list (Users & Access, Subscription, Support, Settings)
    - Need help? link
    - Resort photo card (`file_0000000043808207bbdf250e0b1586c7_702e345a.png`)
  - Automatically close drawer on tab selection or backdrop tap.
- **Top Shell Header Responsive Layout**:
  - Ensure title, property picker, theme toggle, and notifications fit cleanly on mobile screens without overflowing or wrapping awkwardly.
  - Move search input to a collapsible bar or compact toggle on narrow viewports.
- **Property Overview Tab (`overview`) Responsive Polish**:
  - **Hero Banner**: Scale panoramic Borobudur banner (`file_00000000a6b08211935c3a540293bf6c_74821162.png`) gracefully on mobile, stacking text and CTA buttons vertically with full-width tap targets.
  - **KPI Grid**: 2-column grid on mobile (`grid-cols-2`), 3-column on tablet (`md:grid-cols-3`), 6-column on wide screens (`xl:grid-cols-6`).
  - **Device & Room Health Table**: Smooth horizontal overflow with scrollbar styling and touch scrolling.
  - **Playback Insights SVG Chart**: Fluid SVG viewBox (`preserveAspectRatio="xMidYMid meet"`) with responsive axis markers and touch tooltips.
  - **Supporting Row**: Stack 3 cards cleanly with full-width primary buttons.

---

## 3. Verification & Acceptance
- Run `lint_applet` (`tsc --noEmit`) to verify zero TypeScript errors.
- Run `compile_applet` to verify build completion.
- Test viewport responsiveness across desktop, tablet (768px), and mobile (375px/414px).
- Verify smooth drawer animations, keyboard accessibility, and Light/Warm Graphite Dark theme consistency.
