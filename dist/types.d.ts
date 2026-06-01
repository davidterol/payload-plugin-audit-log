import type { CollectionSlug, Field } from 'payload';
export interface WatchedField {
    field: string;
    label?: string;
}
export interface WatchConfig {
    collection: string;
    fields?: string[];
}
export interface AuditLogConfig {
    auditCollectionSlug?: string;
    watch?: WatchConfig[];
    trackedFields?: Record<string, string[]>;
    logUser?: boolean;
    logTimestamp?: boolean;
    includeDiffs?: boolean;
}
export interface SanitizedAuditLogConfig {
    auditCollectionSlug: CollectionSlug;
    watch: Array<{
        collection: CollectionSlug;
        fields: string[] | null;
    }>;
    trackedFields: Record<string, string[]>;
    logUser: boolean;
    logTimestamp: boolean;
    includeDiffs: boolean;
}
export interface AuditLogEntry {
    id: string;
    timestamp: string;
    collection: string;
    documentId: string;
    operation: 'create' | 'update' | 'delete' | 'restore';
    userId?: string;
    changes?: Array<{
        field: string;
        label?: string;
        oldValue?: unknown;
        newValue?: unknown;
    }>;
}
export interface ChangesLogEntry {
    timestamp: string;
    operation: 'create' | 'update' | 'delete' | 'restore';
    userId?: string;
    changes?: Array<{
        field: string;
        label?: string;
        oldValue?: unknown;
        newValue?: unknown;
    }>;
}
export type { CollectionSlug, Field };
//# sourceMappingURL=types.d.ts.map