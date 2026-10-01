# Booking App Frontend

> A modern, responsive React client for the Event Booking Spring Boot API.

[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-ca4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-5a29e4?logo=axios&logoColor=white)](https://axios-http.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-0f766e.svg)](#license)

This frontend application provides a user interface for the **Event Booking Backend**. It consumes the RESTful API endpoints to manage event listings, handle user authentication via JWT, process bookings, and provide administrative controls. The interface is branded **EventBook**.

The application runs at `http://localhost:5173` and calls the backend at `http://localhost:8080`.

## Contents

- [Page coverage](#page-coverage)
- [Features](#features)
- [Quick start](#quick-start)
- [Using the app](#using-the-app)
- [API integration](#api-integration)
- [Configuration](#configuration)
- [Project structure](#project-structure)
- [Technology](#technology)
- [Development commands](#development-commands)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Complete command reference](#complete-command-reference)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [License](#license)

## Page coverage

The frontend has **9 page files** in `src/pages/`, with **8 connected to routes**, and **5 components** in `src/components/`.

### Routes

| Route                       | Page                  | Access     | Purpose                                                |
| --------------------------- | --------------------- | ---------- | ------------------------------------------------------ |
| `/`                         | `Listings`            | Public     | Main event browsing page with search, filter, and sort |
| `/login`                    | `Login`               | Public     | Login form                                             |
| `/register`                 | `Register`            | Public     | Registration form                                      |
| `/listings/:id`             | `ListingDetail`       | Public     | Single event details and booking action                |
| `/calendar`                 | `CalendarView`        | Public     | Monthly event calendar                                 |
| `/my-bookings`              | `MyBookings`          | Signed in  | User's booking history                                 |
| `/booking-confirmation/:id` | `BookingConfirmation` | Signed in  | Post-booking success view                              |
| `/admin`                    | `AdminDashboard`      | Admin only | Combined listing and user management                   |

`UserDashboard.jsx` (user stats and upcoming events) is included in the project but is not connected to a route.

Signed-in users who are not admins are redirected from `/admin` to the home page, and signed-out users are redirected to `/login`.

### Components

| Component        | Coverage                                    |
| ---------------- | ------------------------------------------- |
| `Navbar`         | Navigation, theme toggle, and back-to-top   |
| `ListingCard`    | Event preview card                          |
| `AdminUsers`     | User management table and forms             |
| `ProtectedRoute` | Route guard based on auth state             |
| `Icons`          | SVG icon components and the loading spinner |

### Navigation

| Link            | Shown to            |
| --------------- | ------------------- |
| Events          | Everyone            |
| My Bookings     | Signed-in users     |
| Admin           | Admins only         |
| Calendar        | Everyone            |
| Login, Register | Signed-out visitors |
| Logout          | Signed-in users     |

### Listing categories

| Category   | Used for                    |
| ---------- | --------------------------- |
| Workshop   | Hands-on learning sessions  |
| Conference | Talks and networking events |
| Concert    | Music performances          |

These are the three category values offered by the filter on the events page and the category field on the Admin page.

## Features

| Area           | Capabilities                                                                              |
| -------------- | ----------------------------------------------------------------------------------------- |
| Discovery      | Browse events, filter by category, search, sort by date/price                             |
| Calendar       | Visual calendar view of upcoming events fetched from API                                  |
| Bookings       | Create bookings, view personal history, cancel reservations                               |
| Accounts       | User registration, login, and session management via JWT                                  |
| Admin          | Dashboard for CRUD operations on listings and user role management                        |
| UI/UX          | Responsive design, light/dark theme toggle, loading skeletons, toast notifications        |
| Sold-out state | Shows the remaining slots on each event and disables booking when none are left           |
| Delete safety  | Asks for confirmation before cancelling a booking, deleting a listing, or deleting a user |
| Route guards   | Redirects signed-out visitors to the login page and non-admins away from `/admin`         |
| Error handling | Shows API errors as toast notifications and signs you out when the token is rejected      |
| Loading states | Shows a processing overlay while a booking is made, and a brief loader on the logo link   |
| Back to top    | Shows a floating button after scrolling past 300px                                        |
| Theming        | Remembers your light or dark choice, with light as the default                            |

## Quick start

### Requirements

- Node.js 20.19 or newer (or 22.13 or newer), as required by Vite 8 and ESLint 10
- npm
- Running instance of the Event Booking Backend (Spring Boot)

Earlier documentation listed Node.js 18 or newer. The dependencies in `package.json` need the versions above.

### Workspace layout

```text
booking-app/
├── booking-app-backend/
└── booking-app-frontend/
```

Earlier documentation referred to the frontend folder as `booking-frontend`. Use the folder name on your machine.

### Clone the repository

```bash
git clone https://github.com/saravanansaranraj27/booking-app-frontend.git
cd booking-app-frontend
```

The Spring Boot API lives in its own repository, [booking-app-backend](https://github.com/saravanansaranraj27/booking-app-backend), which must be cloned and running before the frontend can load data.

### Configure and run the frontend

```sh
npm install
```

Ensure the backend is running at `http://localhost:8080`.

Start the development server:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Verify Node.js

```sh
node --version
```

### Verify the project

```sh
npm run lint
npm run build
```

## Using the app

### Workflow

1. Open the frontend to browse events on the home page. Search by title or description, filter by Workshop, Conference, or Concert, and sort by date, price low to high, or price high to low
2. Select **Clear Filters** if no events match your search
3. Select **Calendar View**, or **Calendar** in the navigation bar, to see events laid out by month
4. Select **Register** to create an account with a name, email, and a password of at least 6 characters, or select **Login** to sign in
5. Open an event to see its details and remaining slots, then book it. Booking requires an account, so signed-out visitors are sent to the login page
6. After booking, you land on **My Bookings**, where each booking shows its status, **CONFIRMED** or **CANCELLED**
7. Cancel a confirmed booking and confirm in the dialog
8. Sign in as the administrator and open **Admin** to manage listings and users
9. Use the theme toggle in the navigation bar to switch between light and dark mode. On smaller screens, open the navigation with the menu button
10. Select **Logout** to leave

### Admin dashboard

The Admin page has two parts.

| Part            | What you can do                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| Listings        | Create a listing, edit one, or delete one, with an event title, description, category, price, date, and total slots |
| User management | Create a user with a name, email, password, and role, change a user's role between USER and ADMIN, or delete a user |

### Browser storage

| Key     | Contents                                        |
| ------- | ----------------------------------------------- |
| `token` | The JWT returned by login or registration       |
| `user`  | The signed-in user: `role`, `name`, and `email` |
| `theme` | `light` or `dark`, with light as the default    |

## API integration

The frontend interacts with the following backend endpoints:

### Authentication

- `POST /auth/register`: Creates a new user account.
- `POST /auth/login`: Authenticates user and returns JWT token.

### Listings

- `GET /listings`: Retrieves all events (supports `?category` query param).
- `GET /listings/{id}`: Retrieves details for a specific event.
- `POST /listings`: Creates a new event listing (Admin/User).
- `PUT /listings/{id}`: Updates an existing listing.
- `DELETE /listings/{id}`: Deletes a listing.

### Bookings

- `POST /bookings`: Creates a booking for the authenticated user.
- `GET /bookings/my`: Retrieves bookings for the current user.
- `DELETE /bookings/{id}`: Cancels a specific booking.

### Admin

- `GET /admin/users`: Lists all users.
- `POST /admin/users`: Creates a new user.
- `PUT /admin/users/{id}/role`: Updates a user's role (USER/ADMIN).
- `DELETE /admin/users/{id}`: Deletes a user.

### Where each page calls the API

| Page                  | Calls                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `Listings`            | `GET /listings`, with `category` when a filter is chosen                                          |
| `ListingDetail`       | `GET /listings/{id}`, `POST /bookings`                                                            |
| `CalendarView`        | `GET /listings`                                                                                   |
| `MyBookings`          | `GET /bookings/my`, `DELETE /bookings/{id}`                                                       |
| `BookingConfirmation` | `GET /bookings/my`                                                                                |
| `Login`               | `POST /auth/login`                                                                                |
| `Register`            | `POST /auth/register`                                                                             |
| `AdminDashboard`      | `GET /listings`, `POST /listings`, `PUT /listings/{id}`, `DELETE /listings/{id}`                  |
| `AdminUsers`          | `GET /admin/users`, `POST /admin/users`, `PUT /admin/users/{id}/role`, `DELETE /admin/users/{id}` |

## Configuration

### API Base URL

The frontend communicates with the backend via Axios. The base URL is defined in `src/api/axios.js`:

```javascript
const api = axios.create({
  baseURL: "http://localhost:8080",
});
```

Ensure this matches your backend port.

### Authentication

The app uses JWT tokens stored in `localStorage`. The Axios interceptor automatically attaches the token to outgoing requests:

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

A response interceptor shows API errors as toast notifications. When the API returns `401` outside the login and register pages, it clears the saved session and redirects to `/login`.

### Environment variables

The frontend has no environment variables. The API address is fixed in `src/api/axios.js`.

### Backend CORS

The backend allows requests from `http://localhost:5173`, the default Vite development server URL. If you run the frontend on another origin, update the backend CORS settings as well.

## Project structure

```text
booking-app-frontend/
├── public/
│   ├── favicon.svg                         # Site favicon
│   └── icons.svg                           # Static SVG icons
├── src/
│   ├── api/
│   │   └── axios.js                        # Axios instance with JWT interceptor
│   ├── assets/
│   │   ├── hero.png                        # Image asset
│   │   ├── react.svg                       # Default Vite template asset
│   │   └── vite.svg                        # Default Vite template asset
│   ├── components/
│   │   ├── AdminUsers.jsx                  # User management table and forms
│   │   ├── Icons.jsx                       # SVG icon components
│   │   ├── ListingCard.jsx                 # Event preview card component
│   │   ├── Navbar.jsx                      # Navigation, theme toggle, back to top
│   │   └── ProtectedRoute.jsx              # Route guard based on auth state
│   ├── context/
│   │   └── AuthContext.jsx                 # Manages user session and JWT storage
│   ├── pages/
│   │   ├── AdminDashboard.jsx              # Combined listing and user management
│   │   ├── BookingConfirmation.jsx         # Post-booking success view
│   │   ├── CalendarView.jsx                # Monthly event calendar
│   │   ├── ListingDetail.jsx               # Single event details and booking action
│   │   ├── Listings.jsx                    # Main event browsing page
│   │   ├── Login.jsx                       # Login form
│   │   ├── MyBookings.jsx                  # User's booking history
│   │   ├── Register.jsx                    # Registration form
│   │   └── UserDashboard.jsx               # User stats and upcoming events
│   ├── App.jsx                             # Main routing configuration
│   ├── index.css                           # Global styles and CSS variables
│   └── main.jsx                            # Application entry point
├── .gitignore                              # Git exclusions for generated files
├── eslint.config.js                        # ESLint flat configuration
├── index.html                              # HTML shell
├── package.json                            # Dependencies and npm scripts
├── package-lock.json                       # Locked npm dependency versions
├── vite.config.js                          # Vite configuration
└── README.md                               # Project documentation
```

## Technology

- [React 19](https://react.dev/) - UI library
- [Vite](https://vite.dev/) - Build tool and dev server
- [React Router](https://reactrouter.com/) - Client-side routing, version 7 in `package.json`
- [Axios](https://axios-http.com/) - HTTP client for API requests
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) - Theming and styling
- [ESLint](https://eslint.org/) - Linting, with the React Hooks and React Refresh plugins
- [date-fns](https://date-fns.org/) and [React Day Picker](https://daypicker.dev/) - Listed in `package.json`, and not imported by the current source, because the calendar page builds its own month grid

## Development commands

From `booking-app-frontend`.

### Install dependencies

```sh
npm install
```

### Start the Vite development server

```sh
npm run dev
```

### Create a production build

```sh
npm run build
```

The build output goes to `dist/`, which `.gitignore` excludes.

### Run ESLint

```sh
npm run lint
```

### Preview the production build

```sh
npm run preview
```

## Testing

The frontend has no automated tests configured. Verify it with linting and a production build:

```sh
npm run lint
npm run build
```

## Troubleshooting

### Node.js version error or build failure

Vite 8 needs Node.js 20.19 or newer (or 22.12 or newer), and ESLint 10 needs 22.13 or newer on the 22 line. Check your version:

```sh
node --version
```

Install a supported version, then run `npm install` again.

### `Cannot find native binding` after copying the project

This happens when `node_modules` was installed on a different operating system. Delete it and reinstall:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### `Unable to complete the request.` or empty lists

The backend is not running, or `baseURL` in `src/api/axios.js` does not match its port. Start the backend first.

### CORS errors in the browser

The backend allows only `http://localhost:5173`. Keep the frontend on that port, or update the backend CORS settings.

### Port 5173 is already in use

Start the dev server on another port, and update the backend CORS settings to allow it:

```sh
npm run dev -- --port 5174
```

### You are sent back to the login page

The saved token is invalid or has expired. The frontend clears the session when the API returns `401`. Sign in again.

### The theme resets or the sign-in disappears

The theme, token, and user are saved in your browser's `localStorage` under `theme`, `token`, and `user`. They are removed when site data is cleared.

### The Admin link is missing

The link appears only for accounts with the `ADMIN` role. Sign in with the administrator account that the backend created at startup.

## Complete command reference

```sh
git clone https://github.com/saravanansaranraj27/booking-app-frontend.git
cd booking-app-frontend
npm install
npm run dev
npm run build
npm run lint
npm run preview
node --version
```

## Limitations

- Requires the backend server to be running for full functionality.
- Client-side validation only; relies on backend for security and data integrity.
- No offline support; requires active internet connection to fetch data.
- No automated end-to-end tests are currently included.
- The API base URL is fixed in `src/api/axios.js`, and the JWT is stored in `localStorage`.
- `UserDashboard.jsx` is not connected to a route.
- The booking flow sends you to My Bookings, so the `/booking-confirmation/:id` page is routed but is not reached by that flow.
- `date-fns` and `react-day-picker` are installed but not used.

## Contributing

Bug reports, improvements, and pull requests are welcome. Please ensure code follows React best practices and verify the build with `npm run build`.

```sh
npm run lint
npm run build
```

## License

This project is licensed under the MIT License.
