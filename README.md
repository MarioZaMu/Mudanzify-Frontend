# Mudanzify · Frontend

Interfaz de **Mudanzify**, el sistema de traspaso inteligente de datos asistido por IA.
Hecha con React, TypeScript y Tailwind CSS. Se ejecuta dentro de la app de escritorio de
[Mudanzify-Backend](https://github.com/MarioZaMu/Mudanzify-Backend), que le da acceso seguro
al sistema mediante `window.mudanzify`.

## Estructura

```
src/
├── bridge/       acceso tipado al puente del backend (contract.ts se sincroniza, no editar)
├── components/
│   ├── brand/    logo de Mudanzify
│   ├── layout/   barra lateral y estructura
│   └── ui/       componentes base del sistema de diseño
├── hooks/        lógica reutilizable (ej. consultas al backend)
├── i18n/es.ts    todos los textos visibles, en español
├── screens/      pantallas (por ahora, la muestra del sistema de diseño)
├── styles/       tokens de diseño (tokens.css) y estilos base
└── theme/        ThemeProvider: claro, oscuro o sistema
```

El código está en inglés y toda la interfaz visible en español: los textos se leen siempre desde `src/i18n/es.ts`.

## Sistema de diseño

- **Tokens** en `src/styles/tokens.css`: paleta base (`kraft-50…900`, `cream`, `graphite`) y tokens semánticos
  que cambian con el modo oscuro (`surface`, `ink`, `primary`, `accent`, `risk-safe/warn/danger`, `box`).
  Se usan siempre por nombre (`bg-primary`, `text-risk-danger-ink`), nunca con hex sueltos.
- **Índigo** = acciones principales y todo lo que propone la IA. **Kraft** = cajas de datos. **Ámbar** = acento y foco.
- **Semáforo de riesgo**: siempre color + ícono + texto (Seguro, Revisar, Sensible).
- **Contraste**: todos los textos cumplen WCAG AA (4.5:1) en modo claro y oscuro; las variantes `-ink` existen para eso.
- **Tipografía**: Geist y Geist Mono, incluidas en la app (funciona sin internet). **Íconos**: lucide-react.
- **Componentes** (`src/components/ui`): Button, IconButton, Card, Badge, ProgressBar, ThemeToggle,
  RiskBadge / RiskLight, DataBox, AiSuggestion y ConfirmDialog.

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
