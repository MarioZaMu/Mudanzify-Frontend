/**
 * Every user-facing string in the interface (Spanish).
 * Components must read text from here instead of hardcoding it.
 */
export const es = {
  app: {
    name: 'Mudanzify',
    tagline: 'Traspasa tus datos sin perder, duplicar ni desordenar nada.',
  },
  common: {
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    close: 'Cerrar',
    loading: 'Cargando…',
  },
  theme: {
    label: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
  },
  risk: {
    safe: { label: 'Seguro', description: 'Se puede traspasar sin problemas.' },
    warn: { label: 'Revisar', description: 'Hay algo que conviene revisar antes.' },
    danger: { label: 'Sensible', description: 'Contiene datos sensibles o de alto riesgo.' },
  },
  box: {
    kinds: {
      folder: 'Carpeta',
      spreadsheet: 'Hoja de cálculo',
      contacts: 'Contactos',
      documents: 'Documentos',
    },
    status: {
      open: 'Abierta',
      labeled: 'Etiquetada',
      packed: 'Empacada',
      delivered: 'Entregada',
    },
    items: (count: number) => `${count.toLocaleString('es')} ${count === 1 ? 'elemento' : 'elementos'}`,
    selected: 'Seleccionada',
  },
  ai: {
    badge: 'Sugerencia de la IA',
    accept: 'Aceptar',
    edit: 'Editar',
    reject: 'Rechazar',
    accepted: 'Aceptaste esta sugerencia',
    rejected: 'Rechazaste esta sugerencia',
    undo: 'Deshacer',
  },
  dialog: {
    irreversibleAck: 'Entiendo que esta acción no se puede deshacer.',
  },
  connection: {
    checking: 'Conectando con el backend…',
    connected: 'Conectado al backend',
    browserOnly: 'Sin backend: abre la interfaz desde la app de escritorio',
    error: 'No pudimos conectar con el backend',
  },
  nav: {
    label: 'Navegación principal',
    items: {
      overview: 'Inicio',
      colors: 'Colores',
      typography: 'Tipografía',
      buttons: 'Botones',
      boxes: 'Cajas',
      risk: 'Semáforo',
      ai: 'IA',
      dialogs: 'Modales',
    },
    profileRole: 'Emisor',
  },
  showcase: {
    eyebrow: 'Fase 2 · Sistema de diseño',
    title: 'Sistema de diseño',
    intro:
      'Los bloques con los que construiremos Mudanzify: colores, tipografía, íconos y componentes, en modo claro y oscuro.',
    sections: {
      colors: {
        title: 'Colores',
        description: 'Kraft para las cajas, índigo para la IA y las acciones principales, ámbar para resaltar.',
        swatches: {
          primary: 'Índigo · Primario e IA',
          kraft: 'Kraft · Cajas de datos',
          accent: 'Ámbar · Acento y foco',
          surface: 'Fondo',
          ink: 'Texto principal',
          safe: 'Seguro',
          warn: 'Revisar',
          danger: 'Sensible',
        },
        kraftScale: 'Escala kraft',
      },
      typography: {
        title: 'Tipografía',
        description: 'Geist, una sans geométrica y legible, incluida en la app para funcionar sin internet.',
        display: 'Mudanza',
        titleSample: 'Plan de traspaso',
        body: 'Mudanzify revisa tus datos antes de moverlos: detecta duplicados, vacíos e información sensible.',
        caption: 'Texto secundario para descripciones y ayudas.',
        mono: 'clientes_2024_final_v2.xlsx',
      },
      buttons: {
        title: 'Botones e íconos',
        description: 'Píldoras redondeadas. Cada botón de solo ícono tiene una etiqueta accesible.',
        primary: 'Iniciar traspaso',
        secondary: 'Ver inventario',
        outline: 'Agregar origen',
        ghost: 'Omitir',
        danger: 'Descartar caja',
        loading: 'Analizando',
        disabled: 'No disponible',
        iconLabels: {
          search: 'Buscar',
          notifications: 'Notificaciones',
          add: 'Agregar',
          more: 'Más opciones',
        },
      },
      boxes: {
        title: 'Cajas de datos',
        description: 'Cada grupo de datos es una caja que se etiqueta, se empaca y se entrega.',
        samples: {
          photos: 'Fotos familiares',
          clients: 'Clientes 2024',
          contacts: 'Contactos del equipo',
          contracts: 'Contratos firmados',
        },
        progress: 'Progreso de empaque',
      },
      risk: {
        title: 'Semáforo de riesgo',
        description: 'Nunca depende solo del color: siempre lleva ícono y texto.',
      },
      ai: {
        title: 'Sugerencias de la IA',
        description: 'Todo lo que propone la IA se ve en índigo y puede aceptarse, editarse o rechazarse.',
        suggestion: {
          title: 'Dividir “Nombre completo” en dos columnas',
          body: 'En el destino existen las columnas “Nombre” y “Apellido”. Propongo separar los 312 registros.',
        },
        duplicate: {
          title: '18 archivos duplicados en “Fotos familiares”',
          body: 'Son copias exactas. Sugiero no traspasarlas para ahorrar 1,2 GB.',
        },
      },
      dialogs: {
        title: 'Modales de confirmación',
        description: 'Las acciones destructivas piden una confirmación aparte y visible.',
        openDefault: 'Confirmar traspaso',
        openDanger: 'Descartar caja',
        defaultDialog: {
          title: '¿Iniciar el traspaso?',
          description: 'Se copiarán 4 cajas al destino. Podrás revisar el informe al terminar.',
          confirm: 'Sí, iniciar',
        },
        dangerDialog: {
          title: '¿Descartar “Contratos firmados”?',
          description: 'La caja y sus 86 archivos no se traspasarán. Los originales no se borran.',
          confirm: 'Descartar caja',
        },
        result: {
          confirmed: 'Confirmado',
          cancelled: 'Cancelado',
        },
      },
    },
  },
} as const;

export type Strings = typeof es;
