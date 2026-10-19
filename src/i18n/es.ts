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
    home: 'Inicio',
    designSystem: 'Sistema de diseño',
  },
  roles: {
    sender: 'Emisor',
    receiver: 'Receptor',
    change: 'Cambiar rol',
  },
  onboarding: {
    skip: 'Omitir presentación',
    back: 'Atrás',
    next: 'Siguiente',
    progress: (step: number, total: number) => `Paso ${step} de ${total}`,
    welcome: {
      eyebrow: 'Bienvenido a Mudanzify',
      title: 'Tu mudanza de datos, sin perder nada',
      body: 'Mueve archivos, carpetas y hojas de cálculo de un lugar a otro sin duplicar, perder ni desordenar nada. Te acompañamos paso a paso.',
      start: 'Empezar',
    },
    pack: {
      eyebrow: '1 · Empaca',
      title: 'Tus datos viajan en cajas',
      body: 'Agrupamos tu información en cajas etiquetadas: fotos, clientes, contactos… Así siempre sabes qué va en cada una y a dónde llega.',
      boxes: { photos: 'Fotos', clients: 'Clientes', contacts: 'Contactos' },
    },
    review: {
      eyebrow: '2 · Revisa',
      title: 'La IA revisa antes de mover',
      body: 'Detecta duplicados, datos incompletos e información sensible, y te explica cada hallazgo. Tú decides qué aceptar.',
      scanning: 'Revisando “Clientes 2024”…',
      findings: {
        duplicates: '12 duplicados',
        gaps: '3 campos vacíos',
        sensitive: 'Correos y teléfonos',
      },
    },
    deliver: {
      eyebrow: '3 · Entrega',
      title: 'Nada se mueve sin tu permiso',
      body: 'Revisas el plan, confirmas y entregas. Quien recibe obtiene un informe claro de qué llegó, qué se descartó y qué quedó pendiente.',
      origin: 'Origen',
      destination: 'Destino',
      confirmed: 'Confirmado por ti',
      report: 'Informe de traspaso',
    },
    role: {
      eyebrow: 'Último paso',
      title: '¿Qué vas a hacer hoy?',
      body: 'Elige tu rol. Puedes cambiarlo cuando quieras.',
      legend: 'Rol',
      sender: {
        title: 'Voy a entregar datos',
        description: 'Preparo la información, reviso el plan de la IA y apruebo el traspaso.',
        points: ['Eliges el origen y el destino', 'Revisas las sugerencias de la IA', 'Confirmas antes de mover nada'],
      },
      receiver: {
        title: 'Voy a recibir datos',
        description: 'Reviso lo que llegó, verifico que esté completo y confirmo la recepción.',
        points: ['Ves los datos ordenados en cajas', 'Lees el informe del traspaso', 'Confirmas que todo llegó bien'],
      },
      continueAs: (role: string) => `Continuar como ${role}`,
      chooseFirst: 'Elige un rol para continuar',
    },
  },
  home: {
    eyebrow: 'Inicio',
    title: {
      sender: 'Listo para empacar',
      receiver: 'Listo para recibir',
    },
    intro: {
      sender: 'Así será tu mudanza de datos. Cada paso se activará a medida que avancemos.',
      receiver: 'Así recibirás los datos. Cada paso se activará a medida que avancemos.',
    },
    soon: 'Próximamente',
    steps: {
      sender: [
        { title: 'Elegir el origen', body: 'Carpetas, archivos o Excel/CSV.' },
        { title: 'Revisar con la IA', body: 'Duplicados, vacíos y datos sensibles.' },
        { title: 'Confirmar y entregar', body: 'Con informe para quien recibe.' },
      ],
      receiver: [
        { title: 'Ver lo recibido', body: 'Los datos ordenados en cajas.' },
        { title: 'Leer el informe', body: 'Qué llegó, qué se descartó y qué falta.' },
        { title: 'Confirmar la recepción', body: 'Verifica que todo esté completo.' },
      ],
    },
    replay: 'Ver la presentación otra vez',
  },
  showcase: {
    eyebrow: 'Guía visual',
    title: 'Sistema de diseño',
    intro:
      'Los bloques con los que construimos Mudanzify: colores, tipografía, íconos y componentes, en modo claro y oscuro.',
    tabsLabel: 'Secciones del sistema de diseño',
    tabs: {
      colors: 'Colores',
      typography: 'Tipografía',
      buttons: 'Botones',
      boxes: 'Cajas',
      risk: 'Semáforo',
      ai: 'IA',
      dialogs: 'Modales',
    },
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
