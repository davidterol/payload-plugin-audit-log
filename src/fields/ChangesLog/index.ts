import type { Config, Plugin } from 'payload'
import type { SanitizedAuditLogConfig, ChangesLogEntry } from '../../types.js'
import { createAuditLogCollection } from '../../collections/audit-logs.js'
import { ChangesLogField } from './Component.js'
import { createAuditHooks } from './hooks.js'

export const createChangesLogField = (config: SanitizedAuditLogConfig) => {
  const fieldName = `${config.auditCollectionSlug.replace(/-/g, '_')}_changes`

  return {
    name: fieldName,
    type: 'array',
    admin: {
      description: 'History of changes made to this document',
      readOnly: true,
      components: {
        Field: ChangesLogField,
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
        options: ['create', 'update', 'delete', 'restore'],
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
    hooks: {
      afterRead: [
        async ({ req, siblingData, data }) => {
          if (siblingData?.id || data?.id) {
            const docId = siblingData?.id || data?.id
            const collectionSlug = config.watch?.find(w => 
              req.payload.collections && Object.keys(req.payload.collections).some(
                key => key === siblingData?.collectionSlug || key === data?.collectionSlug
              )
            )?.collection

            if (!collectionSlug) return siblingData

            const auditLogs = await req.payload.find({
              collection: config.auditCollectionSlug,
              where: {
                documentId: { equals: typeof docId === 'string' ? docId : String(docId) },
              },
              limit: 100,
              sort: '-timestamp',
              req,
            })

            const changesLog: ChangesLogEntry[] = auditLogs.docs.map((log: any) => ({
              timestamp: log.timestamp,
              operation: log.operation,
              userId: log.userId,
              changes: log.changes,
            }))

            return changesLog
          }
          return siblingData
        },
      ],
    },
  }
}

export const addAuditPlugin = (pluginConfig: SanitizedAuditLogConfig): Plugin =>
  (incomingConfig: Config): Config => {
    const auditCollection = createAuditLogCollection(pluginConfig)

    let finalConfig: Config = {
      ...incomingConfig,
      collections: [...(incomingConfig.collections || []), auditCollection],
    }

    finalConfig = {
      ...finalConfig,
      collections: finalConfig.collections?.map((collection) => {
        const watchedConfig = pluginConfig.watch?.find((w) => w.collection === collection.slug)

        if (watchedConfig) {
          const changesLogField = createChangesLogField(pluginConfig)

          collection.fields = [...(collection.fields || []), changesLogField as any]

          const hooks = createAuditHooks({
            collectionSlug: collection.slug,
            auditCollectionSlug: pluginConfig.auditCollectionSlug,
            fieldsToTrack: watchedConfig.fields,
            trackedFields: pluginConfig.trackedFields,
            logUser: pluginConfig.logUser,
          })

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