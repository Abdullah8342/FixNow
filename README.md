# FixNow - Professional Service Booking Platform

A comprehensive full-stack service booking platform with React/Vite frontend and Django REST API backend. Connects service providers with customers seeking professional home services.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

FixNow is a modern, full-stack service booking platform designed to connect professional service providers with customers. It features a React/Vite-based responsive frontend and a robust Django REST API backend with Celery for async operations.

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

### Frontend
| Component | Technology |
|-----------|-----------|
| **Framework** | React 18+ |
| **Build Tool** | Vite 8.0+ |
| **Styling** | CSS Modules & TailwindCSS |
| **HTTP Client** | Axios |
| **State Management** | React Context API |

### Backend
| Component | Technology |
|-----------|-----------|
| **Framework** | Django 6.0.3 |
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

### Step 2: Setup Backend

```bash
cd server

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### Step 3: Setup Frontend

```bash
# From root directory, go to client
cd client

# Install dependencies
npm install

# Build the project (optional)
npm run build
```

### Step 4: Install Prerequisites

Ensure you have:
- Python 3.8 or higher
- Node.js 16.x or higher
- npm or yarn
- Git
- Redis (for Celery, optional for development)

## ▶️ Running the Application

### Backend Setup

Open terminal 1 and run:

```bash
cd server
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

Backend API will be available at: **http://localhost:8000/**

### Frontend Setup

Open terminal 2 and run:

```bash
cd client
npm run dev
```

Frontend will be available at: **http://localhost:5173/**

### Optional: Celery Worker

For async tasks, open terminal 3:

```bash
cd server
source venv/bin/activate
celery -A FixNow worker -l info
```

### Optional: Celery Beat

For scheduled tasks, open terminal 4:

```bash
cd server
source venv/bin/activate
celery -A FixNow beat -l info
```

## 🔧 Backend Setup

### Django Migrations

```bash
cd server
source venv/bin/activate
python manage.py makemigrations
python manage.py migrate
```

### Create Admin User

```bash
cd server
source venv/bin/activate
python manage.py createsuperuser
```

Access admin panel at: **http://localhost:8000/admin/**

### Static Files

```bash
python manage.py collectstatic
```

## 🎨 Frontend Setup

### Build for Production

```bash
cd client
npm run build
```

Output will be in the `dist/` folder.

### Development Server

```bash
cd client
npm run dev
```

### Code Quality

```bash
cd client
npm run lint
```

## 📚 API Documentation

The backend API endpoints are organized by module:

### Core Endpoints

- **Accounts** (`/api/accounts/`) - User authentication and management
- **Service** (`/api/service/`) - Service listings and management
- **Booking** (`/api/booking/`) - Booking management
- **Profile** (`/api/profile/`) - User profiles
- **Review** (`/api/review/`) - Review and rating system
- **Helper** (`/api/helper/`) - Helper services

### Admin Panel

Access Django admin at: **http://localhost:8000/admin/**

### API Base URL

- Development: `http://localhost:8000/api/`

## 📁 Project Structure

```
FixNow/
├── client/                          # React/Vite Frontend
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   ├── context/                 # Context API providers
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API service calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                      # Static assets
│   ├── dist/                        # Production build
│   ├── node_modules/                # Frontend dependencies
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── server/                          # Django Backend
│   ├── Accounts/                    # User management app
│   ├── Service/                     # Service listings app
│   ├── Booking/                     # Booking management app
│   ├── Profile/                     # User profiles app
│   ├── Review/                      # Reviews & ratings app
│   ├── Helper/                      # Helper services app
│   ├── FixNow/                      # Django settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   ├── asgi.py
│   │   └── celery.py
│   ├── venv/                        # Backend virtual environment
│   ├── manage.py
│   ├── db.sqlite3
│   ├── requirements.txt
│   └── README.md
│
├── .git/                            # Git repository
├── .gitignore
├── LICENSE
└── README.md                        # This file
```

## 💾 Database

SQLite is used by default for development. Database file: `server/db.sqlite3`

### Making Migrations

```bash
cd server
source venv/bin/activate
python manage.py makemigrations
python manage.py migrate
```

### Resetting Database (Development Only)

```bash
cd server
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

## 🔐 Authentication

JWT (JSON Web Tokens) are used for API authentication.

### Getting Access Token

```bash
curl -X POST http://localhost:8000/api/accounts/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "password"}'
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
- Create an issue on GitHub: https://github.com/Abdullah8342/FixNow/issues
- Contact project maintainer

## 🔄 Version History

- **v1.0.0** - Initial release with full-stack implementation
  - Backend: Django REST API with Celery/Redis
  - Frontend: React/Vite responsive SPA
  - Features: User authentication, services, bookings, reviews, ratings
  - Both client and server fully functional and tested

---

**Last Updated**: June 2026  
**Status**: Active Development & Fully Functional  
**Deployment Status**: Ready for Testing