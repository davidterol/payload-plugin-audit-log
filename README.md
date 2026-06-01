# Payload Audit Log Plugin

Plugin de auditoría para Payload CMS que registra cambios a nivel de campo en documentos.

## Características

- **Colección de auditoría centralizada**: Todos los cambios se almacenan en `audit-logs`
- **Campo de historial en cada documento**: Muestra los cambios realizados directamente en el documento
- **Seguimiento a nivel de campo**: Registra qué campos cambiaron, valores antiguos y nuevos
- **Soporte multi-colección**: Configurable por colección
- **Control de usuario**: Registra qué usuario realizó cada cambio
- **Timestamps precisos**: Fecha y hora de cada operación

## Instalación

```bash
npm install payload-plugin-audit-log
```

## Uso

### Configuración básica

```ts
import { auditLogPlugin } from 'payload-plugin-audit-log'
import { buildConfig } from 'payload'

export default buildConfig({
  // ... tu config
  plugins: [
    auditLogPlugin({
      // Colecciones a monitorear
      watch: [
        {
          collection: 'posts',
          // Campos específicos a trackear (null = todos)
          fields: ['title', 'content', 'status'],
        },
        {
          collection: 'products',
          fields: null, // Trackea todos los campos
        },
      ],
      logUser: true, // Registrar usuario
      logTimestamp: true, // Registrar timestamp
    }),
  ],
})
```

### Opciones del plugin

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `auditCollectionSlug` | `string` | Slug de la colección de auditoría (default: `'audit-logs'`) |
| `watch` | `WatchConfig[]` | Array de configuraciones por colección |
| `trackedFields` | `Record<string, string[]>` | Campos a trackear por colección (alternativa a `watch`) |
| `logUser` | `boolean` | Registrar el usuario que hizo el cambio (default: `true`) |
| `logTimestamp` | `boolean` | Registrar timestamp (default: `true`) |
| `includeDiffs` | `boolean` | Incluir diferencias old/new (default: `true`) |

### Colecciones monitoreadas

El plugin añade automáticamente a cada colección monitorizada:

1. **Campo `audit_logs_changes`**: Array de solo lectura con el historial de cambios
2. **Hooks**: `beforeChange`, `afterChange`, `afterDelete` para registrar cambios

## Colección de Auditoría

La colección `audit-logs` almacena:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `timestamp` | `date` | Fecha y hora del cambio |
| `collection` | `text` | Nombre de la colección |
| `documentId` | `text` | ID del documento afectado |
| `operation` | `select` | `create`, `update`, `delete`, `restore` |
| `userId` | `text` | ID del usuario (si está habilitado) |
| `changes` | `array` | Array de cambios con field, label, oldValue, newValue |

## Ejemplo de uso

```ts
// En payload.config.ts
import { auditLogPlugin } from 'payload-plugin-audit-log'

export default buildConfig({
  // ...
  plugins: [
    auditLogPlugin({
      watch: [
        { collection: 'posts', fields: ['title', 'content'] },
        { collection: 'pages', fields: null }, // Todos los campos
        { collection: 'users', fields: ['name', 'email', 'role'] },
      ],
      logUser: true,
    }),
  ],
})
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Compilar
npm run build

# Desarrollo (requiere MongoDB)
cp dev/.env.example dev/.env
npm run dev
```

## Licencia

MIT