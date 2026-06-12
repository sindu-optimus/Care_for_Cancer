export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-base text-left">

        {/* Header */}
        <thead className="bg-slate-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-base font-semibold text-slate-500 tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-slate-400"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`
                  bg-white transition-colors
                  ${onRowClick ? "cursor-pointer hover:bg-slate-50" : ""}
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-slate-700">
                    {col.render ? col.render(row, rowIndex) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}