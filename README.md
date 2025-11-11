# CRM Backend

A NestJS-based Customer Relationship Management (CRM) backend application with PostgreSQL database.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **pnpm** (v9 or higher) - Package manager
- **PostgreSQL** (v16 or higher) - For local development
- **Docker** and **Docker Compose** - For containerized deployment (optional)

## Setup Instructions

### Local Development Setup

1. **Clone the repository** (if applicable)

   ```bash
   git clone <repository-url>
   cd crm-backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=crm_user
   DB_PASSWORD=crm_password
   DB_NAME=crm_db

   # Application Configuration
   NODE_ENV=development
   APP_PORT=3000
   ```

4. **Set up PostgreSQL database**

   Create a PostgreSQL database

5. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

### Docker Setup

1. **Create environment file** (optional)

   Create a `.env` file or use the default values in `docker-compose.yml`:

   ```env
   DB_USER=crm_user
   DB_PASSWORD=crm_password
   DB_NAME=crm_db
   DB_PORT=5432
   APP_PORT=3000
   ```

2. **Build and start containers**

   ```bash
   docker-compose up --build -d
   ```

   This will:
   - Build the application Docker image
   - Start PostgreSQL database
   - Start the application
   - Automatically run database migrations

3. **View logs**

   ```bash
   docker-compose logs -f app
   ```

4. **Stop containers**

   ```bash
   docker-compose down
   ```

   To remove volumes (⚠️ deletes database data):

   ```bash
   docker-compose down -v
   ```

## Running the Application

### Development Mode

Run the application in development mode with hot-reload:

```bash
pnpm start:dev
```

The application will be available at `http://localhost:3000`

### Production Mode

1. **Build the application**

   ```bash
   pnpm build
   ```

2. **Start the application**
   ```bash
   pnpm start:prod
   ```

## Running Tests

### Unit Tests

Run all unit tests:

```bash
pnpm test
```

## Database Migrations

### Generate Migrations

After modifying your database schema, generate migration files:

```bash
pnpm db:generate
```

This will create migration files in the `drizzle/` directory.

### Apply Migrations

Run pending migrations to update your database:

```bash
pnpm db:migrate
```

### Push Schema Changes

Alternatively, you can push schema changes directly to the database (useful for development):

```bash
pnpm db:push
```

**Note:** In production, always use `db:migrate` instead of `db:push` for better control and rollback capabilities.

## API Documentation

Once the application is running, access the Swagger API documentation at:

```
http://localhost:3000/api-docs
```
