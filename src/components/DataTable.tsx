import { useState } from 'react';

interface Column {
  header: string;
  accessor: string;
  cell?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  pagination?: boolean;
  sorting?: boolean;
  searchable?: boolean;
}

const DataTable = ({ columns, data, loading, pagination, sorting, searchable }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = searchable 
    ? data.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  if (loading) {
    return <div className="text-center py-4">Yükleniyor...</div>;
  }

  return (
    <div className="overflow-x-auto">
      {searchable && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Ara..."
            className="w-full max-w-xs px-4 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 border-b text-left bg-gray-50">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 border-b">
                  {column.cell ? column.cell(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredData.length === 0 && (
        <div className="text-center py-4">Veri bulunamadı</div>
      )}
    </div>
  );
};

export default DataTable; 