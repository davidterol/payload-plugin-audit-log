import type { AuditLogConfig, SanitizedAuditLogConfig } from './types.js'

export const sanitizePluginConfig = ({ pluginConfig }: { pluginConfig: AuditLogConfig }): SanitizedAuditLogConfig => {
  const config: SanitizedAuditLogConfig = {
    auditCollectionSlug: (pluginConfig.auditCollectionSlug as SanitizedAuditLogConfig['auditCollectionSlug']) || 'audit-logs',
    watch: (pluginConfig.watch || []).map((w) => ({
      collection: w.collection as SanitizedAuditLogConfig['watch'][number]['collection'],
      fields: w.fields || null,
    })),
    trackedFields: pluginConfig.trackedFields || {},
    logUser: pluginConfig.logUser !== false,
    logTimestamp: pluginConfig.logTimestamp !== false,
    includeDiffs: pluginConfig.includeDiffs !== false,
  }

  return config
}