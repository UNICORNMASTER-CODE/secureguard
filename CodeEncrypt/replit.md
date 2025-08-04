# Overview

This is a full-stack web application built with React frontend and Express backend that generates customizable Python security tools. The application provides a configuration interface where users can specify parameters like target directories, backup locations, scan profiles, and operation modes. Based on these configurations, the system generates downloadable Python scripts that combine encryption, decryption, and network scanning capabilities.

The application serves as an educational tool for understanding security concepts, allowing users to create custom security scripts with various operational parameters and safety features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Framework**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Hook Form for form state with Zod validation
- **Data Fetching**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with single endpoint for tool generation
- **Code Generation**: Custom service that dynamically creates Python scripts based on user configuration
- **Validation**: Zod schemas shared between frontend and backend for type safety

## Database and Storage
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations

## Development and Build System
- **Build Tool**: Vite for frontend bundling
- **Backend Build**: ESBuild for server-side bundling
- **Development**: Concurrent development with Vite dev server and tsx for backend
- **TypeScript**: Strict mode with path aliases for clean imports

## Security and Validation
- **Input Validation**: Comprehensive Zod schemas for all user inputs
- **Type Safety**: End-to-end TypeScript with shared types
- **Configuration Validation**: Password confirmation, directory restrictions, and operational mode controls
- **Generated Code Safety**: Template-based code generation with configurable safety parameters

# External Dependencies

## Frontend Dependencies
- **@radix-ui/react-***: Complete set of accessible UI primitives for form controls, dialogs, and interactive components
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management with validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod validation
- **wouter**: Lightweight routing library
- **lucide-react**: Icon library for UI components

## Backend Dependencies
- **express**: Web application framework
- **drizzle-orm**: Type-safe ORM for database operations
- **@neondatabase/serverless**: Serverless PostgreSQL database driver
- **zod**: Runtime type validation and schema definition
- **tsx**: TypeScript execution for development

## Development Tools
- **vite**: Frontend build tool and development server
- **@vitejs/plugin-react**: React integration for Vite
- **esbuild**: Fast JavaScript bundler for backend builds
- **drizzle-kit**: Database migration and introspection tools
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Styling and UI
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Conditional className utility
- **tailwind-merge**: Intelligent Tailwind class merging

## Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **PostgreSQL**: Primary database system
- **Environment Variables**: Database connection and configuration management