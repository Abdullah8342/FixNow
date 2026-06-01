# FixNow - Professional Service Booking Platform

A comprehensive Django-based backend API for a professional service booking platform that connects service providers with customers seeking home services.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database](#database)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

FixNow is a modern service booking platform built with Django and Django REST Framework. It provides robust backend APIs for managing user accounts, service listings, bookings, reviews, and helper services. The platform supports real-time notifications using Celery and Redis.

## ✨ Features

- **User Management**: Comprehensive account management with JWT authentication
- **Service Management**: Create, update, and manage professional services
- **Booking System**: Complete booking lifecycle management
- **Reviews & Ratings**: Customer feedback and rating system
- **Helper Services**: Additional support services for providers
- **Hiring System**: Professional hiring capabilities
- **Real-time Notifications**: Async task processing with Celery
- **Media Management**: Profile pictures and service images
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Admin Dashboard**: Django admin interface for management

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend Framework** | Django 6.0.3 |
| **REST API** | Django REST Framework 3.16.1 |
| **Authentication** | JWT (djangorestframework-simplejwt 5.5.1) |
| **Task Queue** | Celery 5.6.2 |
| **Message Broker** | Redis 7.3.0 |
| **Database** | SQLite (Development) |
| **Image Processing** | Pillow 12.1.0 |
| **Caching** | django-redis 6.0.0 |
| **Debugging** | django-debug-toolbar 6.2.0 |
| **CORS** | django-cors-headers |

## 📦 Prerequisites

Before setting up the project, ensure you have:

- Python 3.8 or higher
- pip (Python package manager)
- virtualenv or venv
- Git

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Abdullah8342/FixNow.git
cd FixNow
```

### Step 2: Create Virtual Environment

```bash
python3 -m venv venv
```

### Step 3: Activate Virtual Environment

**On Linux/macOS:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Apply Migrations

```bash
python manage.py migrate
```

### Step 6: Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root (if needed for production):

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
REDIS_URL=redis://localhost:6379/0
```

### Database Setup

The project uses SQLite by default. For development:

```bash
python manage.py migrate
```

### Static Files

```bash
python manage.py collectstatic
```

## ▶️ Running the Application

### Development Server

```bash
# With virtual environment activated
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

### Running Celery (for async tasks)

In a separate terminal with activated venv:

```bash
celery -A FixNow worker -l info
```

### Running Celery Beat (for scheduled tasks)

In another separate terminal:

```bash
celery -A FixNow beat -l info
```

## 📚 API Documentation

The API endpoints are organized by module:

### Core Modules

- **Accounts** (`/api/accounts/`) - User authentication and management
- **Service** (`/api/service/`) - Service listings and management
- **Booking** (`/api/booking/`) - Booking management
- **Profile** (`/api/profile/`) - User profiles
- **Reviews** (`/api/reviews/`) - Review and rating system
- **HelperServices** (`/api/helper-services/`) - Additional services
- **Hire** (`/api/hire/`) - Hiring management

### Admin Interface

Access the Django admin panel at:
```
http://localhost:8000/admin/
```

Login with the superuser credentials created during setup.

## 📁 Project Structure

```
FixNow/
├── Account/                    # User account management
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── ...
├── Service/                    # Service listings
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── ...
├── Booking/                    # Booking management
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── ...
├── Profile/                    # User profiles
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── ...
├── Reviews/                    # Review system
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── ...
├── HelperServices/             # Helper services
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── ...
├── Hire/                       # Hiring system
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── ...
├── FixNow/                     # Main project settings
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   ├── asgi.py
│   ├── celery.py
│   └── __init__.py
├── manage.py                   # Django management script
├── requirements.txt            # Python dependencies
├── db.sqlite3                  # Development database
└── README.md                   # This file
```

## 💾 Database

The project uses SQLite for development. Database file: `db.sqlite3`

### Making Migrations

When you modify models:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Resetting Database (Development Only)

```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

## 🔐 Authentication

The project uses JWT (JSON Web Tokens) for API authentication:

### Login Endpoint

```
POST /api/accounts/login/
```

### Getting Access Token

```bash
curl -X POST http://localhost:8000/api/accounts/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'
```

### Using Token in Requests

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:8000/api/service/
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: [project maintainer contact info]

## 🔄 Version History

- **v1.0.0** - Initial release with core features

---

**Last Updated**: June 2026  
**Status**: Active Development