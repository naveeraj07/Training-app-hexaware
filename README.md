# Training App Backend Setup 

## Overview

This backend project consists of:

### Authentication Module

* User Registration
* User Login
* JWT Authentication
* Password Reset
* Login History
* Activation Token

### Course Module

* Courses
* Course Days
* Learning Units
* Contents
* Videos
* Progress Tracking
* Enrollment

Both Authentication APIs and Course APIs are integrated into the same FastAPI backend.

---

# Clone Repository

```bash
git clone -b feature/backend-courses https://github.com/naveeraj07/Training-app-hexaware.git
```

```bash
cd Training-app-hexaware/backend
```

---

# Create Virtual Environment

## Windows

```bash
python -m venv venv
```

Activate:

```bash
venv\Scripts\activate
```



# Install Dependencies

```bash
pip install -r requirements.txt
```

If requirements.txt is not available:

```bash
pip install fastapi uvicorn sqlalchemy asyncpg alembic pydantic python-jose passlib[bcrypt] python-dotenv email-validator
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Use your own PostgreSQL database URL.

---

# Database Migration

## Create Migration

```bash
alembic revision --autogenerate -m "initial migration"
```

## Apply Migration

```bash
alembic upgrade head
```

---

# Verify Tables

After migration, the following tables should exist:

### Authentication Tables

* users
* activation_tokens
* password_reset_tokens
* login_history

### Course Tables

* courses
* course_days
* learning_units
* contents
* videos
* progress
* enrollments

---

# Run FastAPI Server

```bash
python -m uvicorn app.main:app --reload
```

Server:

```text
http://127.0.0.1:8000
```

---



# Available Modules

## Authentication APIs

* Register User
* Login User
* Activate Account
* Forgot Password
* Reset Password
* User History

## Course APIs

* Get Courses
* Get Course Details
* Get Course Days
* Get Learning Units
* Get Course Content
* Get Videos
* Get Notes
* Get Q&A
* Enrollment
* Progress Tracking

---



`.env` is intentionally not ignored so that team members can configure and use their own database connection if required.

---

# Start Development

```bash
git pull
```

```bash
venv\Scripts\activate
```

```bash
alembic upgrade head
```

```bash
python -m uvicorn app.main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

to test all integrated Authentication and Course APIs.
 
