# EDAssets - Video Editing Community Platform

EDAssets is a full-stack web application designed for video editors to share, discover, and download high-quality editing assets like transitions, overlays, and effects. It features a community-driven model where users can register, upload their own creations, and download others' work.

## 🚀 Features

### Frontend (User Interface)
- **Home Page**: Modern landing page with feature highlights and call-to-action.
- **Asset Browsing**: Filterable grid of assets (Transitions, Overlays, Effects).
- **User Authentication**: Secure Login and Registration pages.
- **Dashboard**: Personal dashboard to track uploaded assets and download history.
- **Upload System**: Restricted area for logged-in users to share new files.
- **Responsive Design**: Built with a "Mobile-First" approach using CSS Variables and Flexbox/Grid.

### Backend (API & Logic)
- **RESTful API**: Built with Django REST Framework.
- **Authentication**: Token-based auth system.
- **Clean Architecture**: Separation of concerns with Services, Serializers, and Views.
- **Database**: SQLite database with relational models (Users, Assets, History).
- **Admin Panel**: Powerful built-in interface for site management.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3 (Custom Design System), JavaScript (ES6+), Fetch API.
- **Backend**: Python 3, Django 6.0, Django REST Framework.
- **Database**: SQLite.

## 🏁 Getting Started

### Prerequisites
- Python 3.10+ installed.
- PowerShell or Terminal.

### Installation & Run Instructions

**1. Backend Setup**
```powershell
cd backend
# Create Virtual Environment (if not exists)
python -m venv venv
# Install Dependencies
.\venv\Scripts\pip install django djangorestframework django-cors-headers pillow
# Run Migrations
.\venv\Scripts\python manage.py migrate
# Start Server
.\venv\Scripts\python manage.py runserver
```
*Backend runs at: `http://127.0.0.1:8000`*

**2. Frontend Setup**
Open a new terminal window:
```powershell
cd frontend
# Start local server
py -m http.server 8080
```
*Frontend runs at: `http://localhost:8080`*

## 🔐 Admin Panel Guide
EDAssets includes a powerful administrative dashboard provided by Django.

**Accessing the Admin Panel:**
1. Ensure the Backend server is running.
2. Navigate to: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

**Login Credentials:**
*(You must create a superuser first if you haven't already)*
```powershell
.\venv\Scripts\python manage.py createsuperuser
```
- **Username**: `admin` (or what you chose)
- **Password**: *(The password you set)*

**Admin Capabilities:**
- **Users**: View, add, or ban users.
- **Assets**: Moderate uploaded content, delete inappropriate files, or fix categories.
- **Download History**: View a log of who downloaded what and when.
- **Groups**: Manage user permissions.

## 📂 Project Structure
```
EDAssets/
├── backend/                # Django Project
│   ├── api/                # Main App (Models, Views, Services)
│   ├── edassets/           # Project Settings
│   ├── media/              # User uploaded files (images/videos)
│   ├── manage.py           # Entry point
│   └── db.sqlite3          # Database file
├── frontend/               # Frontend Project
│   ├── css/                # Styles
│   ├── js/                 # Logic & API Connectors
│   └── index.html          # Main Entry File
├── project_meta.json       # Project Metadata
└── README.md               # This file
```

---
© 2026 EDAssets. Built for editors, by editors.
