import type { Config } from 'payload';
import type { SanitizedAuditLogConfig } from '../../types.js';
interface ChangesLogFieldConfig {
    name: string;
    type: 'array';
    admin: {
        description: string;
        readOnly: boolean;
        components: {
            Field: string;
        };
    };
    fields: Array<{
        name: string;
        type: string;
        admin?: Record<string, unknown>;
        options?: Array<{
            label: string;
            value: string;
        }>;
        fields?: Array<{
            name: string;
            type: string;
        }>;
    }>;
}
export declare const createChangesLogField: (config: SanitizedAuditLogConfig) => ChangesLogFieldConfig;
interface HookConfig {
    collectionSlug: string;
    auditCollectionSlug: string;
    fieldsToTrack: string[] | null;
    trackedFields: Record<string, string[]>;
    logUser: boolean;
}
export declare const addAuditPlugin: (pluginConfig: HookConfig) => ((incomingConfig: Config) => Config);
export {};
//# sourceMappingURL=index.d.ts.map