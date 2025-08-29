# Overview

This is a static website for the Law Offices of Pritpal Singh, PC, a California-based real estate law firm. The website serves as the firm's digital presence with multiple HTML pages covering services, about information, contact details, and legal policies. The site includes modern features like an AI chatbot for client support, a secure client portal, payment processing, and interactive booking systems. The codebase is primarily frontend-focused with HTML, CSS, and JavaScript, featuring a professional legal services design with brand colors (navy blue #001f54 and orange #ff4900).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The website uses a traditional multi-page HTML structure with shared CSS styling and JavaScript functionality. Each page follows a consistent layout pattern with header navigation, main content sections, and footer components. The design system uses CSS custom properties for brand colors and maintains visual consistency across all pages.

### Page Structure
- **Landing Page (index.html)**: Main homepage with firm overview and services
- **About Page (about.html)**: Attorney background and firm information  
- **Services Page (services.html)**: Practice areas and legal service offerings
- **Contact Page (contact.html)**: AI chatbot interface for client communication
- **Client Portal (client-area/)**: Secure login and dashboard for existing clients
- **Booking System (bookings/)**: Consultation scheduling (free and paid options)
- **Legal Pages**: Privacy policy, terms of service, and cookie policy
- **Utility Pages**: 404 error, thank you, and coming soon pages

### JavaScript Functionality
The site includes several JavaScript modules:
- **Website Performance Optimizer**: Handles lazy loading, smooth scrolling, and Core Web Vitals optimization
- **Client Portal Application**: Full-featured dashboard for case management and client communication
- **Payment Processing**: Integration with LawPay for secure billing
- **AI Chatbot**: Customer support chatbot using Google's Gemini API
- **Navigation Sync**: Maintains consistent header navigation across pages

### Styling System
Uses a comprehensive CSS architecture with:
- **CSS Custom Properties**: Centralized color tokens and design system variables
- **Brand Colors**: Navy blue (#001f54) and orange (#ff4900) primary palette
- **Responsive Design**: Mobile-first approach with Tailwind CSS integration
- **Component-based Styling**: Modular CSS for buttons, forms, and navigation elements

### Performance Optimization
- **Service Worker**: Caches static assets and implements offline functionality
- **Lazy Loading**: Intersection Observer API for images and content
- **Resource Preloading**: Critical CSS and font optimization
- **Image Optimization**: Client-side compression and modern format support

### Client Portal Features
The secure client portal includes:
- **Authentication System**: Multi-provider login (Google, Facebook, Apple)
- **Dashboard**: Case overview, document management, and messaging
- **Case Management**: Progress tracking and deadline monitoring
- **Document Handling**: Secure file upload and sharing
- **Billing Integration**: Invoice viewing and payment processing

### Modal and Interaction Systems
- **Consultation Booking**: Multi-step form with pricing and scheduling
- **Client Intake**: Comprehensive form for new client onboarding
- **Payment Processing**: Secure LawPay integration with modal interfaces
- **Navigation Modals**: Mobile-responsive dropdown menus and search

## External Dependencies

### API Integrations
- **Google Gemini API**: Powers the AI chatbot for client support and legal guidance
- **LawPay**: Secure payment processing for legal billing and consultation fees
- **Google Fonts**: Web font delivery (Open Sans, Inter, Geologica)
- **Font Awesome**: Icon library for UI components

### Frontend Frameworks and Libraries
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Webflow CSS**: Legacy styling system from original template
- **PostCSS**: CSS processing and optimization
- **Express.js**: Minimal server for API key management

### Development Tools
- **Node.js**: Runtime for build tools and API server
- **npm**: Package management for dependencies
- **Git**: Version control with potential GitHub integration

### Authentication Providers
- **Google OAuth**: Client authentication for portal access
- **Facebook Login**: Alternative authentication method
- **Apple Sign In**: iOS/macOS authentication support

### Third-party Services
- **Webflow**: Original template and hosting infrastructure
- **CDN Resources**: External CSS and JavaScript libraries
- **Email Services**: Contact form and notification handling (implied)
- **Calendar Integration**: Consultation booking and scheduling (implied)

### Browser APIs
- **Service Worker API**: Offline functionality and caching
- **Intersection Observer**: Lazy loading implementation
- **Web Fonts API**: Font loading optimization
- **Local Storage**: Client-side data persistence