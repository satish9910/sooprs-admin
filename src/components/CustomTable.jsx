import React from "react";

const CustomTable = ({ data, columns, dataTransform }) => {
  // Apply any custom transformations if provided
  const transformedData = dataTransform ? dataTransform(data) : data;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            {columns?.map((col, index) => (
              <th key={index} className="border-b px-4 py-2 text-left">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transformedData?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns?.map((col, colIndex) => (
                <td key={colIndex} className="border-b px-4 py-2">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
