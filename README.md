

## Para ejecutar el programa 

1. Hacer git clone del repo con el enlace dado.
2. Ejecutar los siguientes comandos, para instalar dependencias y ejecutar el programa

```bash
npm install 
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


---

### Arquitectura y Soluciones Técnicas

#### 1. Navegación
La navegación se ha implementado utilizando un componente **Header** global ubicado en el `layout.tsx`. Este componente utiliza:
*   **Next.js Navigation**: Uso de `usePathname` y `useRouter` para detectar la ruta actual y permitir el movimiento entre *Home* y *Perfil*.
*   **Protección de Rutas**: Se implementó una lógica de verificación de token en el `Header` y en las páginas privadas para redirigir al `/login` si el usuario no está autenticado.
#### 2. Gestión de Datos Anidados de la API
Uno de los retos principales fue la integración con el backend, por la estructura de respuesta de los endpoints. Para resolver esto, se crearon **funciones** en el archivo de conexión:

*   **Problema**: La API a veces devuelve los datos directamente en la raíz del objeto de respuesta (`res.data`) lo cual a veces se me ha hecho lioso auqnue al final dandome cuenta de donde estaba el error. 
*   **Solución**: Se implementaron helpers como `sacarTotalPages` y `sacarPosts` que utilizan encadenamiento opcional (*Optional Chaining*).
*   **Paginación**: Se detectó que si no se mapeaba correctamente el campo `totalPaginas`, el frontend por defecto asumía `1`. Al normalizar la extracción de datos, la paginación de la *Home* y del *Perfil* funciona de manera dinámica.

#### 3. Interceptores de Axios
Se configuró un interceptor de peticiones para inyectar automáticamente:
1.  El **Token de Autorización** recuperado del `localStorage`.
2.  Headers personalizados requeridos por el backend, como `x-nombre`.

---

### Estructura de Carpetas
*   `/api`: Lógica de conexión con Axios y funciones de fetch.
*   `/app`: Rutas de la aplicación.
*   `/components`: Componentes reutilizables como `PostCard` y `Header`.
*   `/types`: Definiciones de interfaces de TypeScript para asegurar el tipado de los datos de la API.

---
