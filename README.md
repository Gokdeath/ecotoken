# 🌱 EcoToken

> **Plataforma comunitaria de créditos de carbono descentralizados con IA y Blockchain**

![License](https://img.shields.io/badge/license-MIT-green)
![Blockchain](https://img.shields.io/badge/blockchain-Polygon%20Mumbai-8247e5)
![Solidity](https://img.shields.io/badge/solidity-0.8.x-363636)
![Python](https://img.shields.io/badge/python-3.10+-3776ab)
![React](https://img.shields.io/badge/frontend-React%20%2B%20ethers.js-61dafb)

---

## ¿Qué es EcoToken?

EcoToken es una DApp (aplicación descentralizada) que permite a cualquier ciudadano **registrar acciones sustentables**, validar su impacto ambiental mediante **Inteligencia Artificial** y recibir **créditos de carbono tokenizados (ECT)** de forma automática en su wallet.

> 💡 **1 ECT = 1 kg de CO₂ compensado verificado.** Los tokens pueden donarse a ONGs, intercambiarse entre usuarios o venderse a empresas con metas ESG.

---

## El problema que resuelve

Los mercados de créditos de carbono existentes están diseñados para grandes corporaciones. El ciudadano común que recicla, usa bicicleta o instala paneles solares no recibe ningún incentivo formal ni económico por sus acciones. EcoToken cierra esa brecha.

---

## Flujo del sistema

```
Usuario registra acción
        ↓
Foto sube a IPFS (hash CID on-chain)
        ↓
IA valida el impacto (CO₂ en kg)
        ↓
Oráculo firma y llama al smart contract
        ↓
Smart contract emite ECT a la wallet del usuario
        ↓
Dashboard comunitario se actualiza
```

---

## Stack tecnológico

| Capa | Tecnología | Rol |
|------|-----------|-----|
| Frontend | React + ethers.js | Interfaz de usuario y conexión con MetaMask |
| Smart Contracts | Solidity + Hardhat | Token ERC-20 y lógica de registro de acciones |
| Blockchain | Polygon Mumbai (testnet) | Red rápida y de bajo costo |
| Almacenamiento | IPFS + Pinata | Evidencias fotográficas descentralizadas |
| IA / ML | Python + scikit-learn | Validación y cuantificación del impacto |
| Backend / Oráculo | Node.js + Express | Puente entre la IA y el smart contract |
| Base de datos | PostgreSQL | Registro de usuarios y acciones pendientes |
| Deploy | Vercel + Alchemy | Hosting frontend y nodo RPC en Polygon |

---

## Inteligencia Artificial

La IA actúa como árbitro objetivo del sistema. Tres modelos trabajan en conjunto:

- **Regresión supervisada** (scikit-learn) — estima los kg de CO₂ compensados por tipo y cantidad de acción.
- **CNN** (red neuronal convolucional) — analiza la foto de evidencia y verifica que corresponda a la acción declarada.
- **Isolation Forest** — detecta fraude: registros repetidos, metadatos manipulados, patrones anómalos.

La IA expone una **API REST en Python/Flask** que el backend consume y cuyo resultado se transmite al smart contract via oráculo.

---

## Conceptos teóricos aplicados

| Concepto | Aplicación en EcoToken |
|----------|----------------------|
| **Merkle Tree** | Verifica integridad de registros sin descargar toda la cadena |
| **Hash SHA-256** | Identifica cada acción de forma única e inmutable |
| **Smart Contract** | Automatiza la emisión de ECT al validar una acción |
| **ERC-20** | Estándar del token EcoToken (transferible, divisible) |
| **Oráculo** | Puente entre el resultado de la IA y la blockchain |
| **PoS (Polygon)** | Consenso eficiente y de bajo consumo energético |
| **Tokenización** | Convierte acciones sustentables en créditos de carbono |
| **Regresión (ML)** | Predice las toneladas de CO₂ por acción registrada |

---

## Estructura del proyecto

```
ecotoken/
├── contracts/
│   ├── EcoToken.sol          # Token ERC-20 principal (ECT)
│   └── EcoRegistry.sol       # Registro de acciones sustentables
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── hooks/
│   └── package.json
├── ai-validator/
│   ├── model.py              # Regresión CO₂ + CNN + Isolation Forest
│   ├── api.py                # Flask REST API
│   └── requirements.txt
├── oracle/
│   └── index.js              # Puente IA ↔ blockchain (Node.js)
├── scripts/
│   └── deploy.js             # Script de deploy con Hardhat
├── hardhat.config.js
├── .env.example
└── README.md
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/ecotoken.git
cd ecotoken
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

| Variable | Descripción |
|----------|-------------|
| `POLYGON_RPC_URL` | URL del nodo RPC de Polygon Mumbai (ej. Alchemy) |
| `PRIVATE_KEY` | Clave privada del oráculo — **nunca commitear** |
| `PINATA_API_KEY` | API key de Pinata para subir a IPFS |
| `AI_API_URL` | URL del servidor Flask del modelo IA |
| `CONTRACT_ADDRESS` | Dirección del smart contract deployado |

### 3. Instalar dependencias y deployar contratos

```bash
# Smart contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai
```

### 4. Levantar el frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Levantar el modelo IA

```bash
cd ai-validator
pip install -r requirements.txt
python api.py
```

### 6. Levantar el oráculo

```bash
cd oracle
npm install
node index.js
```

---

## MVP — Funcionalidades

| Funcionalidad | Estado | Detalle |
|--------------|--------|---------|
| Registro de acciones sustentables | ✅ MVP | Formulario + foto de evidencia subida a IPFS |
| Validación por IA del impacto | ✅ MVP | Modelo de regresión que devuelve kg de CO₂ |
| Emisión automática de EcoTokens | ✅ MVP | Smart contract ERC-20 se ejecuta tras validación |
| Wallet personal del usuario | ✅ MVP | Conexión con MetaMask, saldo visible en la app |
| Panel de impacto comunitario | ✅ MVP | Dashboard con totales de CO₂ compensado |
| Intercambio de tokens entre usuarios | 🔜 v2 | DEX interno o integración con Uniswap |
| Certificados NFT para empresas | 🔜 v2 | ERC-721 como comprobante de compensación ESG |
| DAO de gobernanza | 🔜 v3 | Votación comunitaria sobre categorías de acciones |

---

## Impacto en la comunidad

**Beneficiarios directos:**
- 👤 **Ciudadanos** — recompensa económica real por acciones que ya realizaban sin incentivo
- 🌿 **ONGs ambientales** — reciben donaciones de tokens de forma transparente
- 🏢 **Empresas ESG** — acceden a créditos de carbono verificados a bajo costo
- 🏛️ **Municipios** — datos reales de impacto ambiental ciudadano para informes de sostenibilidad

**Proyección:**
- **0–6 meses:** ciudad piloto, 10.000 acciones validadas, alianza con una ONG local
- **6–18 meses:** expansión a múltiples ciudades, integración con municipios, marketplace de tokens
- **v3+:** arquitectura DAO autosustentable gestionada por la comunidad

---

## Licencia

Este proyecto está bajo la licencia **MIT**. Podés usarlo, modificarlo y distribuirlo libremente con atribución. Ver archivo [`LICENSE`](./LICENSE) para más detalles.

---

## Contexto académico

> Proyecto desarrollado como Examen Final de **Teoría de Computación II**  
> Universidad Champagnat — Lic. en Sistemas de Información  
> Docente: Carolina Canessa · Demoday: 25/06/2026
