
import PropTypes from "prop-types";
import { Tooltip } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const CustomTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full  table-auto border-collapse text-left ">
        <thead>
          <tr className="border-b bg-gray-100 text-sm">
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-2 ${col.width || ""}`}>
                {col.label}
              </th>
            ))}
            <th>Action</th>
          </tr>
          
          
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-200 text-sm">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-2 ${col.width || ""}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}

              <td className="px-4 py-2 flex gap-2 ">  
                <Tooltip content="Edit">
                  <button onClick={() => onEdit(row.id)}>
                    <PencilIcon className="h-5 w-5 text-blue-500" />
                  </button>
                </Tooltip>
                <Tooltip content="Delete">
                  <button onClick={() => onDelete(row.id)}>
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
CustomTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CustomTable;

