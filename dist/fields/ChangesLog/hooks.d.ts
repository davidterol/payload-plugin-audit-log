import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook } from 'payload';
interface HookConfig {
    collectionSlug: string;
    auditCollectionSlug: string;
    fieldsToTrack: string[] | null;
    trackedFields: Record<string, string[]>;
    logUser: boolean;
}
export declare const createAuditHooks: (config: HookConfig) => {
    beforeChange: CollectionBeforeChangeHook[];
    afterChange: CollectionAfterChangeHook[];
    afterDelete: CollectionAfterDeleteHook[];
};
export declare const addAuditHooks: (config: HookConfig) => {
    beforeChange: CollectionBeforeChangeHook[];
    afterChange: CollectionAfterChangeHook[];
    afterDelete: CollectionAfterDeleteHook[];
};
export {};
//# sourceMappingURL=hooks.d.ts.map