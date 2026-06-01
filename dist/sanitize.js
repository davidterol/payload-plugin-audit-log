export const sanitizePluginConfig = ({ pluginConfig }) => {
    const config = {
        auditCollectionSlug: pluginConfig.auditCollectionSlug || 'audit-logs',
        watch: (pluginConfig.watch || []).map((w) => ({
            collection: w.collection,
            fields: w.fields || null,
        })),
        trackedFields: pluginConfig.trackedFields || {},
        logUser: pluginConfig.logUser !== false,
        logTimestamp: pluginConfig.logTimestamp !== false,
        includeDiffs: pluginConfig.includeDiffs !== false,
    };
    return config;
};
