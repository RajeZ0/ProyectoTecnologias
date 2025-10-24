# Uaemex-Electonicos-JP-JJ-R

Aplicación web para la tienda de componentes electrónicos de la Facultad de Ingeniería de la UAEMéx. El proyecto está construido sobre Next.js 15 con TypeScript y Tailwind CSS, e integra una base de datos PostgreSQL gestionada mediante Prisma para almacenar el catálogo, ofertas y pedidos.

##  Stack principal

- **Framework:** Next.js 15 (App Router) + React 19
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4, Radix UI, shadcn/ui
- **Gráficas:** Recharts
- **ORM / Base de datos:** Prisma + PostgreSQL
- **Herramientas adicionales:** Prisma Studio, tsx

##  Estructura relevante

```
├── app/                  # Rutas y páginas (app router)
│   └── api/              # Endpoints REST para productos y pedidos
├── components/           # Componentes de UI y páginas clientes
├── hooks/                # Hooks personalizados (p.ej. useProducts)
├── lib/
│   └── prisma.ts         # Cliente Prisma reutilizable
├── prisma/
│   ├── schema.prisma     # Modelo de datos (Category, Product, Order, OrderItem)
│   └── seed.ts           # Seed de catálogo/ofertas/pedido de ejemplo
└── public/               # Assets e imágenes de productos
```

##  Requisitos previos

- Node.js 18 o superior (probado con **Node 22**)
- npm (incluido con Node)

##  Instalación y configuración

### Variables de entorno

1. Duplica `.env.example` como `.env`.
2. Reemplaza el valor de `DATABASE_URL` por la cadena de conexión de tu instancia de PostgreSQL.

### Base local rápida con Docker

```bash
docker run --name uaemex-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=uaemex -p 5432:5432 -d postgres:16
```

### Configuración de la app

```bash
# Instalar dependencias
npm install

# Generar el cliente y aplicar migraciones
npx prisma generate
npx prisma migrate deploy

# Sembrar datos de ejemplo
npm run db:seed

# Abrir Prisma Studio (opcional) para inspeccionar la base
npx prisma studio

# Levantar el servidor en http://localhost:8080
npm run dev
```

> Nota: `npm run db:seed` elimina y repuebla las tablas antes de insertar los datos de ejemplo.

## Scripts disponibles

| Script            | Descripción                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| `npm run dev`     | Inicia Next.js en modo desarrollo (puerto **8080**)                          |
| `npm run build`   | Genera el build de producción                                               |
| `npm run start`   | Sirve el build generado                                                     |
| `npm run lint`    | Ejecuta `next lint`                                                         |
| `npm run db:seed` | Ejecuta `prisma db seed` y repuebla la base de datos                        |

## 🗄️ Modelo de datos

El archivo `prisma/schema.prisma` define las entidades:

- **Category** → agrupa productos del catálogo.
- **Product** → información del inventario (precio, stock, oferta, imagen, categoría).
- **Order** → pedidos realizados, con número de orden, totales y ventana de envío.
- **OrderItem** → relación detalle producto ↔ pedido.

Los valores monetarios se guardan como `Float` y las fechas (creación y entrega estimada) en `DateTime`.

### Flujo de migraciones

Las migraciones viven en `prisma/migrations`. Para instalar el esquema en cualquier entorno:

```bash
npx prisma migrate deploy
npm run db:seed
```

##  Endpoints REST

| Método | Ruta              | Descripción                                       |
| ------ | ----------------- | ------------------------------------------------- |
| GET    | `/api/products`   | Lista productos y categorías (filtros opcionales) |
| GET    | `/api/orders`     | Obtiene pedidos de un cliente (`?email=`)         |
| POST   | `/api/orders`     | Registra un pedido y genera número de tracking    |

### Parámetros y filtros

- `GET /api/products?offersOnly=true` → solo ofertas
- `GET /api/products?category=slug` → filtra por categoría

`POST /api/orders` espera un payload:

```json
{
  "customerEmail": "cliente@example.com",
  "customerName": "Invitado",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 7, "quantity": 1 }
  ]
}
```

Responde con la orden creada (total, ventana de entrega, `orderNumber`, etc.).

## Flujo de compra

1. El cliente inicia sesión (o compra como “Invitado”).
2. Agrega productos al carrito desde cualquier listado.
3. `Finalizar Compra` → `components/cart-dropdown` llama a `POST /api/orders`.
4. Se limpia el carrito y se muestra el número de pedido y la fecha estimada.
5. La página **Mis pedidos** (`/orders`) consume `GET /api/orders` y se actualiza automáticamente.

Puedes verificar la inserción del pedido en **Prisma Studio** (`Order` y `OrderItem`).

## Datos de ejemplo

El seed crea:

- 5 categorías principales (pasivos, activos, fuentes de energía, instrumentación, accesorios).
- Catálogo completo con precios, ofertas, stock y rutas de imagen.
- Pedido de ejemplo (`ORD-SEED-001`) para `guest@example.com` con artículos reales.

Edita `prisma/seed.ts` si necesitas ajustar productos u ofertas.

##  Verificación manual

1. `npm run dev`
2. Abre `http://localhost:8080`
3. Recorre catálogo, agrega productos y finaliza una compra
4. Revisa `/orders` y Prisma Studio (`http://localhost:5555`) para confirmar datos

##  Despliegue en Render

1. Publica el repositorio en GitHub y crea en Render un servicio de base de datos **PostgreSQL**. Copia la URL completa (incluye usuario, contraseña, host, puerto y base).
2. En Render crea un **Web Service** apuntando a la rama principal del repo y configura las variables:
   - `DATABASE_URL` → URL del Postgres provisionado.
   - `NODE_VERSION` → `20.17.0`.
3. Ajusta los comandos del servicio:
   - **Build command:** `npm install && npx prisma generate && npm run build`
   - **Start command:** `npm run start`
   - **Post-Deploy command** (ejecutar tras el primer deploy o después de limpiar Datos): `npx prisma migrate deploy && npm run db:seed`
4. Render inyectará `DATABASE_URL` durante el build, por lo que el pre-render de páginas puede leer los datos reales del catálogo.
5. Para refrescar datos después de deploys futuros solo corre de nuevo el Post-Deploy command o ejecuta manualmente `npx prisma migrate deploy` y `npm run db:seed` desde la consola del servicio.

---
