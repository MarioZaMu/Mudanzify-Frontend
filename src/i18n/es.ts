/**
 * Every user-facing string in the interface (Spanish).
 * Components must read text from here instead of hardcoding it.
 */
export const es = {
  app: {
    name: 'Mudanzify',
    tagline: 'Traspasa tus datos sin perder, duplicar ni desordenar nada.',
  },
  setup: {
    phaseLabel: 'Fase 1 · Proyecto base',
    title: 'Todo listo para empezar la mudanza',
    description:
      'La interfaz y el backend de escritorio ya se comunican de forma segura. Este es el punto de partida del proyecto.',
    connection: {
      checking: 'Conectando con el backend…',
      connected: 'Conectado al backend',
      browserOnly: 'Sin backend: abre la interfaz desde la app de escritorio',
      error: 'No pudimos conectar con el backend',
    },
    details: {
      title: 'Detalles del entorno',
      version: 'Versión de la app',
      electron: 'Electron',
      chrome: 'Chromium',
      node: 'Node.js',
      platform: 'Sistema',
      contract: 'Contrato IPC',
    },
    checklist: {
      title: 'Base configurada',
      items: [
        'Electron con aislamiento de contexto y sandbox',
        'Puente seguro mediante preload e IPC',
        'React, TypeScript y Tailwind CSS',
        'Textos centralizados en español',
      ],
    },
  },
} as const;

export type Strings = typeof es;
