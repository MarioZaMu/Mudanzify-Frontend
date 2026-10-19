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
├── screens/      onboarding, shell, inicio por rol, traspasos (origen, inventario, destino, entrevista y revisión IA) y sistema de diseño
├── session/      SessionProvider: presentación vista y rol (emisor o receptor)
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
  RiskBadge / RiskLight, DataBox (con variante compacta), Alert, AiSuggestion y ConfirmDialog.

## Traspasos (fase 4)

El emisor crea un traspaso y lo completa en tres pasos, cada uno en su propia pantalla:

1. **Origen**: agrega carpetas o archivos (Excel/CSV) con el diálogo nativo del sistema.
2. **Inventario**: el backend lee el origen (solo lectura) y lo agrupa en cajas por tipo de archivo;
   muestra archivos ocultos, temporales o vacíos y una vista previa de las tablas con sus columnas vacías.
3. **Destino**: el emisor elige la carpeta; se revisa permiso de escritura, espacio libre y que no esté dentro del origen.

En esta fase no se mueve, copia ni borra ningún archivo. Eliminar un traspaso borra solo su registro.

## Entrevista con la IA (fase 5)

Cuarto paso del traspaso, disponible cuando el destino no tiene avisos:

- La IA hace entre 3 y 6 preguntas, una a la vez, con respuestas rápidas, un campo libre y la opción de omitir.
  Cada pregunta explica por qué se hace.
- Al terminar resume lo que entendió y propone criterios (alcance, prioridad, duplicados, datos faltantes, datos sensibles).
  Cada criterio se **acepta, edita o rechaza por separado**; al editar se conserva la propuesta original y se puede deshacer.
- Confirmar los criterios pide una confirmación aparte. La IA nunca mueve datos ni elige el destino.
- Una insignia indica siempre si responde la IA real (Google Gemini) o el **modo demo** (sin API key).

## Revisión con IA (fase 6)

Quinto paso, disponible cuando los criterios de la entrevista están confirmados. Una barra de progreso
acompaña el análisis y el resultado se revisa en tres pestañas, sin scroll de página:

- **Hallazgos** (detectados en el equipo): archivos idénticos, filas repetidas, celdas vacías, columnas con
  datos personales (correos, teléfonos, documentos, tarjetas) y archivos temporales, ocultos o vacíos.
  Cada uno trae una sugerencia que sigue los criterios de la entrevista y se **acepta, cambia por otra opción
  o deja tal cual**, con deshacer. Incluir datos personales sin enmascarar pide una confirmación roja aparte.
- **Columnas**: la IA propone unificar columnas con el mismo dato y distinto nombre (ej. Teléfono y Celular);
  cada propuesta se acepta, edita o rechaza.
- **Prioridad**: orden en que se empacarán las cajas, con el motivo de cada una. Se reordena con flechas
  accesibles por teclado y se puede volver a la sugerencia.

El plan se confirma solo cuando todo está decidido; cambiar algo después pide confirmarlo otra vez.
Todavía no se mueve ningún archivo: la ejecución llega en la fase 7.

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
