# E-Commerce Frontend Application

A modern e-commerce web application built with React, TypeScript, and Tailwind CSS. Features a complete shopping experience with product browsing, cart management, and checkout functionality.

**Live Demo**: [https://zintago-estore.vercel.app/](https://zintago-estore.vercel.app/)

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Smooth Scrolling**: Lenis

## Features

- **Product Listing Page (PLP)**: Browse all products with filtering and search
- **Product Detail Page (PDP)**: View detailed product information with image zoom
- **Shopping Cart**: Add/remove items, quantity management
- **Checkout**: Complete order checkout process
- **Order Management**: Track order history
- **Responsive Design**: Mobile-first design
- **Smooth Animations**: Fluid transitions and micro-interactions

## Project Structure

```
src/
├── AddtoCart.tsx       # Add to cart button component
├── App.tsx             # Main application component
├── CartContext.tsx    # Cart state management
├── Checkout.tsx       # Checkout page
├── Home.tsx           # Home page
├── Layout.tsx         # Main layout with header/footer
├── LoadingSpinner.tsx # Loading indicator
├── MobileSearch.tsx   # Mobile search component
├── PDP.tsx            # Product detail page
├── PLP.tsx            # Product listing page
├── index.css          # Global styles
├── main.tsx           # Application entry point
├── ordersDb.ts        # Order database utilities
└── data/
    └── products.json  # Product data
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open  in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking

## Custom Fonts

The project uses custom fonts:
- Bulagria (headings)
- Cabinet Grotesk (bold text)
- Chillax (body text)
- GImolla (accent text)
- Qafine DEMO (special text)
- Agraham (logo/brand)

## License

MIT
