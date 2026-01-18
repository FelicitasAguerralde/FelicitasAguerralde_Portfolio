# Portfolio Backend

Backend API para el proyecto de portfolio personal.

## Instalación

1. Navega a la carpeta backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Configura las variables en `.env` según sea necesario.

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor se ejecutará en `http://localhost:5000` por defecto.

## Endpoints

- `GET /` - Información de la API
- `GET /api/projects` - Lista de proyectos
- `POST /api/contact` - Enviar mensaje de contacto

## Tecnologías

- Node.js
- Express.js
- CORS
- dotenv