# Koi Breeding & Sanctuary

![img](/doc-images/game-overview.jpg)

## Overview

Koi Breeding & Sanctuary is a full-stack koi management game. Players can build ponds, raise and breed koi, manage inventory, trade on the marketplace, purchase supplies, maintain a koi dictionary, and receive real-time notifications. The same web client also provides an administration workspace for users, catalog items, koi varieties, breeding rates, transactions, and system settings.

## Purpose

This repository provides:

- A React web application for players and administrators
- A Spring Boot REST API with role-based access control
- A PostgreSQL data model managed by JPA and Flyway migrations
- Koi breeding, pond care, inventory, shop, marketplace, wallet, and payment workflows
- Cloudinary-backed image uploads for avatars, catalog items, and dictionary entries
- Server-Sent Events (SSE) for user notifications

## System Architecture

| Layer         | Location               | Default port | Purpose                                                              |
| ------------- | ---------------------- | -----------: | -------------------------------------------------------------------- |
| Web client    | `client/`              |         5173 | React player experience and admin dashboard                          |
| REST API      | `server/koi-breeding/` |         8090 | Authentication, game logic, administration, uploads, and persistence |
| Database      | PostgreSQL             |         5432 | Application data in the `koi_breeding` schema                        |
| Media storage | Cloudinary             |     External | Uploaded avatar, item, and dictionary images                         |

The frontend calls the API at `http://localhost:8090/koi_breeding/api/v1` by default. Set `VITE_API_BASE_URL` when the backend is hosted elsewhere.

## Main Features

### Player

- Registration, login, session refresh, logout, and password recovery
- Pond creation, upgrades, koi movement, feeding, and treatments
- Koi collection, profiles, varieties, mutations, and breeding events
- Shop purchases, inventory usage, wallet balance, and payments
- Marketplace listings, purchases, sales, and transaction history
- Koi dictionary and real-time notifications
- Profile management with avatar crop and preview

### Administrator

- Dashboard and user moderation
- Role and account management
- Shop item and image management
- Koi dictionary and image management
- Variety and breeding-rate management
- Trade and transaction monitoring
- Notification and application settings

## Project Structure

```text
KOI-project/
├── client/                              # React + TypeScript frontend
│   ├── public/                          # Public static assets
│   └── src/
│       ├── api/                         # Typed API clients
│       ├── assets/                      # Koi, item, icon, and avatar assets
│       ├── components/
│       │   ├── layout/                  # Application shell, header, navigation
│       │   ├── shared/                  # Reusable UI and shared catalog styles
│       │   └── <feature>/               # Feature-owned components and styles
│       ├── context/                     # Authentication state
│       ├── hooks/                       # Reusable React hooks
│       ├── pages/<feature>/             # Route screens and page-owned styles
│       ├── sound/                       # Sound preferences and controls
│       ├── style/global.css             # Reset and truly global defaults only
│       ├── theme/                       # Theme tokens, provider, and controls
│       ├── types/                       # Shared TypeScript contracts
│       └── utils/                       # Stateless helpers
├── server/koi-breeding/                 # Spring Boot backend
│   ├── src/main/java/com/koibreeding/
│   │   ├── config/                      # Web, security, and application config
│   │   ├── controller/                  # REST endpoints
│   │   ├── domain/                      # JPA entities and response models
│   │   ├── dto/                         # Request/response contracts
│   │   ├── repository/                  # Spring Data repositories
│   │   ├── security/                    # Authentication and authorization
│   │   └── service/                     # Business logic
│   └── src/main/resources/
│       ├── application.yaml             # Shared application configuration
│       ├── application-local.yaml       # Local secrets and integrations
│       └── db/migration/                # Flyway SQL migrations
└── README.md
```

Frontend ownership rule: route components stay in `pages`, reusable feature UI stays in `components/<feature>`, reusable cross-feature UI stays in `components/shared`, and every stylesheet stays beside the page or component that owns it. `global.css` must not contain feature-specific selectors.

## Technology Stack

### Frontend

| Technology      | Version | Purpose                                  |
| --------------- | ------: | ---------------------------------------- |
| React           |      19 | User interface                           |
| TypeScript      |       6 | Static typing                            |
| Vite            |       8 | Development server and production build  |
| React Router    |       7 | Client-side routing and protected routes |
| Axios           |       1 | REST API client                          |
| Recharts        |       3 | Dashboard charts                         |
| react-easy-crop |       6 | Image preview and cropping               |

### Backend

