# PharmatenderFront

## Descripción
Sistema de gestión de pedidos en línea desarrollado con Angular 16+. Este proyecto forma parte del curso Desarrollo Full Stack III de Duoc UC.

## Estructura del Proyecto
```
src/
  app/
    auth/           # Módulo de autenticación
      components/   # Componentes de auth
      services/     # Servicios de auth
      guards/       # Guards de protección de rutas
    
    shared/         # Elementos compartidos
      components/   # Componentes compartidos
      services/     # Servicios compartidos
    
    admin/          # Panel administrativo
      products/     # Gestión de productos
      orders/       # Gestión de pedidos
      users/        # Gestión de usuarios
    
    shop/           # Tienda pública
      products/     # Catálogo de productos
      cart/         # Carrito de compras
      orders/       # Gestión de pedidos
    
    profile/        # Gestión de perfil
      components/   # Componentes de perfil
    
    models/         # Interfaces y modelos
```

## Requisitos Previos
- Node.js 14+
- Angular CLI 16+
- Git

## Instalación

1. Clonar el repositorio
```bash
git clone [URL_DEL_REPO]
```

2. Instalar dependencias
```bash
npm install
```

3. Instalar AdminLTE
```bash
npm install admin-lte@^3.2
```

4. Iniciar servidor de desarrollo
```bash
ng serve
```

## Documentación Adicional
Ver carpeta `/docs` para documentación detallada sobre:
- Arquitectura del proyecto
- Guía de desarrollo
- Documentación de API
- Documentación de componentes
- Guía de estilos

## Scripts Disponibles
- `ng serve`: Inicia servidor de desarrollo
- `ng build`: Construye el proyecto
- `ng test`: Ejecuta tests unitarios
- `ng lint`: Ejecuta linting del código

## Estructura de Módulos

### Módulo de Autenticación
- Login
- Registro
- Recuperación de contraseña

### Módulo de Tienda
- Catálogo de productos
- Carrito de compras
- Gestión de pedidos

### Módulo Administrativo
- Gestión de productos
- Gestión de pedidos
- Gestión de usuarios

### Módulo de Perfil
- Ver perfil
- Editar perfil

## Convenciones de Código
- Usar TypeScript strict mode
- Nombres de componentes en kebab-case
- Servicios con sufijo .service
- Modelos con sufijo .model
- Documentar métodos públicos

## Contribución
1. Crear rama desde develop
2. Nombrar ramas: feature/nombre-funcionalidad
3. Commits descriptivos
4. Pull Request a develop

## Contacto
[Tu Nombre]
[Tu Email]