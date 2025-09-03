# Law Offices of Pritpal Singh - Website Repository

## Overview

This repository contains the codebase for the Law Offices of Pritpal Singh website (pritsinghlaw.com), a California-based real estate law firm. The website is built as a multi-page static site with custom CSS styling, interactive JavaScript features, and integrated services for client communication and payments. The site serves as both a marketing platform and client portal for the firm's real estate legal services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Static HTML/CSS/JavaScript website built on a Webflow template foundation
- **Styling Approach**: Custom CSS files (prit.css, styles.css, payments.css, portal.css) with CSS custom properties for theming
- **Brand System**: Consistent design tokens using CSS variables for navy (#001f54) and orange (#ff4900) brand colors
- **Responsive Design**: Mobile-first approach with breakpoint-aware styling and viewport optimizations
- **Component Structure**: Modular HTML pages with shared navigation and footer components
- **Performance Optimization**: Service worker implementation for caching, lazy loading, and performance monitoring via website-performance-optimizer.js

### Page Structure & Routing
- **Core Pages**: Homepage (index.html), About, Services, Contact, Reviews, Careers
- **Legal Pages**: Privacy, Terms, Cookies policies
- **Functional Pages**: Payment portal (pay-my-bill.html), client portal, knowledge base
- **Form Pages**: Client intake forms, review submission, contact forms
- **Utility Pages**: 404 error page, thank you pages, coming soon page

### Interactive Features
- **Modal System**: Client intake popup modals with accessibility features (ARIA attributes, focus management)
- **Search Functionality**: Integrated search with knowledge base filtering
- **Form Processing**: Multi-step client intake forms with validation
- **Navigation**: Mobile-responsive hamburger menu with smooth scrolling
- **Animation System**: CSS animations for floating icons and page transitions

### Client Portal Architecture
- **Authentication**: Social login integration (Google, Facebook, Apple) using JWT tokens
- **Session Management**: Secure cookie-based sessions with HTTP-only flags
- **Portal Features**: Dashboard with case management, document access, billing integration
- **Security**: Token-based authentication with environment variable configuration

### Payment Integration
- **Payment Processor**: LawPay integration for secure legal payment processing
- **Payment Flow**: Modal-based payment interface with confirmation workflows
- **Bill Management**: Secure bill payment portal with client authentication

### Backend Services
- **Server**: Express.js server (api-key-server.js) for API key management
- **API Integration**: Gemini API integration for AI chatbot functionality
- **Environment Management**: Environment variables for sensitive configuration (API keys, webhooks)
- **Development Dependencies**: Tailwind CSS for utility-first styling support

### Knowledge Management
- **Knowledge Base**: Comprehensive legal resource center with search functionality
- **Content Structure**: FAQ system with categorized legal information
- **AI Integration**: Chatbot system for client assistance and information retrieval
- **Content Management**: Static content with dynamic search and filtering capabilities

### SEO & Analytics
- **Meta Optimization**: Comprehensive meta tags, Open Graph, and Twitter Card implementation
- **Local SEO**: California-specific geographic targeting and service area optimization
- **Canonical URLs**: Proper URL canonicalization for search engine optimization
- **Structured Data**: Schema markup for legal services and contact information

## External Dependencies

### Third-Party Services
- **Webflow**: Template foundation and asset hosting via assets-global.website-files.com
- **Google Fonts**: Typography using Open Sans and Geologica font families
- **Font Awesome**: Icon system for UI elements
- **LawPay**: Secure payment processing for legal services
- **Calendly**: Appointment scheduling integration (planned)
- **Zapier**: Webhook integration for form submissions and workflow automation

### Development Tools
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **PostCSS**: CSS processing and optimization
- **Express.js**: Server framework for API endpoints
- **Node.js**: Runtime environment for server-side operations

### Browser APIs & Features
- **Service Workers**: Progressive Web App capabilities and caching
- **Intersection Observer**: Lazy loading and scroll-based animations
- **Local Storage**: Client-side data persistence for search and preferences
- **Fetch API**: Modern HTTP client for API communication

### Asset Management
- **CDN Assets**: External asset hosting for images and stylesheets
- **Font Loading**: Web font optimization with preconnect hints
- **Image Optimization**: Client-side image compression and lazy loading
- **Static Assets**: Local asset serving for icons, logos, and custom graphics

### Analytics & Monitoring
- **Performance Monitoring**: Core Web Vitals tracking and optimization
- **Error Tracking**: Client-side error handling and reporting
- **User Analytics**: Page view tracking and user behavior analysis
- **SEO Monitoring**: Search engine optimization tracking and reporting