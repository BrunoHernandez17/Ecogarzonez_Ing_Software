#!/bin/bash
set -e

# Script de inicialización de múltiples bases de datos en PostgreSQL
# para asegurar la independencia de datos de cada microservicio en desarrollo local.

echo "Inicializando múltiples bases de datos para Ecogarzones..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE ecogarzones_events;
    CREATE DATABASE ecogarzones_billing;
    CREATE DATABASE ecogarzones_logistics;
EOSQL

echo "Bases de datos creadas exitosamente."
