# Choppi Frontend

Choppi es una plataforma para administrar tiendas, productos e inventario de manera sencilla y eficiente.

## Características principales
- Listado y gestión de tiendas
- Inventario por tienda
- Búsqueda y paginado (20 en 20)
- Cotización de carrito (POST /cart/quote)
- Panel de administración protegido
- Login y cierre de sesión
- UI moderna con Tailwind

## Instalación y uso local

1. **Clona el repositorio:**
	```bash
	git clone https://github.com/Dunel/choppifront.git
	cd choppifront
	```
2. **Instala dependencias:**
	```bash
	npm install
	```
3. **Configura variables de entorno:**
	- Crea un archivo `.env.local` basado en `.env.example` (si existe).
	- Asegúrate de tener la URL del backend en `NEXT_PUBLIC_API_URL`.
4. **Ejecuta en desarrollo:**
	```bash
	npm run dev
	```
5. **Compila para producción:**
	```bash
	npm run build
	npm start
	```

## Seeds y datos de prueba
- El backend debe proveer endpoints para poblar datos de ejemplo (tiendas, productos, usuarios).
- Consulta la documentación del backend para ejecutar los seeds (normalmente: `npm run seed` o similar en el backend).

## Deploy
- El frontend puede desplegarse fácilmente en Vercel, Netlify o cualquier servicio compatible con Next.js.
- Solo necesitas configurar la variable `NEXT_PUBLIC_API_URL` apuntando al backend accesible públicamente.
- Ejemplo de deploy en Vercel:
  1. Sube el repo a GitHub.
  2. Conecta el repo en [vercel.com](https://vercel.com/).
  3. Configura la variable de entorno y despliega.