| Technology          |                Version | Purpose                          |
| ------------------- | ---------------------: | -------------------------------- |
| Java                |                    17+ | Backend runtime                  |
| Spring Boot         |                    4.1 | REST application framework       |
| Spring Security     | Managed by Spring Boot | Authentication and authorization |
| Spring Data JPA     | Managed by Spring Boot | Persistence layer                |
| PostgreSQL          |        14+ recommended | Primary database                 |
| Flyway              | Managed by Spring Boot | Database migrations              |
| JJWT                |                 0.12.6 | JWT creation and validation      |
| Cloudinary Java SDK |                  2.3.0 | Image storage                    |

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm 10+
- Java Development Kit 17+
- PostgreSQL 14+
- A Cloudinary account for image upload
- Maven is optional because the Maven Wrapper is included

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd KOI-project
```

### 2. Create the PostgreSQL database

```sql
CREATE DATABASE koi_breeding;
```

The application uses the `koi_breeding` schema. Hibernate creates or updates mapped tables in local development, while Flyway applies versioned migrations from `server/koi-breeding/src/main/resources/db/migration`.

### 3. Configure the backend

Update `server/koi-breeding/src/main/resources/application-local.yaml`. Do not commit real credentials to a public repository.

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/koi_breeding
    username: your_postgres_user
    password: your_postgres_password
  mail:
    host: smtp.gmail.com
    port: 587

cloudinary:
  cloud-name: your_cloud_name
  api-key: your_api_key
  api-secret: your_api_secret

jwt:
  signKey: replace_with_a_long_random_secret
  expiration: 3600000
  refresh: 604800000
```

If payment features are needed, also configure the existing `vietqr` and `sepay` sections. Keep the property names already defined in `application-local.yaml`.

### 4. Start the backend

```bash
cd server/koi-breeding
./mvnw spring-boot:run
```

Windows:

```powershell
cd server/koi-breeding
.\mvnw.cmd spring-boot:run
```

The API is available at `http://localhost:8090/koi_breeding/api/v1`.

### 5. Start the frontend

```bash
cd client
npm install
npm run dev
```

To override the API location, create `client/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8090/koi_breeding/api/v1
```

Open `http://localhost:5173`.

## Common Tasks

### Frontend

```bash
cd client
npm run dev       # Start the Vite development server
npm run build     # Type-check and build production assets
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

### Backend

```bash
cd server/koi-breeding
./mvnw spring-boot:run
./mvnw test
./mvnw clean package
```

### Database migrations

Add migration files using Flyway's versioned naming convention:

```text
server/koi-breeding/src/main/resources/db/migration/
└── V2__short_description.sql
```

Never edit a migration that has already been applied outside your local environment. Add a new versioned migration instead.

## API Areas

All routes are under `/koi_breeding/api/v1`.

| Area                | Representative path                                    | Access              |
| ------------------- | ------------------------------------------------------ | ------------------- |
| Authentication      | `/auth/*`                                              | Public/session      |
| Users and profiles  | `/users/*`                                             | Authenticated       |
| Ponds and koi       | `/ponds/*`, `/kois/*`                                  | Player              |
| Breeding            | `/breeding-events`, `/breeding-rates`                  | Player/Admin        |
| Shop and inventory  | `/shop/items`, `/inventory/*`                          | Player              |
| Marketplace         | `/marketplace/*`                                       | Player              |
| Wallet and payments | `/wallet/*`, `/payments/*`                             | Player/webhook      |
| Notifications       | `/users/{id}/notifications`                            | Authenticated       |
| Uploads             | `/upload/avatar`, `/upload/item`, `/upload/dictionary` | Authenticated/Admin |
| Administration      | `/admin/*`                                             | Admin/Super Admin   |

## Development Workflow

1. Create or update backend DTOs and services before changing the API contract.
2. Add a new Flyway migration for every persistent schema change.
3. Update the matching client module in `client/src/api`.
4. Keep route UI in `pages` and reusable UI in `components`.
5. Keep feature CSS beside its owner; reserve `style/global.css` for resets only.
6. Run frontend type-check/build and backend tests before committing.

## Security Considerations

- Never commit database passwords, JWT signing keys, mail passwords, Cloudinary secrets, or payment API keys.
- Use long, random JWT signing keys and rotate leaked credentials immediately.
- The client uses credentialed requests and HttpOnly-cookie sessions; configure allowed origins carefully in non-local environments.
- Validate uploaded file type and size on the server; client-side checks are only a usability aid.
- Disable or replace seeded administrator credentials before deployment.
- Back up PostgreSQL before applying migrations in production.

## Troubleshooting

### Vite reports `node:util` does not export `styleText`

The installed Vite version does not support Node.js 18. Upgrade to Node.js 20.19+ (or 22.12+) and reinstall dependencies:

```bash
cd client
rm -rf node_modules
npm install
```

### Frontend cannot reach the API

- Confirm the backend is listening on port `8090`.
- Confirm the context path is `/koi_breeding`.
- Check `VITE_API_BASE_URL` and restart Vite after changing it.
- Verify the backend CORS configuration allows the frontend origin.

### Image upload fails

- Check all three Cloudinary properties in `application-local.yaml`.
- Use a supported image MIME type and keep the file within the backend size limit.
- Confirm the logged-in account has permission for the selected upload endpoint.

### Database connection fails

- Confirm PostgreSQL is running and the database exists.
- Verify the datasource URL, username, and password.
- Check that the database user can create and update objects in the `koi_breeding` schema.

## Contributing

1. Keep changes focused and use descriptive commit messages.
2. Do not mix unrelated formatting with a feature or bug fix.
3. Document API or configuration changes in this README.
4. Include migrations for database schema changes.
5. Verify both frontend and backend before opening a pull request.

## License

No license file is currently included. Add a license before distributing or accepting external contributions.

---

**Frontend:** [`client/`](client/)

**Backend:** [`server/koi-breeding/`](server/koi-breeding/)

**API base path:** `/koi_breeding/api/v1`
