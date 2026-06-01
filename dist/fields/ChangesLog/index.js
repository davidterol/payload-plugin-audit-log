import { createAuditLogCollection } from '../../collections/audit-logs.js';
import { createAuditHooks } from './hooks.js';
export const createChangesLogField = (config) => {
    const fieldName = `${config.auditCollectionSlug.replace(/-/g, '_')}_changes`;
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
    };
};
export const addAuditPlugin = (pluginConfig) => (incomingConfig) => {
    const auditCollection = createAuditLogCollection({
        auditCollectionSlug: pluginConfig.auditCollectionSlug,
        watch: [],
        trackedFields: {},
        logUser: true,
        logTimestamp: true,
        includeDiffs: true,
    });
    let finalConfig = {
        ...incomingConfig,
        collections: [...(incomingConfig.collections || []), auditCollection],
    };
    finalConfig = {
        ...finalConfig,
        collections: finalConfig.collections?.map((collection) => {
            if (collection.slug === pluginConfig.collectionSlug) {
                const changesLogField = createChangesLogField({
                    auditCollectionSlug: pluginConfig.auditCollectionSlug,
                    watch: [],
                    trackedFields: {},
                    logUser: true,
                    logTimestamp: true,
                    includeDiffs: true,
                });
                const newField = changesLogField;
                collection.fields = [...(collection.fields || []), newField];
                const hooks = createAuditHooks(pluginConfig);
                collection.hooks = {
                    ...collection.hooks,
                    ...hooks,
                };
            }
            return collection;
        }),
    };
    return finalConfig;
};
