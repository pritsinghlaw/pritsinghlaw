# Law Offices of Pritpal Singh Website

## Overview

This repository contains the website codebase for the Law Offices of Pritpal Singh, a California-based real estate law firm. The project is built as a static website with modern web technologies, featuring multiple client-facing pages, interactive components, and AI-powered legal assistance tools. The site serves as both a marketing platform and a client portal for the law firm's real estate legal services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The website follows a **multi-page static architecture** using vanilla HTML, CSS, and JavaScript. Key design decisions include:

- **Static HTML Pages**: Individual HTML files for each major section (index.html, about.html, services.html, contact.html, etc.)
- **Webflow Integration**: The site appears to have been initially built with Webflow, with custom CSS overrides and JavaScript enhancements
- **Component-Based CSS**: Modular CSS files (prit.css, styles.css, payments.css, portal.css) for different sections
- **Responsive Design**: Mobile-first approach with viewport meta tags and responsive CSS
- **Progressive Enhancement**: Core functionality works without JavaScript, with enhanced features added via JS

### Interactive Features
- **AI Chat Assistant (PritAI)**: Custom chatbot integration using Gemini API for legal support
- **Client Portal**: Secure area with authentication and case management (portal.html)
- **Contact Forms**: Enhanced contact forms with validation and submission handling
- **Modal Systems**: Popup modals for consultation booking and client intake
- **Payment Integration**: LawPay integration for secure payment processing

### Performance Optimization
- **Service Worker**: Custom caching strategy implemented in sw.js
- **Image Optimization**: Lazy loading and compression utilities
- **Resource Preloading**: Critical resource preloading for faster page loads
- **Web Fonts**: Google Fonts integration with proper preloading

### Brand System
The site uses a consistent design system with:
- **Primary Colors**: Navy Blue (#001f54) and Orange (#ff4900)
- **Typography**: Open Sans and Geologica fonts from Google Fonts
- **Component Library**: Reusable button styles, form components, and layout patterns

### Client-Side Architecture
- **Vanilla JavaScript**: No heavy frameworks, using modern ES6+ features
- **Event-Driven Design**: Modular JS with event listeners for user interactions
- **Local Storage**: Form data persistence and user preferences
- **API Integration**: RESTful API calls to external services (Gemini AI, payment processors)

## External Dependencies

### Third-Party Services
- **Webflow**: Original design and hosting platform integration
- **Google Fonts**: Typography (Open Sans, Geologica, Inter)
- **Font Awesome**: Icon library for UI elements
- **Tailwind CSS**: Utility-first CSS framework (loaded via CDN)
- **Google Gemini API**: AI chatbot functionality for legal assistance
- **LawPay**: Secure payment processing for legal services

### CDN Resources
- **Google WebFont Loader**: Dynamic font loading optimization
- **Tailwind CSS CDN**: Rapid styling without build process
- **Font Awesome CDN**: Icon resources

### Development Dependencies
- **Express.js**: Simple API server for key management (api-key-server.js)
- **PostCSS**: CSS processing and optimization
- **Tailwind CSS**: Build-time CSS utilities

### Authentication & Security
The client portal implements multiple authentication providers:
- **Google OAuth**: Social login integration
- **Facebook Login**: Alternative social authentication
- **Apple Sign-In**: iOS-friendly authentication option
- **JWT**: Session management with secure tokens
- **Cookie-based Sessions**: Secure client-side session storage

### Performance & Monitoring
- **Service Worker**: Offline capability and caching
- **Web Performance API**: Core Web Vitals monitoring
- **Intersection Observer**: Efficient lazy loading implementation