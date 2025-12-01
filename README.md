# BOOSTWEB

## Integrantes
- **Brayan Stiven Rojas Fernández** - 202310325
- **Wudeison Tovar Cruz** - 201610485
- **Carlos Mario Ospino Anaya** - 201720364

---

## Descripción
BOOSTWEB es una plataforma web para la gestión de reservas y perfiles de clientes y profesionales.

---

## Acceso a la Base de Datos
La aplicación utiliza MySQL. Configuración actual:

- **Host:** localhost
- **Usuario:** root
- **Contraseña:** tarrao
- **Base de datos:** boost
- **Puerto:** 3306 (por defecto)

Puedes modificar estos datos en `backend/database.js` si tu entorno es diferente.

---

## Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/wudeison/BOOSTWEB.git
cd BOOSTWEB
```

### 2. Backend
```bash
cd backend
npm install
node server.js
```
El backend estará disponible en [http://localhost:4000](http://localhost:4000)

### 3. Frontend
```bash
cd front
npm install
npm start
```
El frontend estará disponible en [http://localhost:3000](http://localhost:3000)

---

## Requisitos
- Node.js >= 14
- MySQL Server

---

## Notas
- Asegúrate de tener la base de datos `boost` creada en MySQL antes de iniciar el backend.
- Los diagramas del proyecto se encuentran en la carpeta `docs/diagrams` en formato PNG.

---

## Contacto
Para soporte o dudas, contactar a cualquiera de los integrantes.
