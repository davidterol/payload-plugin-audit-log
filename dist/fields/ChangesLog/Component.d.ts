import React from 'react';
interface Change {
    field: string;
    label?: string;
    oldValue?: unknown;
    newValue?: unknown;
}
interface ChangesLogEntry {
    timestamp: string;
    operation: 'create' | 'update' | 'delete' | 'restore';
    userId?: string;
    changes?: Change[];
}
interface ChangesLogFieldProps {
    field: {
        value: ChangesLogEntry[];
    };
    path: string;
}
export declare const ChangesLogField: React.FC<ChangesLogFieldProps>;
export { ChangesLogField as default };
//# sourceMappingURL=Component.d.ts.map