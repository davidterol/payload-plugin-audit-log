export { auditLogPlugin } from './plugin.js'
export type { AuditLogConfig, SanitizedAuditLogConfig, AuditLogEntry, ChangesLogEntry, WatchedField, WatchConfig } from './types.js'
export { createAuditLogCollection } from './collections/audit-logs.js'
export { createChangesLogField, addAuditHooks } from './fields/ChangesLog/index.js'