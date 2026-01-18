# Portfolio Personal

Portfolio web interactivo desarrollado con React y Node.js.

## Estructura del Proyecto

Este proyecto consta de dos partes:

- **Frontend** (`/frontend`): Aplicación React para el portfolio
- **Backend** (`/backend`): API REST con Node.js y Express

## Instalación y Uso

### Frontend

1. Navega a la carpeta frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

   La aplicación estará disponible en `http://localhost:3000`.

### Backend

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

4. Inicia el servidor:
   ```bash
   npm run dev
   ```

   La API estará disponible en `http://localhost:5000`.

## Tecnologías Utilizadas

### Frontend
- React 18
- React Router
- CSS Modules / Styled Components
- Three.js (para animaciones 3D)

### Backend
- Node.js
- Express.js
- CORS
- dotenv

## Scripts Disponibles

### Frontend
- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta los tests

### Backend
- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor con nodemon para desarrollo

## Endpoints de la API

- `GET /` - Información de la API
- `GET /api/projects` - Lista de proyectos
- `POST /api/contact` - Enviar mensaje de contacto

## Despliegue

### Frontend
```bash
npm run build
```
Los archivos de producción estarán en la carpeta `build`.

### Backend
Configura las variables de entorno en producción y ejecuta:
```bash
npm start
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.(https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
