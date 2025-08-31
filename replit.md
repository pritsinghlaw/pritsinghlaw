# Pritsinghlaw.com - California Law Firm Website

## Overview

This is a static website codebase for the Law Offices of Pritpal Singh, PC, a California-based real estate law firm. The website is built using Webflow templates with custom HTML, CSS, and JavaScript enhancements. It serves as the primary digital presence for the law firm, providing information about legal services, attorney profiles, and client resources with a focus on California real estate law.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static HTML Structure**: Multi-page website with individual HTML files for different sections (home, about, services, contact, etc.)
- **Webflow Integration**: Built on Webflow platform with custom CSS overrides and JavaScript enhancements
- **Responsive Design**: Mobile-first approach with Tailwind CSS integration for modern styling
- **CSS Architecture**: Multiple CSS files for different purposes:
  - `prit.css` - Primary styling
  - `styles.css` - Component-specific styles with CSS custom properties
  - `payments.css` and `portal.css` - Feature-specific styling
- **JavaScript Functionality**: Vanilla JavaScript for interactive features including navigation, forms, and performance optimization

### Design System
- **Brand Colors**: Navy blue (#001f54) and orange (#ff4900) as primary brand colors
- **Typography**: Inter and Open Sans font families with varying weights
- **Component Library**: Reusable CSS components with consistent spacing, colors, and typography

### Interactive Features
- **AI Chatbot Integration**: Custom chat widget (PritAI) with Gemini API integration for legal support
- **Client Portal**: Secure login system with session management
- **Payment Processing**: LawPay integration for secure bill payments
- **Knowledge Base**: Searchable legal resource center
- **Contact Forms**: Enhanced contact forms with validation

### Performance Optimization
- **Service Worker**: Custom caching strategy for static assets and performance optimization
- **Image Optimization**: Lazy loading and compression for improved load times
- **Critical Resource Preloading**: Strategic preloading of fonts and critical assets
- **Core Web Vitals**: Optimized for Google's performance metrics

### Navigation and User Experience
- **Consistent Navigation**: Unified header/navigation across all pages
- **Modal Systems**: Client intake forms and consultation booking modals
- **Search Functionality**: Site-wide search with filtering capabilities
- **Mobile Menu**: Responsive hamburger menu for mobile devices

## External Dependencies

### Third-Party Services
- **Webflow**: Primary hosting and CMS platform
- **Google Fonts**: Web fonts (Inter, Open Sans, Geologica)
- **Font Awesome**: Icon library for UI elements
- **Tailwind CSS**: Utility-first CSS framework (CDN)

### APIs and Integrations
- **Gemini API**: Google's AI API for chatbot functionality
- **LawPay**: Payment processing for legal services
- **Google Analytics**: Website analytics and tracking
- **Webflow Forms**: Form submission handling

### Development Dependencies
- **Express.js**: Node.js server for API key management
- **PostCSS**: CSS processing pipeline
- **Tailwind CSS**: Build-time CSS utilities

### Content Delivery
- **Webflow CDN**: Asset delivery for CSS and images
- **Google Fonts CDN**: Font delivery
- **External CDNs**: Various libraries and frameworks loaded via CDN

### Security and Authentication
- **JWT Tokens**: Session management for client portal
- **Cookie-based Sessions**: Secure authentication handling
- **HTTPS**: Secure communication protocols