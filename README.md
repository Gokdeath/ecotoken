# EcoToken

EcoToken es una plataforma academica que simula creditos de carbono con IA y blockchain. No usa criptomonedas reales, smart contracts reales, Solidity, ERC20 ni transacciones blockchain reales.

## Estado de deploy

El proyecto esta preparado para:

- Subirse a GitHub.
- Desplegarse en Vercel.
- Usar PostgreSQL con Prisma.
- Usar Vercel Blob para evidencias fotograficas en produccion.
- Mantener fallback local para uploads durante desarrollo.

## Stack

- Next.js 15 con App Router
- React y TypeScript
- TailwindCSS
- API Routes de Next.js
- Prisma ORM
- PostgreSQL
- Vercel Blob
- bcrypt y JWT
- Recharts
- Lucide React

## Estructura

```text
app/                 Rutas Next.js, paginas y API routes
frontend/components/ Componentes visuales reutilizables
backend/auth/        Sesion, JWT, bcrypt y guards de usuario
backend/db/          Cliente Prisma
backend/services/    IA simulada, blockchain, storage y estadisticas
prisma/              Schema, migraciones y seed
public/uploads/      Fallback local de imagenes
types/               Tipos compartidos
```

## Variables de entorno

Crear `.env` local o configurar estas variables en Vercel:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/ecotoken?schema=public"
JWT_SECRET="un-secreto-largo-y-seguro"
BLOB_READ_WRITE_TOKEN="token-de-vercel-blob"
```

`BLOB_READ_WRITE_TOKEN` es opcional en desarrollo. Si no existe, las imagenes se guardan en `public/uploads`. En Vercel debe configurarse para que las evidencias sean persistentes.

## Instalacion local

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

La app queda disponible en `http://localhost:3000`.

## Deploy en Vercel

1. Subir el repositorio a GitHub.
2. Crear/importar proyecto en Vercel.
3. Agregar una base PostgreSQL, por ejemplo Vercel Postgres, Neon o Supabase.
4. Configurar `DATABASE_URL` en Vercel.
5. Crear un store de Vercel Blob y configurar `BLOB_READ_WRITE_TOKEN`.
6. Configurar `JWT_SECRET`.
7. Vercel ejecuta las migraciones durante el build mediante `vercel.json`.
8. Para cargar datos demo una vez, ejecutar localmente apuntando a la base de Vercel:

```bash
npm run prisma:seed
```

Tambien se pueden ejecutar migraciones manualmente si se prefiere:

```bash
npm run prisma:deploy
```

9. Deployar desde Vercel.

## Credenciales demo

Despues del seed:

```text
admin@ecotoken.edu
EcoToken123!
```

Todos los usuarios demo usan la misma contrasena.

## Flujo principal

1. El usuario se registra o inicia sesion.
2. Registra una accion sustentable con cantidad, descripcion y evidencia fotografica.
3. `backend/services/aiService.ts` valida la accion con reglas matematicas locales.
4. Si la accion es aprobada, el sistema acredita EcoTokens internos en la wallet.
5. Se crea un bloque simulado con SHA-256, hash anterior, timestamp, data y nonce.
6. La transaccion queda disponible en el historial y en el explorador blockchain.

## Reglas IA simulada

- Reciclaje: 1 kg = 0.5 kg CO2
- Bicicleta: 1 km = 0.2 kg CO2
- Energia Solar: 1 kWh = 1.5 kg CO2
- Compostaje: 1 kg = 0.35 kg CO2
- Transporte Publico: 1 km = 0.12 kg CO2

Regla de tokens:

```text
1 kg CO2 = 100 EcoTokens
```

## Nota academica

La blockchain del proyecto es una simulacion educativa. Sirve para explicar hashing SHA-256, bloques, cadena enlazada, tokens internos, inmutabilidad y trazabilidad sin operar sobre una red blockchain real.
