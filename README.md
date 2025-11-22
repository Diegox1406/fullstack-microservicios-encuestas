# Sistema de Encuestas con Microservicios

Sistema completo de gestión de encuestas construido con microservicios Flask (backend) y Angular 21 (frontend), orquestado con Docker Compose.

## 🏗️ Arquitectura

### Backend (Flask + Python)
- **Gateway Service** (Puerto 8000): API Gateway con autenticación JWT
- **Surveys Service** (Puerto 5001): CRUD de encuestas y preguntas
- **Responses Service** (Puerto 5002): Gestión de respuestas de usuarios
- **Reports Service** (Puerto 5003): Generación de reportes y estadísticas

### Frontend (Angular 21)
- **Puerto 4200**: Aplicación web SPA con Nginx

### Base de Datos
- SQLite 

## 🚀 Características

### Funcionalidades
- ✅ Autenticación JWT con registro de usuarios
- ✅ CRUD completo de encuestas
- ✅ Tipos de preguntas: texto libre, opción múltiple, escala numérica (1-10)
- ✅ Sistema de respuestas con validación
- ✅ Reportes estadísticos en tiempo real
- ✅ Exportación a Excel
- ✅ Interfaz responsive en español

### Tecnologías
- **Backend**: Flask, SQLAlchemy, Marshmallow, Flask-JWT-Extended, Flask-CORS
- **Frontend**: Angular 21, TypeScript, RxJS
- **Contenedores**: Docker, Docker Compose
- **Servidor Web**: Nginx (para frontend)

## 📋 Requisitos Previos

- Docker Desktop instalado
- Docker Compose
- Puertos disponibles: 4200, 8000, 5001, 5002, 5003

## 🔧 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd microservices-flask-angular
```

### 2. Levantar todos los servicios
```bash
docker-compose up --build
```

### 3. Acceder a la aplicación
Abre tu navegador en: **http://localhost:4200**

## 👤 Credenciales por Defecto

- **Usuario**: `admin`
- **Contraseña**: `password123`

## 📁 Estructura del Proyecto

