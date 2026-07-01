# 🥂 EcoGarzones - Plataforma de Gestión de Banquetería

Bienvenido al repositorio oficial de **EcoGarzones**, una plataforma integral de gestión de eventos, banquetería y personal (staff) con un diseño visual Premium. 

Este proyecto está construido bajo una arquitectura moderna dividida en un servidor robusto (Backend) con Spring Boot y PostgreSQL, y una interfaz de usuario dinámica (Frontend) con React y Vite.

---

## 🌟 Características Principales

### 1. Portal de Clientes (Cotizador Dinámico)
- Flujo interactivo de 4 pasos para armar el evento ideal.
- Selección dinámica de minutas (menús tradicionales, veganos, celíacos, etc.) traídas directamente de la base de datos.
- Cálculo de presupuesto automático según la cantidad de invitados, el tipo de evento y la barra seleccionada.
- Seguimiento de peticiones donde el cliente visualiza si su solicitud fue **Aprobada** o **Rechazada**.

### 2. Panel Administrativo (Admin)
- Control total sobre todas las operaciones de la plataforma.
- Revisión de cotizaciones entrantes con la opción de aprobarlas para convertirlas en eventos formales o rechazarlas.
- Vista panorámica de los presupuestos y utilidades.

### 3. Logística de Eventos (Supervisor)
- Herramienta avanzada para la **Delegación de Tareas**.
- El sistema detecta automáticamente la cantidad de personal requerida en función del número de invitados de cada evento aprobado.
- Asignación dinámica de `Garzones`, `Chefs`, `Bartenders` y personal de `Aseo` leyendo la disponibilidad desde la Base de Datos.

### 4. Portal del Empleado (Staff)
- Vista adaptativa dependiendo del rol del empleado que inicie sesión.
- Visualización de calendario de tareas.
- **Chefs:** Visualizan en detalle la minuta exacta que deben preparar para su evento asignado.
- **Demás roles:** Reciben detalles sobre mesas asignadas, horarios y requerimientos logísticos.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React, Vite, TailwindCSS, Lucide-React.
- **Backend:** Java, Spring Boot, Spring Security (JWT Auth), Spring Data JPA.
- **Base de Datos:** PostgreSQL.

---

## 🚀 Cómo inicializar el proyecto localmente

Este proyecto requiere ejecutar ambos entornos (Frontend y Backend) en paralelo. Sigue los siguientes pasos:

### 1. Configurar la Base de Datos (PostgreSQL)
Asegúrate de tener PostgreSQL instalado y ejecutándose en el puerto `5432`.
1. Crea una base de datos llamada `ecogarzones`.
2. Las credenciales por defecto configuradas en el backend son:
   - Usuario: `postgres`
   - Contraseña: `route` *(puedes cambiarlo en `application.properties`)*.

El backend cuenta con un **DataInitializer** que, si detecta la base de datos vacía, poblará automáticamente:
- **Minutas:** 6 opciones diferentes (Vegano, Tradicional, Dulce, etc).
- **Usuarios y Roles:** Crea automáticamente roles de `ADMIN`, `SUPERVISOR`, `CHEF`, `GARZON`, `BARTENDER` y `ASEO`.

### 2. Inicializar el Servidor Backend (Spring Boot)
Abre una terminal, dirígete a la carpeta `BackEnd` y ejecuta:

```bash
cd BackEnd
.\mvnw spring-boot:run
```
*(El servidor se levantará en `http://localhost:8080`)*.

### 3. Inicializar el Cliente Frontend (React / Vite)
Abre otra terminal, dirígete a la carpeta `FrontEnd` y ejecuta:

```bash
cd FrontEnd
npm install
npm run dev
```
*(La aplicación web estará disponible en `http://localhost:5173`)*.

---

## 🔐 Credenciales de Acceso (Usuarios de Prueba)

Gracias al script de inicialización automática de la base de datos, puedes probar todos los flujos utilizando las siguientes cuentas (la contraseña para todos es su sufijo + `123` o lo puedes revisar en DataInitializer, pero a fines prácticos, aquí tienes accesos directos):

- **Administrador:** `admin@ecogarzones.cl` (Pass: `admin123`)
- **Supervisor:** `juan.sup@ecogarzones.cl` o `marta.sup@ecogarzones.cl` (Pass: `sup123`)
- **Chef:** `maria.chef@ecogarzones.cl` (Pass: `chef123`)
- **Garzón:** `pedro.g@ecogarzones.cl` (Pass: `garzon123`)
- **Bartender:** `luis.b@ecogarzones.cl` (Pass: `bar123`)
- **Aseo:** `ana.a@ecogarzones.cl` (Pass: `aseo123`)

*(O puedes utilizar las "Credenciales Rápidas" directamente en la pantalla de Inicio de Sesión que hacen login automático para acelerar el testeo).*

---

## 📝 Notas para Colaboradores
Si estás leyendo esto porque vas a expandir la aplicación, considera:
- **Estado de Minutas:** Solamente las minutas en estado `APROBADA` se mostrarán en el cotizador del cliente.
- **JWT:** El token expira actualmente en 24 horas. Los endpoints seguros validan el rol automáticamente según lo declarado en `SecurityConfig.java`.
- **Modo Standalone:** Si ejecutas el Frontend sin iniciar el Backend, el sistema intentará retroceder a un estado local "Mock" estático, ¡pero para funcionalidad completa, siempre inicia ambos!
