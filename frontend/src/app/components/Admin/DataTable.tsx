// app/admin/components/DataTable.tsx
export default function DataTable({
  headers,
  data,
  keys,
  renderCell = {},
}: {
  headers: string[];
  data: any[];
  keys: string[];
  renderCell?: Record<string, (value?: any, row?: any) => React.ReactNode>;
}) {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {safeData.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            safeData.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {keys.map((key, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {renderCell[key] ? renderCell[key](item[key], item) : item[key]}
                  </td>
                ))}
                {/* Render actions if specified in headers but not in keys */}
                {headers.includes('ACTIONS') && !keys.includes('actions') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {renderCell['actions'] && renderCell['actions'](undefined, item)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
