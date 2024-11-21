#!/bin/bash

# Detener contenedores anteriores
docker-compose down

# Limpiar imágenes antiguas
docker system prune -f

# Construir y ejecutar la nueva versión
docker-compose up --build -d

# Mostrar logs
docker-compose logs -f