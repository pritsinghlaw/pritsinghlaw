# Replit.md

## Overview

This is a law firm website for the Law Offices of Pritpal Singh, specializing in California real estate law. The website is built primarily with static HTML pages using Webflow templates, enhanced with custom JavaScript functionality. The project includes a modern client portal system, AI-powered chat support (PritAI), payment processing integration, and various client interaction tools. The site serves as both a marketing platform and a client service hub for real estate legal services across California.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The website uses a static HTML approach with Webflow-generated templates as the foundation. Custom CSS files (styles.css, prit.css, portal.css, payments.css) provide branded styling with a consistent color scheme using navy blue (#001f54) and orange (#ff4900). JavaScript functionality is modularized across multiple files handling specific features like performance optimization, payment processing, and client portal functionality.

### Client Portal System
A secure client portal is implemented with session-based authentication using JWT tokens. The portal includes a dashboard view with case management, document handling, and client communication features. The system supports social login integration (Google, Facebook, Apple) and maintains user sessions through HTTP-only cookies for security.

### AI Chat Integration
PritAI legal assistant is implemented as a client-side chat widget using the Gemini API. The chat system features a floating widget interface, message history, typing indicators, and integration with the firm's branding. API keys are managed through a separate Express server (api-key-server.js) for security.

### Payment Processing
LawPay integration handles secure payment processing for legal services. The payment system includes modal dialogs for payment confirmation, client billing pages, and integration with the firm's existing workflow.

### Performance Optimization
Service worker implementation (sw.js) provides caching strategies for static assets, dynamic content, and images. The website-performance-optimizer.js handles lazy loading, smooth scrolling, and Core Web Vitals optimization.

### Content Management
The site uses a knowledge base system with searchable legal content, FAQ sections, and client resources. Content is organized hierarchically with proper SEO optimization for California-specific legal services.

## External Dependencies

### Third-Party Services
- **Webflow**: Template and hosting infrastructure for the main website
- **LawPay**: Payment processing for legal fees and consultations
- **Google Gemini API**: AI-powered chat assistant functionality
- **Google Fonts**: Typography (Inter, Open Sans, Geologica)
- **Font Awesome**: Icon library for UI elements

### Authentication Providers
- **Google OAuth**: Social login integration
- **Facebook OAuth**: Alternative social login option
- **Apple Sign-In**: iOS/macOS authentication support

### Development Dependencies
- **Express.js**: Backend server for API key management
- **Tailwind CSS**: Utility-first CSS framework for modern components
- **PostCSS**: CSS processing and optimization
- **JWT**: JSON Web Token handling for session management

### CDN Resources
- **Tailwind CSS CDN**: For rapid prototyping and component styling
- **Google Fonts CDN**: Web font delivery
- **Font Awesome CDN**: Icon delivery system

### Browser APIs
- **Service Worker API**: For caching and offline functionality
- **Intersection Observer API**: For lazy loading implementation
- **Web Font Loader**: For optimized font loading
- **Local Storage/Session Storage**: Client-side data persistence