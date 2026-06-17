# Ecogarzones: Gestión de Banquetería Corporativa

Plataforma dedicada para implementar y gestionar las operaciones logísticas y de banquetería corporativa para **Ecogarzones**.

Este repositorio centraliza toda la lógica de negocio distribuida (microservicios backend), el cliente de presentación (React frontend) y la infraestructura de contenedores.

---

## 🚀 Arquitectura del Proyecto

El sistema está estructurado bajo una arquitectura de microservicios (Cloud-First) orientada al despliegue en la nube:

* **`FrontEnd/`**: Capa de presentación desarrollada en **React (Vite) + Tailwind CSS** que simula el Portal del Cliente (Cotizaciones y Pagos vía Transbank Webpay+), Panel Administrador (Métricas, Control de Inventario y Nómina de Personal), Vista del Supervisor (Kanban interactivo de asignación de turnos) y la App Móvil del Staff (check-in geolocalizado, disponibilidad y reporte de incidencias).
* **`BackEnd/`**: 4 Microservicios desarrollados en **Java 21 y Spring Boot 3.2.4**:
  1. `event-service`: Gestión de cotizaciones de banquetes, menús e integración de alertas/calendarios.
  2. `billing-service`: Facturación, honorarios del staff e integración de pasarelas de pago.
  3. `logistics-service`: Control de inventario logístico, disponibilidad de personal, check-in digital e incidencias en tiempo real.
  4. `predictive-analysis-service`: Proyecciones de compra de insumos mediante caché distribuido en **Redis**.
* **Infraestructura**: Docker y Docker-compose para orquestar la base de datos PostgreSQL, la caché de Redis y los microservicios de forma integrada.

---

## 🛠️ Stack Tecnológico

* **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide React.
* **Backend**: Java 21, Spring Boot 3.2.4, Spring Data JPA, Spring Security, OpenAPI 3 (Swagger).
* **Persistencia**: PostgreSQL (múltiples bases de datos independientes).
* **Caché**: Redis.
* **Contenedores**: Docker, Docker Compose.

---

## 💻 Ejecución Local

### Opción A: Previsualización Inmediata en Navegador
Para interactuar con todo el flujo simulado y las vistas de roles del frontend:
1. Instala las dependencias en la raíz:
   ```bash
   npm install
   ```
2. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Opción B: Despliegue con Docker Compose
Para empaquetar y levantar toda la infraestructura real en contenedores:
1. Asegúrate de tener Docker corriendo.
2. Inicia los servicios con el comando:
   ```bash
   docker-compose up --build
   ```
   *Esto compilará los microservicios, configurará las bases de datos individuales de PostgreSQL (`init-multiple-dbs.sh`) y expondrá los servicios.*
