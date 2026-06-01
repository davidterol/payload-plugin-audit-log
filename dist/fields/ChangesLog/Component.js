import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const operationLabels = {
    create: 'Creado',
    update: 'Actualizado',
    delete: 'Eliminado',
    restore: 'Restaurado',
};
const operationColors = {
    create: '#10b981',
    update: '#3b82f6',
    delete: '#ef4444',
    restore: '#f59e0b',
};
export const ChangesLogField = ({ field }) => {
    const [expanded, setExpanded] = useState({});
    const value = field.value || [];
    const toggleExpand = (index) => {
        setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
    };
    const formatValue = (val) => {
        if (val === null || val === undefined)
            return '-';
        if (typeof val === 'object')
            return JSON.stringify(val, null, 2);
        return String(val);
    };
    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleString();
        }
        catch {
            return dateStr;
        }
    };
    if (value.length === 0) {
        return (_jsx("div", { style: { padding: '16px', textAlign: 'center', color: '#6b7280' }, children: "No hay cambios registrados" }));
    }
    return (_jsxs("div", { style: { fontFamily: 'system-ui, sans-serif' }, children: [_jsxs("div", { style: { fontWeight: 600, marginBottom: 12, fontSize: 14, color: '#374151' }, children: ["Historial de cambios (", value.length, ")"] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: value.map((entry, index) => (_jsxs("div", { style: {
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        overflow: 'hidden',
                    }, children: [_jsxs("div", { onClick: () => toggleExpand(index), style: {
                                padding: '10px 12px',
                                backgroundColor: '#f9fafb',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                justifyContent: 'space-between',
                            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsx("span", { style: {
                                                padding: '2px 8px',
                                                borderRadius: 4,
                                                fontSize: 12,
                                                fontWeight: 500,
                                                backgroundColor: operationColors[entry.operation] + '20',
                                                color: operationColors[entry.operation],
                                            }, children: operationLabels[entry.operation] || entry.operation }), _jsx("span", { style: { fontSize: 13, color: '#6b7280' }, children: formatDate(entry.timestamp) }), entry.userId && (_jsxs("span", { style: { fontSize: 12, color: '#9ca3af' }, children: ["Usuario: ", entry.userId] }))] }), _jsx("span", { style: { fontSize: 12, color: '#9ca3af' }, children: expanded[index] ? '▲' : '▼' })] }), expanded[index] && entry.changes && entry.changes.length > 0 && (_jsx("div", { style: { padding: 12, backgroundColor: '#fff' }, children: _jsxs("table", { style: { width: '100%', fontSize: 13, borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: '#f3f4f6' }, children: [_jsx("th", { style: { padding: '8px', textAlign: 'left', fontWeight: 500 }, children: "Campo" }), _jsx("th", { style: { padding: '8px', textAlign: 'left', fontWeight: 500 }, children: "Valor anterior" }), _jsx("th", { style: { padding: '8px', textAlign: 'left', fontWeight: 500 }, children: "Valor nuevo" })] }) }), _jsx("tbody", { children: entry.changes.map((change, cIndex) => (_jsxs("tr", { style: { borderBottom: '1px solid #f3f4f6' }, children: [_jsx("td", { style: { padding: '8px', fontWeight: 500 }, children: change.label || change.field }), _jsx("td", { style: {
                                                        padding: '8px',
                                                        color: '#dc2626',
                                                        maxWidth: 200,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }, children: formatValue(change.oldValue) }), _jsx("td", { style: {
                                                        padding: '8px',
                                                        color: '#059669',
                                                        maxWidth: 200,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }, children: formatValue(change.newValue) })] }, cIndex))) })] }) }))] }, index))) })] }));
};
export { ChangesLogField as default };
