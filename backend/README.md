# Sif app Backend

This is the backend for the personal finance application Sif, built with Java Spring Boot and PostgreSQL.

## Features

- RESTful API for managing finances
- Single user context (no authentication required)
- PostgreSQL database
- Docker support

## Getting Started

### Prerequisites

- Java 21
- Maven
- Docker and Docker Compose

### Running with Docker

Run the using Docker Compose:

\`\`\`bash
docker-compose up -d
\`\`\`

This will start both the PostgreSQL database and the Spring Boot application.

### API Endpoints

The API provides endpoints for managing:

- Incomes
- Categories and Subcategories
- Transactions
- Monthly Summaries
- Debts
- Dashboard data
- Data export

All endpoints are available under the `/api` base path.

## Development

### Building the Application

\`\`\`bash
mvn clean package
\`\`\`

### Running Locally

To run the application locally, you'll need a PostgreSQL database. You can start one using Docker:

\`\`\`bash
docker run -d --name postgres -e POSTGRES_DB=finance -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:14-alpine
\`\`\`

Then run the application:

\`\`\`bash
java -jar target/finance-app-0.0.1-SNAPSHOT.jar
\`\`\`

## Database

The application uses PostgreSQL. The database schema is automatically created and updated using Hibernate.
