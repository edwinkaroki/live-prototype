# Ujima Loan Pride - Landing Page

A stunning, modern landing page for Ujima Loan Pride, an AI-powered SACCO loan assessment platform serving Kenya.

## Features

✨ **Modern Design**
- Premium fintech aesthetic
- Glassmorphism and gradient effects
- African-inspired visual identity
- Deep Forest Green (#14532D) & Rich Gold (#D4AF37) color palette

🎨 **Smooth Animations**
- Framer Motion animations throughout
- Smooth scrolling navigation
- Floating elements and transitions
- Hover effects on interactive elements

📱 **Fully Responsive**
- Mobile-first design approach
- Tailwind CSS responsive utilities
- Works seamlessly on all devices

🚀 **Performance Optimized**
- Built with React + Vite
- Fast build and dev server
- Optimized bundle size
- Production-ready

## Sections

1. **Navigation** - Sticky navbar with logo and menu
2. **Hero** - Full-screen hero with floating cards
3. **Trust** - Animated statistics and impact metrics
4. **How It Works** - Three AI agents (Scout, Guardian, Hunter)
5. **Features** - Six feature cards with icons
6. **Benefits** - Two-column benefits for members and officers
7. **Testimonials** - Real stories from users
8. **Impact** - Kenya-wide reach and statistics
9. **Call to Action** - Compelling conversion section
10. **Footer** - Comprehensive footer with links

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:
```bash
cd ujima-landing
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Development

### Project Structure

```
ujima-landing/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Trust.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Features.jsx
│   │   ├── Benefits.jsx
│   │   ├── Testimonials.jsx
│   │   ├── Impact.jsx
│   │   ├── CTA.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

### Customization

- **Colors**: Edit `tailwind.config.js` to change the color palette
- **Content**: Edit individual component files to update text and images
- **Animations**: Modify Framer Motion configuration in components
- **Layout**: Adjust Tailwind CSS classes in JSX files

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

Preview the build:
```bash
npm run preview
```

## Features Breakdown

### Navbar
- Fixed positioning with glassmorphism effect
- Mobile hamburger menu
- Smooth animations
- Logo and CTA buttons

### Hero Section
- Full-screen gradient background
- Animated floating cards
- Call-to-action buttons
- Responsive layout

### Trust Section
- Animated counters
- Four key statistics
- Hover effects on cards
- Responsive grid

### How It Works
- Three-step process visualization
- Agent descriptions with icons
- Visual flow indicators
- Glassmorphism cards

### Features Section
- Six feature cards
- Icon animations
- Hover animations
- Bottom accent lines

### Benefits Section
- Two-column layout for mobile responsiveness
- Benefit icons with animations
- Left/right slide animations
- Call-to-action buttons

### Testimonials
- Three user testimonials
- Profile pictures (emoji placeholders)
- Star ratings
- Responsive grid

### Impact Section
- Four impact statistics
- Animated background elements
- Map-inspired visual design
- Kenya-wide reach messaging

### CTA Section
- Large headline
- Dual call-to-action buttons
- Benefit cards
- Animated background icons

### Footer
- Comprehensive link sections
- Social media icons
- Newsletter signup
- Copyright information

## Color Palette

- **Deep Forest Green**: #14532D
- **Rich Gold**: #D4AF37
- **White**: #FFFFFF
- **Dark Slate Gray**: #2C3E50
- **Soft Cream**: #FFF8E7

## Performance Tips

- Images are optimized and lazy-loaded
- CSS is minified and tree-shaken
- JavaScript is split into chunks
- Consider adding image optimization for future enhancements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2026 Ujima Loan Pride. All Rights Reserved.

## Support

For issues, feature requests, or contributions, please contact the development team.

---

Built with ❤️ for fair lending in Kenya
