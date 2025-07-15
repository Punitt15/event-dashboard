# Event Dashboard

A modern, responsive event management dashboard built with Next.js, React, and Tailwind CSS. This project allows users to sign up, log in, create, edit, filter, and manage events securely with local encryption for user passwords.

## Features

- User authentication (signup, login, logout) with password encryption (email is stored in plain text)
- Create, edit, and delete events
- Filter and sort events by type, category, and date
- Responsive, modern UI with Tailwind CSS
- All user passwords and the user list are encrypted in localStorage (using AES)
- User-specific event overlap checks (users cannot create overlapping events for themselves, but can overlap with other users)
- Centralized type definitions and constants for maintainability
- Generalized localStorage utility functions for safe, consistent storage access

## Getting Started

### 1. Clone the repository

```bash
https://github.com/your-username/event-dashboard.git
cd event-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the following:

```
NEXT_PUBLIC_AUTH_SECRET=your_super_secret_key_here
```
Replace `your_super_secret_key_here` with a strong, unique secret. This key is used to encrypt/decrypt user passwords in localStorage.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### 5. Build for production

To create an optimized production build, run:

```bash
npm run build
```

To start the production server after building:

```bash
npm start
```

## Project Structure

- `src/app/` — Next.js app directory (pages, layout, routing)
- `src/components/` — Reusable UI components (forms, navigation, event list, etc.)
- `src/contexts/` — React context for authentication and event state
- `src/constants/` — Centralized constants (categories, event types, etc.)
- `src/types/` — Centralized TypeScript types and interfaces
- `src/utils/` — Utility functions (e.g., localStorage helpers)

## Security Notes

- Only user passwords are encrypted using AES before being stored in localStorage; emails are stored in plain text for usability.
- The encryption key is managed via an environment variable for better security.
- For production, always use a strong, unique key and never commit your `.env.local` file.
- All localStorage access is handled through utility functions for safety and consistency.

## Form Validation

The event creation and edit forms include robust validation:

- **Required fields:** Title, description, event type, start and end date/time, and category.
- **Conditional required fields:**
  - Location is required if event type is "In-Person".
  - Event link is required (and must be a valid URL) if event type is "Online".
- **Date validation:**
  - Start date/time must be before end date/time.
  - End date/time must be after start date/time.
- **No overlapping events:**
  - Users cannot create or edit events that overlap with their own existing events. If an overlap is detected, the conflicting event's name is shown in the error message.

## Customization

- Tailwind CSS is used for styling; customize the UI easily via utility classes.

