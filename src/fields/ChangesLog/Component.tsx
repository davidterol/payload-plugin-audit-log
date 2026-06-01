import React, { useState } from 'react'

interface Change {
  field: string
  label?: string
  oldValue?: unknown
  newValue?: unknown
}

interface ChangesLogEntry {
  timestamp: string
  operation: 'create' | 'update' | 'delete' | 'restore'
  userId?: string
  changes?: Change[]
}

interface ChangesLogFieldProps {
  field: {
    value: ChangesLogEntry[]
  }
  path: string
}

const operationLabels: Record<string, string> = {
  create: 'Creado',
  update: 'Actualizado',
  delete: 'Eliminado',
  restore: 'Restaurado',
}

const operationColors: Record<string, string> = {
  create: '#10b981',
  update: '#3b82f6',
  delete: '#ef4444',
  restore: '#f59e0b',
}

export const ChangesLogField: React.FC<ChangesLogFieldProps> = ({ field }) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  const value = field.value || []

  const toggleExpand = (index: number): void => {
    setExpanded((prev: Record<number, boolean>) => ({ ...prev, [index]: !prev[index] }))
  }

  const formatValue = (val: unknown): string => {
    if (val === null || val === undefined) return '-'
    if (typeof val === 'object') return JSON.stringify(val, null, 2)
    return String(val)
  }

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleString()
    } catch {
      return dateStr
    }
  }

  if (value.length === 0) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
        No hay cambios registrados
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14, color: '#374151' }}>
        Historial de cambios ({value.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {value.map((entry: ChangesLogEntry, index: number) => (
          <div
            key={index}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <div
              onClick={() => toggleExpand(index)}
              style={{
                padding: '10px 12px',
                backgroundColor: '#f9fafb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: operationColors[entry.operation] + '20',
                    color: operationColors[entry.operation],
                  }}
                >
                  {operationLabels[entry.operation] || entry.operation}
                </span>
                <span style={{ fontSize: 13, color: '#6b7280' }}>
                  {formatDate(entry.timestamp)}
                </span>
                {entry.userId && (
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>
                    Usuario: {entry.userId}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>
                {expanded[index] ? '▲' : '▼'}
              </span>
            </div>
            {expanded[index] && entry.changes && entry.changes.length > 0 && (
              <div style={{ padding: 12, backgroundColor: '#fff' }}>
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 500 }}>Campo</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 500 }}>Valor anterior</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 500 }}>Valor nuevo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.changes.map((change: Change, cIndex: number) => (
                      <tr key={cIndex} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px', fontWeight: 500 }}>
                          {change.label || change.field}
                        </td>
                        <td
                          style={{
                            padding: '8px',
                            color: '#dc2626',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatValue(change.oldValue)}
                        </td>
                        <td
                          style={{
                            padding: '8px',
                            color: '#059669',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatValue(change.newValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { ChangesLogField as default }