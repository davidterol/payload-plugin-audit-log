import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
} from 'payload'
import type { SanitizedAuditLogConfig, AuditLogEntry } from '../../types.js'

interface HookConfig {
  collectionSlug: string
  auditCollectionSlug: string
  fieldsToTrack: string[] | null
  trackedFields: Record<string, string[]>
  logUser: boolean
}

const getFieldsToTrack = (config: HookConfig): string[] | null => {
  if (config.fieldsToTrack) return config.fieldsToTrack
  return config.trackedFields[config.collectionSlug] || null
}

const detectChanges = (
  originalDoc: Record<string, unknown>,
  data: Record<string, unknown>,
  fieldsToTrack: string[] | null
): Array<{ field: string; label?: string; oldValue?: unknown; newValue?: unknown }> => {
  const changes: Array<{ field: string; label?: string; oldValue?: unknown; newValue?: unknown }> = []

  const fieldsToProcess = fieldsToTrack || Object.keys(data)

  for (const field of fieldsToProcess) {
    if (field.startsWith('_') || field === 'id' || field === 'updatedAt' || field === 'createdAt') continue

    const oldVal = originalDoc?.[field]
    const newVal = data[field]

    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({
        field,
        oldValue: oldVal,
        newValue: newVal,
      })
    }
  }

  return changes
}

export const createAuditHooks = (config: HookConfig) => {
  const auditBeforeChange: CollectionBeforeChangeHook = async ({ data, originalDoc, operation }) => {
    if (operation === 'create' || operation === 'update') {
      const fieldsToTrack = getFieldsToTrack(config)

      if (operation === 'update' && originalDoc) {
        const changes = detectChanges(originalDoc as Record<string, unknown>, data as Record<string, unknown>, fieldsToTrack)
        ;(data as Record<string, unknown>).__auditChanges = changes
      }
    }
    return data
  }

  const auditAfterChange: CollectionAfterChangeHook = async ({
    doc,
    operation,
    req,
    previousDoc,
  }) => {
    const userId = config.logUser ? String(req.user?.id || req.user?.email || 'unknown') : undefined
    const fieldsToTrack = getFieldsToTrack(config)

    let changes: Array<{ field: string; label?: string; oldValue?: unknown; newValue?: unknown }> = []

    if (operation === 'update') {
      changes = ((doc as Record<string, unknown>).__auditChanges as typeof changes) || []
      if (changes.length === 0) {
        changes = detectChanges(previousDoc as Record<string, unknown> || {}, doc as Record<string, unknown>, fieldsToTrack)
      }
    } else if (operation === 'create') {
      for (const key of Object.keys(doc)) {
        if (!key.startsWith('_') && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
          changes.push({
            field: key,
            newValue: (doc as Record<string, unknown>)[key],
          })
        }
      }
    }

    const auditEntry: Omit<AuditLogEntry, 'id'> = {
      timestamp: new Date().toISOString(),
      collection: config.collectionSlug,
      documentId: String(doc.id),
      operation,
      userId,
      changes: changes.length > 0 ? changes : undefined,
    }

    try {
      await req.payload.create({
        collection: config.auditCollectionSlug,
        data: auditEntry as Record<string, unknown>,
        req,
      })
    } catch (error) {
      req.payload.logger.error({
        msg: 'Failed to create audit log entry',
        err: error,
      })
    }

    return doc
  }

  const auditAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
    if (!doc) return

    const userId = config.logUser ? String(req.user?.id || req.user?.email || 'unknown') : undefined

    const auditEntry = {
      timestamp: new Date().toISOString(),
      collection: config.collectionSlug,
      documentId: String(doc.id),
      operation: 'delete' as const,
      userId,
    }

    try {
      await req.payload.create({
        collection: config.auditCollectionSlug,
        data: auditEntry as Record<string, unknown>,
        req,
      })
    } catch (error) {
      req.payload.logger.error({
        msg: 'Failed to create audit log entry for delete',
        err: error,
      })
    }
  }

  return {
    beforeChange: [auditBeforeChange],
    afterChange: [auditAfterChange],
    afterDelete: [auditAfterDelete],
  }
}

export const addAuditHooks = (config: HookConfig) => createAuditHooks(config)