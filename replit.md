# Law Offices of Pritpal Singh Website

## Overview

This is a Webflow-based website for the Law Offices of Pritpal Singh, a California-focused real estate law firm. The site serves as both a marketing platform and client portal, featuring multiple interactive components including an AI-powered legal assistant, client intake forms, appointment booking system, and secure client portal. The architecture combines static HTML pages with dynamic JavaScript functionality and Express.js backend services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Static Site Foundation**: Built on Webflow's exported HTML/CSS structure with custom JavaScript enhancements. The site uses a traditional multi-page architecture with shared navigation and footer components across all pages.

**Styling System**: Employs a hybrid approach combining Webflow's generated CSS with custom CSS files (prit.css, styles.css, payments.css, portal.css). The design system uses CSS custom properties for consistent branding with primary colors of navy blue (#001f54) and orange (#ff4900).

**JavaScript Enhancement**: Custom JavaScript files provide interactive functionality including smooth scrolling, lazy loading, performance optimization, and modal management. The app.js file handles core navigation and UI interactions.

**Responsive Design**: Mobile-first approach with responsive breakpoints managed through Webflow's responsive system and custom CSS media queries.

### Backend Architecture

**Express.js Server**: Lightweight Node.js server (api-key-server.js) primarily handling API key management for external service integrations.

**Static File Serving**: The backend serves static assets while the main site functionality relies on client-side JavaScript and third-party service integrations.

**Authentication Flow**: JWT-based session management for the client portal with support for multiple OAuth providers (Google, Facebook, Apple) as indicated in the authentication snippets.

### Key Features and Components

**AI Chat Assistant**: PritAI legal assistant implemented with Gemini API integration, featuring a floating chat widget with Tailwind CSS styling and real-time conversation capabilities.

**Client Portal**: Secure dashboard for clients to view case information, documents, and communicate with attorneys. Uses role-based access control and session management.

**Appointment Booking System**: Dual-track consultation booking (free 15-minute and paid 1-hour consultations) with modal-based intake forms.

**Payment Integration**: LawPay integration for secure payment processing with modal-based payment flows.

**Performance Optimization**: Comprehensive performance optimization including service worker implementation, lazy loading, and Core Web Vitals optimization.

### Content Management

**Knowledge Base**: Structured legal content with search functionality and FAQ system implemented in knowledge-base.html with custom JavaScript for content filtering.

**Review System**: Client feedback collection system with integration to Google and Yelp for review management.

**SEO Optimization**: California-focused local SEO with structured data, canonical URLs, and location-specific meta tags.

## External Dependencies

### Core Technologies
- **Webflow**: Primary design and CMS platform for content management
- **Node.js/Express**: Backend server framework for API key management
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

### Third-Party Services
- **Google Fonts**: Typography (Inter, Open Sans, Geologica font families)
- **Google Analytics**: Website performance tracking and user behavior analysis
- **Gemini AI API**: Powers the PritAI legal assistant chatbot functionality
- **LawPay**: Secure payment processing for legal services

### Authentication Providers
- **Google OAuth**: Client authentication for portal access
- **Facebook Login**: Alternative social authentication option
- **Apple Sign-In**: iOS/macOS user authentication support

### Development Tools
- **PostCSS**: CSS processing and optimization
- **Font Awesome**: Icon library for UI components
- **WebFont Loader**: Optimized font loading and rendering

### Performance and Monitoring
- **Service Worker**: Caching strategy for improved site performance
- **Intersection Observer API**: Efficient lazy loading implementation
- **Web Vitals**: Core performance metrics monitoring