# Instagram Clone

A full-stack web application inspired by Instagram, built with **React**, **Spring Boot** and **PostgreSQL**.  
The application allows authenticated users to create posts, upload images, add comments, use tags and interact with content through likes and dislikes.

The project also includes a separate **admin microservice**, used for moderation and administrative actions.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Main Features](#main-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Main API Routes](#main-api-routes)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing and Build](#testing-and-build)
- [CI/CD](#cicd)
- [Authors](#authors)

---

## About the Project

Instagram Clone is a simple social media platform developed as a Software Design project.  
The system is based on a client-server architecture:

- the **frontend** is responsible for the user interface;
- the **main backend** handles authentication, posts, comments, votes, tags, users and image uploads;
- the **admin microservice** handles administrative operations such as user management and content moderation;
- the **database** stores users, posts, comments, pictures, tags, votes and admin logs;
- **Cloudinary** is used for image storage.

Protected actions require authentication, and the application uses JWT tokens after login.

---

## Main Features

### User Features

- User registration and login
- JWT-based authentication
- Create, edit and delete posts
- Upload images for posts and profiles
- Add tags to posts
- Display posts in a feed
- Search and filter posts
- Add, edit and delete comments
- Like and dislike posts
- Like and dislike comments
- Display vote score for posts and comments
- View user profiles and user posts
- Notifications page

### Admin Features

- Separate admin microservice
- Admin panel
- Manage users
- Ban and unban users
- Moderate posts and comments
- Edit or delete inappropriate content
- Admin action logging

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- ESLint
- Vitest

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- JWT
- Maven
- JUnit
- Mockito

### Database and External Services

- PostgreSQL
- Cloudinary

### Development Tools

- Git
- GitHub
- Postman
- GitHub Actions

---

## Architecture

The backend follows a layered architecture:

```text
Controller Layer  -> handles HTTP requests
Service Layer     -> contains the business logic
Repository Layer  -> communicates with the database
Model Layer       -> defines the main entities
Config Layer      -> contains security and application configuration
```

The application is split into three main parts:

```text
React Frontend
      |
      | REST API / JWT
      v
Main Spring Boot Backend  -----> PostgreSQL Database
      |
      | Image upload
      v
Cloudinary

Admin Spring Boot Microservice
      |
      | Internal API
      v
Main Backend
```

Default ports:

| Component | Port |
|---|---:|
| Main backend | 9090 |
| Admin microservice | 9091 |
| Frontend | 5173 |

---

## Project Structure

```text
Instagram-Clone/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
│
├── backend-admin/
│   ├── src/
│   ├── pom.xml
│   ├── compose.yaml
│   └── mvnw / mvnw.cmd
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .github/
│   └── workflows/
│
├── .gitignore
└── README.md
```

---

## Main API Routes

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive a JWT token |

### Posts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/posts` | Get posts / feed |
| GET | `/posts/{id}` | Get a post by id |
| POST | `/posts` | Create a new post |
| PUT | `/posts/{id}` | Update a post |
| DELETE | `/posts/{id}` | Delete a post |
| PATCH / POST | `/posts/{id}/close-comments` | Close comments for a post |

### Comments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/comments` | Get comments |
| GET | `/comments/{id}` | Get a comment by id |
| GET | `/comments/post/{postId}` | Get comments for a post |
| POST | `/comments` | Create a comment |
| PUT | `/comments/{id}` | Update a comment |
| DELETE | `/comments/{id}` | Delete a comment |

### Tags, Pictures and Votes

| Method | Endpoint | Description |
|---|---|---|
| GET / POST / PUT / DELETE | `/tags` | Manage tags |
| GET / POST / PUT / DELETE | `/pictures` | Manage pictures |
| POST | `/post-votes/toggle` | Like or dislike a post |
| POST | `/comment-votes/toggle` | Like or dislike a comment |

### Uploads

| Method | Endpoint | Description |
|---|---|---|
| POST | `/uploads/image` | Upload an image to Cloudinary |

### Internal Admin API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/internal/admin/users` | Get all users |
| PUT | `/internal/admin/users/{userId}/ban` | Ban a user |
| PUT | `/internal/admin/users/{userId}/unban` | Unban a user |
| DELETE | `/internal/admin/posts/{postId}` | Delete a post as admin |
| DELETE | `/internal/admin/comments/{commentId}` | Delete a comment as admin |
| PUT | `/internal/admin/posts/{postId}` | Edit a post as admin |
| PUT | `/internal/admin/comments/{commentId}` | Edit a comment as admin |

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Java 21
- Maven or Maven Wrapper
- Node.js 22
- npm
- PostgreSQL
- A Cloudinary account

Clone the repository:

```bash
git clone https://github.com/palroland21/Instagram-Clone.git
cd Instagram-Clone
```

---

## Environment Variables

The main backend uses PostgreSQL and Cloudinary.  
Before running it, configure the following variables.

### Linux / macOS

```bash
export DB_URL=jdbc:postgresql://localhost:5432/instagram_clone
export DB_USERNAME=postgres
export DB_PASSWORD=postgres

export CLOUDINARY_CLOUD_NAME=your_cloud_name
export CLOUDINARY_API_KEY=your_api_key
export CLOUDINARY_API_SECRET=your_api_secret
```

### Windows PowerShell

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/instagram_clone"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="postgres"

$env:CLOUDINARY_CLOUD_NAME="your_cloud_name"
$env:CLOUDINARY_API_KEY="your_api_key"
$env:CLOUDINARY_API_SECRET="your_api_secret"
```

Do not commit real passwords, API keys or secrets to GitHub.

---

## Running the Application

### 1. Start PostgreSQL

Create a database named:

```text
instagram_clone
```

Example using Docker:

```bash
docker run --name instagram-postgres \
  -e POSTGRES_DB=instagram_clone \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:latest
```

---

### 2. Run the Main Backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```powershell
cd backend
mvnw.cmd spring-boot:run
```

The main backend runs on:

```text
http://localhost:9090
```

---

### 3. Run the Admin Microservice

Open a new terminal:

```bash
cd backend-admin
./mvnw spring-boot:run
```

On Windows:

```powershell
cd backend-admin
mvnw.cmd spring-boot:run
```

The admin microservice runs on:

```text
http://localhost:9091
```

---

### 4. Run the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

---

## Testing and Build

### Backend

```bash
cd backend
./mvnw test
./mvnw clean package
```

### Admin Microservice

```bash
cd backend-admin
./mvnw test
./mvnw clean package
```

### Frontend

```bash
cd frontend
npm run lint
npm run test
npm run build
```

---

## CI/CD

The repository includes a GitHub Actions workflow that:

1. builds the main backend with Maven;
2. installs frontend dependencies;
3. runs frontend lint;
4. builds the frontend;
5. simulates a deployment step.

---

## Authors

Project developed by:

- Pal Roland
- Breban Vasile
- Andrei Mandroc

---

## Educational Purpose

This project was developed for educational purposes as part of a Software Design assignment.
