import type { Config, Plugin } from 'payload'
import type { AuditLogConfig, SanitizedAuditLogConfig } from './types.js'
import { sanitizePluginConfig } from './sanitize.js'
import { createAuditLogCollection } from './collections/audit-logs.js'
import { createChangesLogField } from './fields/ChangesLog/index.js'
import { createAuditHooks } from './fields/ChangesLog/hooks.js'

export const auditLogPlugin =
  (pluginConfig: AuditLogConfig): Plugin =>
  (incomingConfig: Config): Config => {
    const config = sanitizePluginConfig({ pluginConfig })

    const auditCollection = createAuditLogCollection(config)

    let finalConfig: Config = {
      ...incomingConfig,
      collections: [...(incomingConfig.collections || []), auditCollection],
    }

    finalConfig = {
      ...finalConfig,
      collections: finalConfig.collections?.map((collection) => {
        const watchedConfig = config.watch?.find((w) => w.collection === collection.slug)

        if (watchedConfig) {
          const changesLogField = createChangesLogField(config)

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          collection.fields = [...(collection.fields || []), changesLogField as any]

          const hooks = createAuditHooks({
            collectionSlug: collection.slug,
            auditCollectionSlug: config.auditCollectionSlug,
            fieldsToTrack: watchedConfig.fields,
            trackedFields: config.trackedFields,
            logUser: config.logUser,
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

export type { AuditLogConfig, SanitizedAuditLogConfig } from './types.js'