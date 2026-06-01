import type { Config } from 'payload'
import type { SanitizedAuditLogConfig } from '../../types.js'
import { createAuditLogCollection } from '../../collections/audit-logs.js'
import { createAuditHooks } from './hooks.js'

interface ChangesLogFieldConfig {
  name: string
  type: 'array'
  admin: {
    description: string
    readOnly: boolean
    components: {
      Field: string
    }
  }
  fields: Array<{
    name: string
    type: string
    admin?: Record<string, unknown>
    options?: Array<{ label: string; value: string }>
    fields?: Array<{
      name: string
      type: string
    }>
  }>
}

export const createChangesLogField = (config: SanitizedAuditLogConfig): ChangesLogFieldConfig => {
  const fieldName = `${config.auditCollectionSlug.replace(/-/g, '_')}_changes`

  return {
    name: fieldName,
    type: 'array',
    admin: {
      description: 'History of changes made to this document',
      readOnly: true,
      components: {
        Field: '/fields/ChangesLog/Component#ChangesLogField',
      },
    },
    fields: [
      {
        name: 'timestamp',
        type: 'date',
        admin: {
          width: '180px',
        },
      },
      {
        name: 'operation',
        type: 'select',
        options: [
          { label: 'Creado', value: 'create' },
          { label: 'Actualizado', value: 'update' },
          { label: 'Eliminado', value: 'delete' },
          { label: 'Restaurado', value: 'restore' },
        ],
        admin: {
          width: '100px',
        },
      },
      {
        name: 'userId',
        type: 'text',
        admin: {
          width: '150px',
        },
      },
      {
        name: 'changes',
        type: 'array',
        admin: {
          description: 'Field-level changes',
        },
        fields: [
          { name: 'field', type: 'text' },
          { name: 'label', type: 'text' },
          { name: 'oldValue', type: 'json' },
          { name: 'newValue', type: 'json' },
        ],
      },
    ],
  }
}

interface HookConfig {
  collectionSlug: string
  auditCollectionSlug: string
  fieldsToTrack: string[] | null
  trackedFields: Record<string, string[]>
  logUser: boolean
}

export const addAuditPlugin = (pluginConfig: HookConfig): ((incomingConfig: Config) => Config) =>
  (incomingConfig: Config): Config => {
    const auditCollection = createAuditLogCollection({
      auditCollectionSlug: pluginConfig.auditCollectionSlug as SanitizedAuditLogConfig['auditCollectionSlug'],
      watch: [],
      trackedFields: {},
      logUser: true,
      logTimestamp: true,
      includeDiffs: true,
    })

    let finalConfig: Config = {
      ...incomingConfig,
      collections: [...(incomingConfig.collections || []), auditCollection],
    }

    finalConfig = {
      ...finalConfig,
      collections: finalConfig.collections?.map((collection) => {
        if (collection.slug === pluginConfig.collectionSlug) {
          const changesLogField = createChangesLogField({
            auditCollectionSlug: pluginConfig.auditCollectionSlug as SanitizedAuditLogConfig['auditCollectionSlug'],
            watch: [],
            trackedFields: {},
            logUser: true,
            logTimestamp: true,
            includeDiffs: true,
          })

          const newField = changesLogField as unknown as Parameters<typeof collection.fields.push>[0]
          collection.fields = [...(collection.fields || []), newField]

          const hooks = createAuditHooks(pluginConfig)

          collection.hooks = {
            ...collection.hooks,
            ...hooks,
          }
        }

        return collection
      }),
    }

    return finalConfig
  }