# Mudanzify · Frontend

Interfaz de **Mudanzify**, el sistema de traspaso inteligente de datos asistido por IA.
Hecha con React, TypeScript y Tailwind CSS. Se ejecuta dentro de la app de escritorio de
[Mudanzify-Backend](https://github.com/MarioZaMu/Mudanzify-Backend), que le da acceso seguro
al sistema mediante `window.mudanzify`.

## Estructura

```
src/
├── bridge/       acceso tipado al puente del backend (contract.ts se sincroniza, no editar)
├── components/   componentes de interfaz
├── hooks/        lógica reutilizable (ej. consultas al backend)
├── i18n/es.ts    todos los textos visibles, en español
└── styles/       Tailwind y estilos base
```

El código está en inglés y toda la interfaz visible en español: los textos se leen siempre desde `src/i18n/es.ts`.

## Instalación

```bash
npm install
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173`. |
| `npm run build` | Verifica tipos y compila a `dist/`. |
| `npm run typecheck` | Verifica tipos con TypeScript. |
| `npm run sync:contract` | Copia el contrato IPC desde `../mudanzify-backend`. |

> Si abres `localhost:5173` en un navegador normal, verás el aviso "Sin backend": es lo esperado.
> Para usar la app completa, ejecuta `npm run dev:all` desde el backend.
