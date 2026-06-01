import type { Config, Plugin } from 'payload'
import type { AuditLogConfig, SanitizedAuditLogConfig } from './types.js'
import { sanitizePluginConfig } from './sanitize.js'
import { createAuditLogCollection } from './collections/audit-logs.js'
import { createChangesLogField, addAuditHooks } from './fields/ChangesLog/index.js'

export const auditLogPlugin =
  (pluginConfig: AuditLogConfig): Plugin =>
  (incomingConfig: Config): Config => {
    const config = sanitizePluginConfig({ pluginConfig })

    const auditCollection = createAuditLogCollection(config)
    const changesLogField = createChangesLogField(config)

    const watchedCollections: string[] = []

    let finalConfig: Config = {
      ...incomingConfig,
      collections: [...(incomingConfig.collections || []), auditCollection],
    }

    finalConfig = {
      ...finalConfig,
      collections: finalConfig.collections?.map((collection) => {
        const watchedConfig = config.watch?.find((w) => w.collection === collection.slug)

        if (watchedConfig) {
          watchedCollections.push(collection.slug)

          const fieldsToTrack = watchedConfig.fields || null

          collection.fields = [...(collection.fields || []), changesLogField]

          collection.hooks = {
            ...collection.hooks,
            ...addAuditHooks({
              collectionSlug: collection.slug,
              auditCollectionSlug: config.auditCollectionSlug,
              fieldsToTrack,
              trackedFields: config.trackedFields,
              logUser: config.logUser,
              logTimestamp: config.logTimestamp,
            }),
          }
        }

        return collection
      }),
    }

    return finalConfig
  }

export type { AuditLogConfig, SanitizedAuditLogConfig } from './types.js'