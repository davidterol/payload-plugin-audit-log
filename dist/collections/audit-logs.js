export const createAuditLogCollection = (config) => ({
    slug: config.auditCollectionSlug,
    admin: {
        useAsTitle: 'timestamp',
        description: 'Auditory trail of document changes',
        defaultColumns: ['timestamp', 'collection', 'operation', 'userId'],
    },
    access: {
        read: () => true,
        create: () => false,
        update: () => false,
        delete: () => false,
    },
    hooks: {
        beforeChange: [
            ({ data, operation }) => {
                if (operation === 'create') {
                    data.timestamp = new Date().toISOString();
                }
                return data;
            },
        ],
    },
    fields: [
        {
            name: 'timestamp',
            type: 'date',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'collection',
            type: 'text',
            index: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'documentId',
            type: 'text',
            index: true,
        },
        {
            name: 'operation',
            type: 'select',
            options: ['create', 'update', 'delete', 'restore'],
            index: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'userId',
            type: 'text',
            index: true,
        },
        {
            name: 'changes',
            type: 'array',
            admin: {
                description: 'Field-level changes recorded',
            },
            fields: [
                { name: 'field', type: 'text' },
                { name: 'label', type: 'text' },
                { name: 'oldValue', type: 'json' },
                { name: 'newValue', type: 'json' },
            ],
        },
    ],
    timestamps: false,
});
