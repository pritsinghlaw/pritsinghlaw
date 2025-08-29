# Overview

This is a professional law firm website for the Law Offices of Pritpal Singh, PC, specializing in California real estate law. The website is built on Webflow with custom HTML/CSS/JavaScript components and includes modern features like an AI-powered legal assistant chatbot, client portal, online payment system, and various client engagement tools. The site serves as both a marketing platform and a comprehensive client service hub for Bay Area real estate legal services.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The website uses a **hybrid static/dynamic approach** combining Webflow's visual editor with custom HTML/CSS/JavaScript. Core pages are built in Webflow (index.html, about.html, services.html) while specialized features are implemented as standalone HTML pages with custom styling. The design system uses a consistent color palette (navy #001f54, orange #ff4900) and Inter/Open Sans typography. JavaScript handles interactive features including smooth scrolling, lazy loading, modal systems, and form management.

## Client Portal System
A secure client portal provides authenticated access to case information, documents, and communication tools. The portal uses a **session-based authentication system** with JWT tokens stored in HTTP-only cookies. Social login integration supports Google, Facebook, and Apple Sign-In for user convenience. The portal includes dashboard metrics, case tracking, document management, and billing features implemented as a single-page application.

## AI Assistant Integration
The website features "PritAI," an AI-powered legal assistant chatbot built with Google's Gemini API. The chatbot is implemented as a **floating widget** that can be embedded across pages to provide instant legal guidance and support. API key management is handled through a separate Express.js server to maintain security.

## Payment Processing
Online payment functionality is integrated through LawPay, a legal industry-compliant payment processor. The payment system includes modal-based interfaces, consultation booking workflows, and secure transaction handling. Payment forms include validation, progress tracking, and confirmation systems.

## Performance Optimization
The site implements comprehensive **performance optimization strategies** including lazy loading for images, service worker for caching, resource preloading, and Core Web Vitals optimization. A dedicated performance optimizer script handles smooth scrolling, image compression, and critical resource management.

## Content Management
The website uses a **multi-modal content approach** with static pages for core content, dynamic booking/intake forms, and specialized features like the knowledge base and review system. Content is organized hierarchically with clear navigation patterns and SEO optimization throughout.

# External Dependencies

- **Webflow Hosting & CMS** - Primary hosting platform and visual editor
- **Google Fonts** - Typography (Inter, Open Sans, Geologica fonts)
- **Google Gemini AI API** - Powers the PritAI chatbot assistant
- **LawPay Payment Processing** - Secure legal industry payment processing
- **Font Awesome** - Icon library for UI elements
- **Tailwind CSS** - Utility-first CSS framework for custom components
- **Express.js** - Backend server for API key management
- **Social Login APIs** - Google Sign-In, Facebook Login, Apple Sign-In for client portal authentication
- **CDN Resources** - External CSS/JS libraries and optimization scripts